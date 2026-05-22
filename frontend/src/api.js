// Thin wrapper around fetch. All requests go to the Spring backend at /api/*.
// Vite proxies /api -> http://localhost:8080 in dev (see vite.config.js).

const BASE = '/api';

async function json(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('json') ? res.json() : res.text();
}

export const api = {
  status:    ()              => fetch(`${BASE}/chat/status`).then(json),
  chat:      (message, history = []) =>
    fetch(`${BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    }).then(json),

  listTasks: ()              => fetch(`${BASE}/tasks`).then(json),
  getTask:   (id)            => fetch(`${BASE}/tasks/${id}`).then(json),
  updateTask:(id, patch)     => fetch(`${BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  }).then(json),
  createFromAi:(payload)     => fetch(`${BASE}/tasks/create-from-ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(json),
  deleteTask:(id)            => fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' })
    .then(res => { if (!res.ok && res.status !== 204) throw new Error(`${res.status}`); return true; }),
  reanalyze: ()              => fetch(`${BASE}/tasks/reanalyze`, { method: 'POST' }).then(json),
};
