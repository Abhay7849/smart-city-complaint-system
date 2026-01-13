import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api/contacts';

function App() {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [page, searchTerm, sortBy, order]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}?search=${searchTerm}&page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`);
      setContacts(response.data.contacts);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to fetch contacts');
    }
  };

  const handleCreate = async (contact) => {
    try {
      const response = await axios.post(API_BASE_URL, contact);
      setContacts([...contacts, response.data]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create contact');
    }
  };

  const handleUpdate = async (id, contact) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, contact);
      setContacts(contacts.map(c => c.id === id ? response.data : c));
      setEditingContact(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update contact');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setContacts(contacts.filter(c => c.id !== id));
      setError('');
      fetchContacts(); // Refresh to update pagination
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="App">
      <h1>Contacts Manager</h1>
      {error && <div className="error">{error}</div>}
      <div className="search">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <ContactForm
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editingContact={editingContact}
        onCancelEdit={handleCancelEdit}
      />
      <ContactList
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortBy={sortBy}
        order={order}
      />
      <div className="pagination">
        {page > 1 && <button onClick={() => handlePageChange(page - 1)}>Previous</button>}
        <span>Page {page} of {Math.ceil(total / limit)}</span>
        {page < Math.ceil(total / limit) && <button onClick={() => handlePageChange(page + 1)}>Next</button>}
      </div>
    </div>
  );
}

export default App;