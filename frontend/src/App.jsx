import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import { getAllTasks, createTask, updateTask, deleteTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch tasks on initial component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Helper to load tasks from backend
  const fetchTasks = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to load tasks. Please ensure the backend server and MySQL database are running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-dismiss success message after 3.5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handler: Add a new task
  const handleAddTask = async (taskData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      setSuccessMessage(`Task "${newTask.title}" created successfully!`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create task.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Toggle completed status
  const handleToggleComplete = async (id, completed) => {
    setErrorMessage('');
    try {
      const updated = await updateTask(id, { completed });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: updated.completed } : t))
      );
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update task completion status.');
    }
  };

  // Handler: Update task title and description
  const handleUpdateTask = async (id, updates) => {
    setErrorMessage('');
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
      setSuccessMessage(`Task #${id} updated successfully!`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update task.');
      throw err;
    }
  };

  // Handler: Delete task
  const handleDeleteTask = async (id) => {
    setErrorMessage('');
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccessMessage(`Task #${id} deleted successfully!`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete task.');
    }
  };

  // Calculate task counts
  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div>
            <h1 className="app-title">Task Manager</h1>
            <p className="app-subtitle">Full-Stack Fundamentals: React + Express + MySQL</p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-refresh"
          onClick={fetchTasks}
          disabled={isLoading}
          title="Refresh task list from database"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </header>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="alert alert-error" role="alert">
          <span>{errorMessage}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setErrorMessage('')}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="status">
          <span>{successMessage}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setSuccessMessage('')}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Grid: Left Column (Add Form), Right Column (List & Filters) */}
      <main className="main-layout">
        <section className="form-column">
          <TaskForm onAddTask={handleAddTask} isLoading={isSubmitting} />

          <div className="architecture-card">
            <h4>Architecture Flow</h4>
            <div className="flow-steps">
              <span className="flow-pill flow-react">React (Vite)</span>
              <span className="flow-arrow">→</span>
              <span className="flow-pill flow-api">REST API</span>
              <span className="flow-arrow">→</span>
              <span className="flow-pill flow-node">Express</span>
              <span className="flow-arrow">→</span>
              <span className="flow-pill flow-mysql">MySQL</span>
            </div>
          </div>
        </section>

        <section className="list-column">
          <TaskFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner large"></div>
              <p>Loading tasks from MySQL database...</p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              currentFilter={filter}
              onToggleComplete={handleToggleComplete}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
