import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from './NotificationContext.jsx';

export default function NotificationBell() {
  const { notifications, unseenCount, markAllSeen } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on click outside
  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  function toggleOpen() {
    setOpen(o => {
      const next = !o;
      if (next) markAllSeen();   // opening the bell clears the unread badge
      return next;
    });
  }

  const count = notifications.length;
  const hasUrgent = notifications.some(n => n.type === 'deadline' && n.icon === '🚨');

  return (
    <div className="bell-wrap" ref={ref}>
      <button
        className={`bell-btn ${hasUrgent && unseenCount > 0 ? 'urgent' : ''}`}
        onClick={toggleOpen}
        aria-label={`Notifications (${unseenCount} unread)`}
      >
        <span className="bell-icon">🔔</span>
        {unseenCount > 0 && <span className="bell-badge">{unseenCount > 9 ? '9+' : unseenCount}</span>}
      </button>

      {open && (
        <div className="bell-popover">
          <div className="bell-popover-header">
            <strong>Notifications</strong>
            <span style={{ color: 'var(--grey)', fontSize: '0.85rem' }}>
              {count === 0 ? 'All clear' : `${count} active`}
            </span>
          </div>
          <div className="bell-popover-body">
            {count === 0 && (
              <div className="bell-empty">
                <div style={{ fontSize: '2rem' }}>🎯</div>
                <div>You're all caught up.</div>
              </div>
            )}
            {notifications.map(n => (
              <Link
                key={n.id}
                to={`/task/${n.taskId}`}
                onClick={() => setOpen(false)}
                className={`bell-item type-${n.type}`}
              >
                <div className="bell-item-icon">{n.icon}</div>
                <div className="bell-item-text">
                  <div className="bell-item-title">{n.title}</div>
                  <div className="bell-item-body">{n.body}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
