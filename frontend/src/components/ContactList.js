import React from 'react';

function ContactList({ contacts, onEdit, onDelete, onSort, sortBy, order }) {
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
            Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}
          </th>
          <th onClick={() => onSort('email')} style={{ cursor: 'pointer' }}>
            Email {sortBy === 'email' && (order === 'ASC' ? '↑' : '↓')}
          </th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => (
          <tr key={contact.id}>
            <td>{contact.name}</td>
            <td>{contact.email}</td>
            <td>{contact.phone}</td>
            <td>
              <button onClick={() => onEdit(contact)}>Edit</button>
              <button onClick={() => onDelete(contact.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContactList;