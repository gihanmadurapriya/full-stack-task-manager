// Task Controller - Handles business logic and database queries for tasks
const { pool } = require('../config/db');

/**
 * GET /api/tasks
 * Fetch all tasks from the database, sorted with newest first.
 */
async function getAllTasks(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error while fetching tasks.' });
  }
}

/**
 * GET /api/tasks/:id
 * Fetch a single task by its ID.
 */
async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    // Validate that ID is a positive integer
    const taskId = parseInt(id, 10);
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'Invalid task ID. ID must be a positive integer.' });
    }

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error fetching task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error while fetching task.' });
  }
}

/**
 * POST /api/tasks
 * Create a new task.
 * Request body: { title: string, description?: string }
 */
async function createTask(req, res) {
  try {
    const { title, description } = req.body;

    // Request validation: title is required and cannot be whitespace only
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required and cannot be empty.' });
    }

    const cleanTitle = title.trim();
    const cleanDescription = typeof description === 'string' ? description.trim() : '';

    // Execute parameterized insert to prevent SQL injection
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, completed) VALUES (?, ?, false)',
      [cleanTitle, cleanDescription]
    );

    // Fetch newly created task from database to return full record including created_at
    const [newRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

    res.status(201).json(newRows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error while creating task.' });
  }
}

/**
 * PUT /api/tasks/:id
 * Update an existing task.
 * Supports updating title, description, and/or completed status.
 */
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'Invalid task ID. ID must be a positive integer.' });
    }

    // Check if the task exists
    const [existingRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }

    const existingTask = existingRows[0];
    const { title, description, completed } = req.body;

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ message: 'Task title cannot be empty.' });
      }
    }

    // Validate completed status if provided
    if (completed !== undefined) {
      if (typeof completed !== 'boolean' && completed !== 0 && completed !== 1) {
        return res.status(400).json({ message: 'Completed status must be a boolean (true or false).' });
      }
    }

    // Merge updated values with existing record
    const updatedTitle = title !== undefined ? title.trim() : existingTask.title;
    const updatedDescription = description !== undefined
      ? (typeof description === 'string' ? description.trim() : '')
      : existingTask.description;
    const updatedCompleted = completed !== undefined ? Boolean(completed) : existingTask.completed;

    // Execute update query
    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
      [updatedTitle, updatedDescription, updatedCompleted, taskId]
    );

    // Fetch and return the updated task
    const [updatedRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

    res.status(200).json(updatedRows[0]);
  } catch (error) {
    console.error(`Error updating task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error while updating task.' });
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID.
 */
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({ message: 'Invalid task ID. ID must be a positive integer.' });
    }

    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }

    res.status(200).json({
      message: 'Task deleted successfully.',
      id: taskId
    });
  } catch (error) {
    console.error(`Error deleting task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error while deleting task.' });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
