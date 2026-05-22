export default function Checklist({ items, onToggle }) {
  if (!items || items.length === 0) {
    return <div className="empty-state">No steps yet. Use the AI chat to generate a breakdown.</div>;
  }
  return (
    <div className="checklist">
      {items.map((item, i) => (
        <div
          key={item.id || i}
          className={`check-item ${item.completed ? 'done' : ''}`}
          onClick={() => onToggle && onToggle(i)}
          role="checkbox"
          aria-checked={item.completed}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle && onToggle(i); } }}
        >
          <div className="box">✓</div>
          <div className="content">
            <div className="title">{item.title}</div>
            {item.description && <div className="desc">{item.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
