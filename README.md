# Contacts Manager

A simple web application to manage contacts with CRUD operations.

## Features

- Create, Read, Update, Delete contacts
- Search by name or email
- Pagination (10 contacts per page)
- Sorting by name or email (ascending/descending)
- Validation for email and phone
- SQLite database for persistence
- RESTful API
- Docker support
- Unit tests for backend
- CI/CD with GitHub Actions

## Tech Stack

- Backend: Node.js, Express, SQLite
- Frontend: React
- Database: SQLite

## Setup and Run

### Prerequisites

- Node.js (v16 or higher)
- npm

### Manual Setup

1. Clone the repository.

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Start the backend:
   ```
   cd ../backend
   npm start
   ```

5. Start the frontend:
   ```
   cd ../frontend
   npm start
   ```

6. Open http://localhost:3000 in your browser.

### Using Docker

1. Build and run with Docker Compose:
   ```
   docker-compose up --build
   ```

2. Open http://localhost:3000 in your browser.

## API Endpoints

- GET /api/contacts - Get all contacts (with optional search, pagination, sorting query params)
  - Query params: search, page, limit, sortBy, order
- GET /api/contacts/:id - Get contact by ID
- POST /api/contacts - Create new contact
- PUT /api/contacts/:id - Update contact
- DELETE /api/contacts/:id - Delete contact

## Testing

Run tests for backend:
```
cd backend
npm test
```

Run tests for frontend:
```
cd frontend
npm test
```

## Database Schema

```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  phone VARCHAR(25) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```