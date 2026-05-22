import { useNotifications } from './NotificationContext.jsx';

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.toastId} className={`toast type-${t.type}`}>
          <div className="toast-icon">{t.icon}</div>
          <div className="toast-text">
            <div className="toast-title">{t.title}</div>
            <div className="toast-body">{t.body}</div>
          </div>
          <button className="toast-close" onClick={() => dismissToast(t.toastId)} aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  );
}
