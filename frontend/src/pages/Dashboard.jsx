import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import TaskCard, { computeProgress } from '../components/TaskCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import WarningBanner from '../components/WarningBanner.jsx';

export default function Dashboard({ tasks, reload }) {
  const [reanalyzing, setReanalyzing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const nav = useNavigate();

  async function reanalyze() {
    setReanalyzing(true);
    try {
      const res = await api.reanalyze();
      setSummary(res.summary);
      await reload();
    } catch (e) {
      setSummary('⚠ ' + e.message);
    } finally {
      setReanalyzing(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.deleteTask(id);
      await reload();
    } catch (e) {
      alert('Could not delete: ' + e.message);
    } finally {
      setDeletingId(null);
    }
  }

  const activeTasks = tasks.filter(t => t.priority !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.priority === 'COMPLETED');

  const dueThisWeek = tasks.filter(t => t.daysRemaining != null && t.daysRemaining <= 7 && t.priority !== 'COMPLETED');
  const overallPct = tasks.length === 0 ? 0 :
    Math.round(tasks.reduce((a, t) => a + computeProgress(t), 0) / tasks.length);

  const highCount = tasks.filter(t => t.priority === 'HIGH').length;
  const urgent = tasks.find(t => t.priority === 'HIGH' && t.daysRemaining != null && t.daysRemaining <= 2);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="greeting">
            Good morning, <span className="stroke">Alex</span> <span className="accent">👋</span>
          </div>
          <p className="page-subtitle">
            You have <strong>{dueThisWeek.length}</strong> task{dueThisWeek.length !== 1 ? 's' : ''} due this week.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn accent lg" onClick={() => nav('/chat')}>+ New Task</button>
          <button className="btn primary lg" onClick={reanalyze} disabled={reanalyzing}>
            {reanalyzing ? <><span className="spinner" /> Analysing…</> : '↻ Reanalyze workload'}
          </button>
        </div>
      </div>

      {urgent && (
        <WarningBanner
          level="urgent"
          title={`${urgent.title} — ${urgent.daysRemaining === 0 ? 'due today' : urgent.daysRemaining === 1 ? 'due tomorrow' : `due in ${urgent.daysRemaining} days`}`}
          message={urgent.startRecommendation || 'Start now to stay on track'}
          icon="🚨"
        />
      )}
      {!urgent && highCount > 0 && (
        <WarningBanner
          level="warn"
          title={`${highCount} high-priority task${highCount !== 1 ? 's' : ''}`}
          message="Tap Reanalyze to refresh recommendations"
        />
      )}
      {summary && (
        <WarningBanner level="info" title="Reanalysis complete" message={summary} icon="✨" />
      )}

      <div className="card" style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Overall progress this week</strong>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>{overallPct}%</span>
        </div>
        <ProgressBar percent={overallPct} thick />
      </div>

      <div className="section-label">Active tasks ({activeTasks.length})</div>
      <div className="dashboard-grid">
        {tasks.length === 0 && (
          <div className="empty-state">
            No tasks yet. <button className="btn primary small" onClick={() => nav('/chat')}>Create your first one</button>
          </div>
        )}
        {activeTasks.length === 0 && tasks.length > 0 && (
          <div className="empty-state">All caught up — no active tasks 🎉</div>
        )}
        {activeTasks.map(t => (
          <TaskCard key={t.id} task={t} onDelete={handleDelete} deleting={deletingId === t.id} />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <>
          <div className="section-label" style={{ marginTop: 28 }}>Completed ({completedTasks.length})</div>
          <div className="dashboard-grid">
            {completedTasks.map(t => (
              <TaskCard key={t.id} task={t} onDelete={handleDelete} deleting={deletingId === t.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
