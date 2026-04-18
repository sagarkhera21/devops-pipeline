const express = require('express');
const path = require('node:path');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev')); // Logging requests
app.use(express.static(path.join(__dirname, '../public'))); // Serve frontend

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Interactive counter endpoint
let counterObj = { count: 0 };
app.get('/api/counter', (req, res) => {
  counterObj.count++;
  res.status(200).json({ count: counterObj.count });
});

module.exports = app;
//