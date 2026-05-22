export default function ProgressBar({ percent, thick = false }) {
  const pct = Math.max(0, Math.min(100, percent || 0));
  return (
    <div className={`progress ${thick ? 'thick' : ''}`} role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
      <div className="fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
