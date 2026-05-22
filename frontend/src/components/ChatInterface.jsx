import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

const SHORTCUTS = [
  'I have an essay due in 5 days, help me plan it',
  'I have a stats midterm next Friday, add it to my dashboard',
  'Break down a 2000-word research paper for me',
];

export default function ChatInterface({ onTaskCreated, messages, setMessages }) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput('');
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    setBusy(true);
    try {
      const history = next
        .slice(0, -1)
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));
      const res = await api.chat(msg, history);

      const newMessages = [];
      if (res.reply && res.reply.trim()) {
        newMessages.push({ role: 'assistant', content: res.reply });
      }
      if (res.extractedTask) {
        newMessages.push({ role: 'task-created', task: res.extractedTask });
        onTaskCreated && onTaskCreated(res.extractedTask);
      }
      if (newMessages.length === 0) {
        newMessages.push({ role: 'assistant', content: '(no reply)' });
      }
      setMessages(m => [...m, ...newMessages]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `❌ ${e.message}` }]);
    } finally {
      setBusy(false);
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="chat-shell">
      <div className="chat-messages">
        {messages.map((m, i) => {
          if (m.role === 'task-created') {
            return <TaskCreatedCard key={i} task={m.task} />;
          }
          return <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>;
        })}
        {busy && (
          <div className="chat-bubble thinking">Thinking<span className="dots" /></div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-input-area">
        <div className="chat-shortcuts">
          {SHORTCUTS.map((s, i) => (
            <button key={i} className="shortcut-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            type="text"
            placeholder="Tell me about your assignment…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={busy}
          />
          <button className="btn primary" onClick={() => send()} disabled={busy || !input.trim()}>
            {busy ? <span className="spinner" /> : 'Send →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskCreatedCard({ task }) {
  const checklistCount = task.checklist?.length || 0;
  return (
    <Link to={`/task/${task.id}`} className="task-created-card">
      <div className="task-created-badge">
        <span>✨</span> NEW TASK ADDED
      </div>
      <div className="task-created-title">{task.title}</div>
      <div className="task-created-meta">
        {task.courseName && <span className="course-pill">{task.courseName}</span>}
        <span>📅 Due {task.dueDate}</span>
        {task.estimatedWorkloadHours > 0 && <span>~{task.estimatedWorkloadHours}h</span>}
      </div>
      <div className="task-created-foot">
        <span>{checklistCount} step{checklistCount !== 1 ? 's' : ''} ready</span>
        <span className="task-created-link">View task →</span>
      </div>
    </Link>
  );
}
