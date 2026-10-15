import React, { useState } from 'react';

/**
 * TaskForm component for creating new tasks.
 */
function TaskForm({ onAddTask, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!title.trim()) {
      setValidationError('Please enter a task title.');
      return;
    }

    setValidationError('');

    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
      });

      // Clear the form fields after successful submission
      setTitle('');
      setDescription('');
    } catch {
      // Error is handled in parent App component
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add New Task</h2>

      {validationError && (
        <div className="form-error" role="alert">
          {validationError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="task-title">
          Title <span className="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className="form-input"
          placeholder="e.g. Design homepage mockup"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError('');
          }}
          disabled={isLoading}
          maxLength={255}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description">Description (optional)</label>
        <textarea
          id="task-description"
          className="form-textarea"
          placeholder="Add details, notes, or sub-tasks..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-submit"
        disabled={isLoading || !title.trim()}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span> Adding Task...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </>
        )}
      </button>
    </form>
  );
}

export default TaskForm;
