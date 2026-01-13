import React, { useState, useEffect } from 'react';

function ContactForm({ onCreate, onUpdate, editingContact, onCancelEdit }) {
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (editingContact) {
      setContact(editingContact);
    } else {
      setContact({ name: '', email: '', phone: '' });
    }
  }, [editingContact]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContact) {
      onUpdate(editingContact.id, contact);
    } else {
      onCreate(contact);
      setContact({ name: '', email: '', phone: '' });
    }
  };

  const handleCancel = () => {
    setContact({ name: '', email: '', phone: '' });
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={contact.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={contact.phone}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{editingContact ? 'Update' : 'Create'} Contact</button>
      {editingContact && <button type="button" onClick={handleCancel}>Cancel</button>}
    </form>
  );
}

export default ContactForm;