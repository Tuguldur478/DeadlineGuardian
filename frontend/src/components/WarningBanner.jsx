export default function WarningBanner({ level = 'info', title, message, icon }) {
  const defaultIcon = level === 'urgent' ? '⚠️' : level === 'warn' ? '⏰' : 'ℹ️';
  return (
    <div className={`warning-banner ${level}`}>
      <div className="icon">{icon || defaultIcon}</div>
      <div className="text">
        <strong>{title}</strong>
        {message && <small>{message}</small>}
      </div>
    </div>
  );
}
