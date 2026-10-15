import React from 'react';
import TaskItem from './TaskItem';

/**
 * TaskList component renders the list of tasks or an empty state message.
 */
function TaskList({ tasks, currentFilter, onToggleComplete, onUpdateTask, onDeleteTask }) {
  if (tasks.length === 0) {
    const emptyMessages = {
      all: {
        title: 'No tasks found',
        subtitle: 'Get started by creating your first task above!',
      },
      active: {
        title: 'No active tasks',
        subtitle: 'All tasks have been completed. Great job!',
      },
      completed: {
        title: 'No completed tasks yet',
        subtitle: 'Check off some tasks to see them here.',
      },
    };

    const msg = emptyMessages[currentFilter] || emptyMessages.all;

    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">{msg.title}</h3>
        <p className="empty-state-text">{msg.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
