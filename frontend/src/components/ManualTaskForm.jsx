import { useState } from 'react';
import { api } from '../api.js';
import { useNavigate } from 'react-router-dom';

export default function ManualTaskForm({ onCreated }) {
  const today = new Date();
  const inAWeek = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);

  const [form, setForm] = useState({
    courseName: '',
    assignmentTitle: '',
    dueDate: inAWeek,
    teacherInstructions: '',
    classContext: '',
    deliverable: '',
    courseMaterial: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    if (!form.assignmentTitle.trim() || !form.dueDate) {
      setError('Title and due date are required');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const task = await api.createFromAi(form);
      onCreated && onCreated(task);
      nav(`/task/${task.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ background: 'var(--white)' }}>
      <h2 style={{ marginBottom: 6 }}>New Assignment</h2>
      <p style={{ marginTop: 0, color: 'var(--grey)', marginBottom: 18 }}>
        Paste whatever you have. The AI will turn it into a structured task with a checklist.
      </p>
      <div className="manual-form">
        <div className="field-row">
          <div className="field">
            <label>Course</label>
            <input value={form.courseName} onChange={e => set('courseName', e.target.value)} placeholder="e.g. CS401" />
          </div>
          <div className="field">
            <label>Due Date *</label>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Assignment Title *</label>
          <input value={form.assignmentTitle} onChange={e => set('assignmentTitle', e.target.value)} placeholder="e.g. Machine Learning Essay" />
        </div>
        <div className="field">
          <label>Teacher Instructions</label>
          <textarea value={form.teacherInstructions} onChange={e => set('teacherInstructions', e.target.value)} placeholder="Paste from the syllabus or assignment brief..." />
        </div>
        <div className="field">
          <label>What needs to be delivered</label>
          <input value={form.deliverable} onChange={e => set('deliverable', e.target.value)} placeholder="e.g. 1500-word essay + slide deck" />
        </div>
        <div className="field">
          <label>Class background (optional)</label>
          <textarea value={form.classContext} onChange={e => set('classContext', e.target.value)} placeholder="Context about the class, topics covered..." />
        </div>
        <div className="field">
          <label>Course material excerpt (optional)</label>
          <textarea value={form.courseMaterial} onChange={e => set('courseMaterial', e.target.value)} placeholder="Paste notes, syllabus snippets, etc. (Full upload coming in v2)" />
        </div>
        {error && <div style={{ color: 'var(--red)', fontWeight: 600 }}>⚠ {error}</div>}
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="btn primary lg" onClick={submit} disabled={busy}>
            {busy ? <><span className="spinner" /> Analysing…</> : '✨ Generate task with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
