// Task Routes - Maps HTTP verbs and endpoints to taskController methods
const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// GET /api/tasks — Retrieve all tasks
router.get('/', getAllTasks);

// GET /api/tasks/:id — Retrieve a single task by ID
router.get('/:id', getTaskById);

// POST /api/tasks — Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id — Update an existing task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
