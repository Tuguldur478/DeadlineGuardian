export default function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge ${priority}`}>
      <span className="dot" />
      {priority}
    </span>
  );
}
