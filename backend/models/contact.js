const db = require('../database/db');

class Contact {
  static create(contact, callback) {
    const { name, email, phone } = contact;
    const sql = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, phone], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, name, email, phone });
    });
  }

  static findAll(callback, options = {}) {
    const { page = 1, limit = 10, sortBy = 'name', order = 'ASC' } = options;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM contacts ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
    db.all(sql, [limit, offset], (err, rows) => {
      if (err) {
        return callback(err);
      }
      // Get total count for pagination
      db.get(`SELECT COUNT(*) as total FROM contacts`, [], (err, countRow) => {
        if (err) {
          return callback(err);
        }
        callback(null, { contacts: rows, total: countRow.total, page, limit });
      });
    });
  }

  static findById(id, callback) {
    const sql = `SELECT * FROM contacts WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  }

  static update(id, contact, callback) {
    const { name, email, phone } = contact;
    const sql = `UPDATE contacts SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [name, email, phone, id], function(err) {
      if (err) {
        return callback(err);
      }
      if (this.changes === 0) {
        return callback(new Error('Contact not found'));
      }
      callback(null, { id, name, email, phone });
    });
  }

  static delete(id, callback) {
    const sql = `DELETE FROM contacts WHERE id = ?`;
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      if (this.changes === 0) {
        return callback(new Error('Contact not found'));
      }
      callback(null);
    });
  }

  static search(query, callback, options = {}) {
    const { page = 1, limit = 10, sortBy = 'name', order = 'ASC' } = options;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM contacts WHERE name LIKE ? OR email LIKE ? ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
    const searchTerm = `%${query}%`;
    db.all(sql, [searchTerm, searchTerm, limit, offset], (err, rows) => {
      if (err) {
        return callback(err);
      }
      // Get total count for pagination
      db.get(`SELECT COUNT(*) as total FROM contacts WHERE name LIKE ? OR email LIKE ?`, [searchTerm, searchTerm], (err, countRow) => {
        if (err) {
          return callback(err);
        }
        callback(null, { contacts: rows, total: countRow.total, page, limit });
      });
    });
  }
}

module.exports = Contact;