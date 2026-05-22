import { useNavigate } from 'react-router-dom';
import PriorityBadge from './PriorityBadge.jsx';
import ProgressBar from './ProgressBar.jsx';

function daysLabel(days) {
  if (days == null) return '';
  if (days < 0) return `${-days}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days}d left`;
}

export default function TaskCard({ task, onDelete, deleting }) {
  const pct = computeProgress(task);
  const nav = useNavigate();

  function open() {
    nav(`/task/${task.id}`);
  }

  function onEdit(e) {
    e.stopPropagation();
    nav(`/task/${task.id}?edit=1`);
  }

  function onDeleteClick(e) {
    e.stopPropagation();
    onDelete && onDelete(task.id);
  }

  return (
    <div
      className={`card task-card clickable priority-${task.priority} ${task.priority === 'COMPLETED' ? 'is-completed' : ''}`}
      onClick={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') open(); }}
    >
      <div className="stripe" />
      <div className="body" style={{ paddingLeft: 0 }}>
        <div className="title-row">
          <h3 className="title">{task.title}</h3>
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="meta">
          {task.courseName && <span className="course-pill">{task.courseName}</span>}
          <span>📅 {task.dueDate || '—'}</span>
          <span>{daysLabel(task.daysRemaining)}</span>
          {task.estimatedWorkloadHours > 0 && <span>~{task.estimatedWorkloadHours}h</span>}
        </div>
        <ProgressBar percent={pct} />
        {task.warningMessage && (
          <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--red)', fontWeight: 600 }}>
            ⚠ {task.warningMessage}
          </div>
        )}
      </div>
      <div className="right">
        <span className="progress-pct">{pct}%</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--grey)' }}>complete</span>
        <div className="task-actions">
          <button className="task-action-btn" onClick={onEdit} title="Edit task" aria-label="Edit task">✏️</button>
          <button
            className="task-action-btn danger"
            onClick={onDeleteClick}
            title="Delete task"
            aria-label="Delete task"
            disabled={deleting}
          >
            {deleting ? <span className="spinner" /> : '🗑️'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function computeProgress(task) {
  if (!task.checklist || task.checklist.length === 0) return 0;
  const done = task.checklist.filter(c => c.completed).length;
  return Math.round((done * 100) / task.checklist.length);
}
