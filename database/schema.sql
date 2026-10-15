-- =====================================================
-- Task Manager Database Schema
-- Database: task_manager
-- Table: tasks
-- =====================================================

-- Step 1: Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS task_manager;

-- Step 2: Select and use the database
USE task_manager;

-- Step 3: Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Insert sample starter tasks for demonstration
INSERT INTO tasks (title, description, completed) VALUES
('Set up development environment', 'Install Node.js, MySQL, and required packages.', TRUE),
('Build Express REST API', 'Implement GET, POST, PUT, and DELETE endpoints with validation.', TRUE),
('Develop React Frontend', 'Create UI components for task listing, filtering, and editing.', FALSE),
('Test End-to-End Flow', 'Verify full CRUD workflow from UI to Express and MySQL.', FALSE);
