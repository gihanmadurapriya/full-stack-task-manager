// Express Server Entry Point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable Cross-Origin Resource Sharing so our React frontend can communicate with this API
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Base Route - API Info & Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Manager API is running!',
    endpoints: {
      'GET /api/tasks': 'Get all tasks',
      'GET /api/tasks/:id': 'Get task by ID',
      'POST /api/tasks': 'Create a new task',
      'PUT /api/tasks/:id': 'Update an existing task',
      'DELETE /api/tasks/:id': 'Delete a task'
    }
  });
});

// Mount Task API Routes
app.use('/api/tasks', taskRoutes);

// 404 Not Found handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err);
  res.status(500).json({
    message: 'An unexpected internal server error occurred.'
  });
});

// Start the Express server and verify database connection
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(` Task Manager Backend running on http://localhost:${PORT}`);
  console.log(`===============================================`);
  await testConnection();
});
