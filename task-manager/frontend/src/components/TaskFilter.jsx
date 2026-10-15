import React from 'react';

/**
 * TaskFilter component allows filtering tasks by status: All, Active, or Completed.
 */
function TaskFilter({ currentFilter, onFilterChange, counts }) {
  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="filter-container">
      <div className="filter-buttons" role="tablist" aria-label="Task status filters">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={currentFilter === filter.key}
            className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
          >
            <span>{filter.label}</span>
            <span className="filter-badge">{filter.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskFilter;
