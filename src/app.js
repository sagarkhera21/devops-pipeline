const express = require('express');
const path = require('node:path');
const morgan = require('morgan');
const promClient = require('prom-client');
const userRoutes = require('./routes/userRoutes');

// Initialize Prometheus metrics collection
promClient.collectDefaultMetrics();

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

// Front-end Metrics endpoint
app.get('/api/metrics', (req, res) => {
  res.status(200).json({
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: Date.now()
  });
});

// Official Prometheus Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.send(await promClient.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Interactive counter endpoint
let counterObj = { count: 0 };
app.get('/api/counter', (req, res) => {
  counterObj.count++;
  res.status(200).json({ count: counterObj.count });
});

module.exports = app;
//