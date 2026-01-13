const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Validation helper
function validateContact(contact) {
  const errors = [];
  if (!contact.name || contact.name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.push('Valid email is required');
  }
  if (!contact.phone || contact.phone.length < 10) {
    errors.push('Phone must be at least 10 characters');
  }
  return errors;
}

// GET /api/contacts - Read list
router.get('/', (req, res) => {
  const { search, page = 1, limit = 10, sortBy = 'name', order = 'ASC' } = req.query;
  const options = { page: parseInt(page), limit: parseInt(limit), sortBy, order: order.toUpperCase() };
  if (search) {
    Contact.search(search, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    }, options);
  } else {
    Contact.findAll((err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    }, options);
  }
});

// GET /api/contacts/:id - Read detail
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Contact.findById(id, (err, contact) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  });
});

// POST /api/contacts - Create
router.post('/', (req, res) => {
  const contact = req.body;
  const errors = validateContact(contact);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  Contact.create(contact, (err, newContact) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newContact);
  });
});

// PUT /api/contacts/:id - Update
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const contact = req.body;
  const errors = validateContact(contact);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  Contact.update(id, contact, (err, updatedContact) => {
    if (err) {
      if (err.message === 'Contact not found') {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json(updatedContact);
  });
});

// DELETE /api/contacts/:id - Delete
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Contact.delete(id, (err) => {
    if (err) {
      if (err.message === 'Contact not found') {
        return res.status(404).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});

module.exports = router;