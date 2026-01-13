const request = require('supertest');
const app = require('./server');

describe('Contacts API', () => {
  it('should create a contact', async () => {
    const response = await request(app)
      .post('/api/contacts')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John Doe');
  });

  it('should get all contacts', async () => {
    const response = await request(app)
      .get('/api/contacts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.contacts)).toBe(true);
  });

  it('should return error for invalid email', async () => {
    const response = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Jane Doe',
        email: 'invalid-email',
        phone: '1234567890'
      });
    expect(response.status).toBe(400);
  });

  it('should search contacts', async () => {
    const response = await request(app)
      .get('/api/contacts?search=John');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.contacts)).toBe(true);
  });

  it('should get contact by id', async () => {
    // First create a contact
    const createResponse = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '0987654321'
      });
    const contactId = createResponse.body.id;

    const response = await request(app)
      .get(`/api/contacts/${contactId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test User');
  });

  it('should update a contact', async () => {
    // First create a contact
    const createResponse = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Update Test',
        email: 'update@example.com',
        phone: '1111111111'
      });
    const contactId = createResponse.body.id;

    const response = await request(app)
      .put(`/api/contacts/${contactId}`)
      .send({
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '2222222222'
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Name');
  });

  it('should delete a contact', async () => {
    // First create a contact
    const createResponse = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Delete Test',
        email: 'delete@example.com',
        phone: '3333333333'
      });
    const contactId = createResponse.body.id;

    const response = await request(app)
      .delete(`/api/contacts/${contactId}`);
    expect(response.status).toBe(204);
  });
});