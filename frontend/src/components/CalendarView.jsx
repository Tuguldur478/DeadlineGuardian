import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function isoDate(d) { return d.toISOString().slice(0, 10); }

export default function CalendarView({ tasks }) {
  const [cursor, setCursor] = useState(new Date());

  const tasksByDay = useMemo(() => {
    const map = {};
    for (const t of tasks) {
      if (!t.dueDate) continue;
      (map[t.dueDate] ||= []).push(t);
    }
    return map;
  }, [tasks]);

  const monthStart = startOfMonth(cursor);
  // ISO weekday: Mon=1..Sun=7 → 0-indexed Mon=0
  const startWeekday = (monthStart.getDay() + 6) % 7;
  const totalDays = daysInMonth(cursor);
  const todayIso = isoDate(new Date());

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
    cells.push({ d, iso: isoDate(date) });
  }

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function shift(n) {
    const next = new Date(cursor);
    next.setMonth(next.getMonth() + n);
    setCursor(next);
  }

  const upcoming = tasks
    .filter(t => t.dueDate && t.dueDate >= todayIso)
    .slice(0, 8);

  return (
    <div>
      <div className="cal-controls">
        <h2>{monthLabel}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn small" onClick={() => shift(-1)}>←</button>
          <button className="btn small" onClick={() => setCursor(new Date())}>Today</button>
          <button className="btn small" onClick={() => shift(1)}>→</button>
        </div>
      </div>

      <div className="cal-grid" style={{ marginBottom: 8 }}>
        {WEEKDAYS.map(w => <div key={w} className="cal-weekday">{w}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} className="cal-day empty" />;
          const todays = tasksByDay[cell.iso] || [];
          const isToday = cell.iso === todayIso;
          return (
            <div key={i} className={`cal-day ${isToday ? 'today' : ''}`}>
              <div className="daynum">{cell.d}</div>
              {todays.slice(0, 2).map(t => (
                <Link to={`/task/${t.id}`} key={t.id} style={{ textDecoration: 'none', display: 'block', minWidth: 0, maxWidth: '100%' }}>
                  <div className={`pill ${t.priority}`}>{t.title}</div>
                </Link>
              ))}
              {todays.length > 2 && (
                <div className="pill" style={{ background: 'var(--grey)' }}>+{todays.length - 2} more</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="section-label" style={{ marginTop: 28 }}>Upcoming deadlines</div>
      <div className="dashboard-grid">
        {upcoming.length === 0 && <div className="empty-state">No upcoming deadlines 🎉</div>}
        {upcoming.map(t => (
          <Link key={t.id} to={`/task/${t.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card clickable" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{t.title}</div>
                <div style={{ color: 'var(--grey)', fontSize: '0.85rem' }}>{t.courseName} · due {t.dueDate}</div>
              </div>
              <div className={`priority-badge ${t.priority}`}>
                <span className="dot" /> {t.priority}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
