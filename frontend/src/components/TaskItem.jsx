import React, { useState } from 'react';

/**
 * TaskItem component renders an individual task card.
 * Supports viewing, editing inline, toggling completion, and deleting.
 */
function TaskItem({ task, onToggleComplete, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editError, setEditError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format creation timestamp
  const formattedDate = task.created_at
    ? new Date(task.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty.');
      return;
    }
    setEditError('');
    setIsSaving(true);
    try {
      await onUpdateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        completed: task.completed,
      });
      setIsEditing(false);
    } catch {
      // Error handled in App
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditError('');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete task #${task.id}: "${task.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDeleteTask(task.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : 'active'}`}>
      {isEditing ? (
        // EDIT MODE
        <form className="edit-form" onSubmit={handleSave}>
          <div className="edit-header">
            <span className="task-id-badge">Task #{task.id}</span>
            <span className="edit-mode-label">Editing Task</span>
          </div>

          {editError && <div className="form-error">{editError}</div>}

          <div className="form-group">
            <label htmlFor={`edit-title-${task.id}`}>Title</label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              className="form-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={isSaving}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-desc-${task.id}`}>Description</label>
            <textarea
              id={`edit-desc-${task.id}`}
              className="form-textarea"
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="edit-actions">
            <button
              type="submit"
              className="btn btn-save"
              disabled={isSaving || !editTitle.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // VIEW MODE
        <>
          <div className="task-header">
            <div className="task-header-left">
              <label className="checkbox-wrapper" title={task.completed ? 'Mark as active' : 'Mark as completed'}>
                <input
                  type="checkbox"
                  checked={Boolean(task.completed)}
                  onChange={() => onToggleComplete(task.id, !task.completed)}
                  aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <span className="custom-checkmark"></span>
              </label>
              <span className="task-id">#{task.id}</span>
            </div>

            <div className="task-header-right">
              <span className={`status-pill ${task.completed ? 'pill-completed' : 'pill-active'}`}>
                {task.completed ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>

          <div className="task-body">
            <h3 className={`task-title ${task.completed ? 'completed-text' : ''}`}>
              {task.title}
            </h3>
            {task.description ? (
              <p className="task-description">{task.description}</p>
            ) : (
              <p className="task-description empty-desc">No description provided</p>
            )}
          </div>

          <div className="task-footer">
            <div className="task-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formattedDate}</span>
            </div>

            <div className="task-actions">
              <button
                type="button"
                className="btn-icon btn-edit"
                onClick={() => setIsEditing(true)}
                title="Edit task"
                aria-label={`Edit task ${task.id}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit</span>
              </button>

              <button
                type="button"
                className="btn-icon btn-delete"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete task"
                aria-label={`Delete task ${task.id}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;
