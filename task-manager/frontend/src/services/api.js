// API Service - Centralized module for all HTTP requests to the backend REST API

// By default, communicate directly with the Express backend at port 5000,
// or fallback to relative URL '/api' if hosted or proxied.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to handle HTTP responses and extract JSON data or error messages
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * GET /api/tasks — Fetch all tasks
 */
export async function getAllTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
}

/**
 * GET /api/tasks/:id — Fetch a single task by ID
 */
export async function getTaskById(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
}

/**
 * POST /api/tasks — Create a new task
 * @param {Object} taskData - { title: string, description?: string }
 */
export async function createTask(taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
}

/**
 * PUT /api/tasks/:id — Update an existing task
 * @param {number|string} id - Task ID
 * @param {Object} updates - { title?: string, description?: string, completed?: boolean }
 */
export async function updateTask(id, updates) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
}

/**
 * DELETE /api/tasks/:id — Delete a task
 * @param {number|string} id - Task ID
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
}
