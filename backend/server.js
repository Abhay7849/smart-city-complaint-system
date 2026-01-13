const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/contacts', contactsRouter);

// Health check
app.get('/', (req, res) => {
  res.send('Contacts Manager API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;