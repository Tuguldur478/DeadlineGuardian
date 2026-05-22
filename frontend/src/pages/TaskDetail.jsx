import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { computeProgress } from '../components/TaskCard.jsx';
import Checklist from '../components/Checklist.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import WarningBanner from '../components/WarningBanner.jsx';

export default function TaskDetail({ reload }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [task, setTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  async function load() {
    try {
      const t = await api.getTask(id);
      setTask(t);
      if (searchParams.get('edit') === '1') {
        setDraft({ title: t.title, courseName: t.courseName || '', dueDate: t.dueDate || '', estimatedWorkloadHours: t.estimatedWorkloadHours || 0 });
        setEditing(true);
      }
    }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, [id]);

  function startEdit() {
    setDraft({
      title: task.title,
      courseName: task.courseName || '',
      dueDate: task.dueDate || '',
      estimatedWorkloadHours: task.estimatedWorkloadHours || 0
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const updated = await api.updateTask(id, {
        title: draft.title,
        courseName: draft.courseName,
        dueDate: draft.dueDate,
        estimatedWorkloadHours: Number(draft.estimatedWorkloadHours) || 0
      });
      setTask(updated);
      setEditing(false);
      reload && reload();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setSaving(true);
    try {
      await api.deleteTask(id);
      reload && reload();
      nav('/');
    } catch (e) { setError(e.message); setSaving(false); }
  }

  async function toggle(idx) {
    if (!task) return;
    const next = { ...task, checklist: task.checklist.map((c, i) => i === idx ? { ...c, completed: !c.completed } : c) };
    setTask(next);
    setSaving(true);
    try {
      const updated = await api.updateTask(id, { checklist: next.checklist });
      setTask(updated);
      reload && reload();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function reanalyzeOne() {
    setSaving(true);
    try {
      await api.reanalyze();
      await load();
      reload && reload();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  if (error) return <div className="empty-state" style={{ color: 'var(--red)' }}>⚠ {error}</div>;
  if (!task) return <div className="empty-state">Loading…</div>;

  const pct = computeProgress(task);
  const daysLabel = task.daysRemaining < 0
    ? `${-task.daysRemaining}d overdue`
    : task.daysRemaining === 0 ? 'Due today'
    : task.daysRemaining === 1 ? 'Due tomorrow'
    : `${task.daysRemaining}d left`;

  return (
    <>
      <div className="page-header">
        <div>
          <Link to="/" style={{ color: 'var(--grey)', fontWeight: 600, textDecoration: 'none' }}>← Back to dashboard</Link>
          <h1 style={{ marginTop: 8 }}>{task.title}</h1>
          <p className="page-subtitle">
            <span className="course-pill" style={{ marginRight: 8 }}>{task.courseName}</span>
            Due {task.dueDate} · {daysLabel}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <PriorityBadge priority={task.priority} />
          <button className="btn small" onClick={startEdit} disabled={saving}>✏️ Edit</button>
          <button className="btn small danger" onClick={handleDelete} disabled={saving}>🗑️ Delete</button>
          <button className="btn primary" onClick={reanalyzeOne} disabled={saving}>
            {saving ? <span className="spinner" /> : '↻ Reanalyze'}
          </button>
        </div>
      </div>

      {editing && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 14 }}>Edit task</h3>
          <div className="manual-form">
            <div className="field">
              <label>Title</label>
              <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Course</label>
                <input value={draft.courseName} onChange={e => setDraft(d => ({ ...d, courseName: e.target.value }))} />
              </div>
              <div className="field">
                <label>Due date</label>
                <input type="date" value={draft.dueDate} onChange={e => setDraft(d => ({ ...d, dueDate: e.target.value }))} />
              </div>
            </div>
            <div className="field">
              <label>Estimated hours</label>
              <input type="number" min="0" value={draft.estimatedWorkloadHours} onChange={e => setDraft(d => ({ ...d, estimatedWorkloadHours: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn primary" onClick={saveEdit} disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : '💾 Save changes'}
              </button>
              <button className="btn ghost" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {task.warningMessage && (
        <WarningBanner level={task.priority === 'HIGH' ? 'urgent' : 'warn'}
          title={task.warningMessage}
          message={task.startRecommendation}
        />
      )}

      <div className="detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontFamily: 'var(--font-display)' }}>Progress</h3>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>{pct}%</span>
            </div>
            <ProgressBar percent={pct} thick />
            <p style={{ marginTop: 12, marginBottom: 0, color: 'var(--grey)', fontSize: '0.9rem' }}>
              {task.checklist.filter(c => c.completed).length} of {task.checklist.length} steps complete
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 14 }}>AI breakdown</h3>
            <Checklist items={task.checklist} onToggle={toggle} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="detail-stat">
            <div className="label">Priority</div>
            <div className="value">{task.priority}</div>
          </div>
          <div className="detail-stat">
            <div className="label">Days remaining</div>
            <div className="value">{Math.max(0, task.daysRemaining)}</div>
          </div>
          <div className="detail-stat">
            <div className="label">Estimated effort</div>
            <div className="value">{task.estimatedWorkloadHours || 0}h</div>
          </div>
          {task.startRecommendation && (
            <div className="detail-stat" style={{ background: 'var(--teal-soft)' }}>
              <div className="label">AI recommends</div>
              <div style={{ marginTop: 4, fontWeight: 500 }}>💡 {task.startRecommendation}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
