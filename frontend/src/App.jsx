import { useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { api } from './api.js';
import TopNav from './components/TopNav.jsx';
import { NotificationProvider } from './components/NotificationContext.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Chat from './pages/Chat.jsx';
import Calendar from './pages/Calendar.jsx';
import TaskDetail from './pages/TaskDetail.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [aiMode, setAiMode] = useState(null);

  // Chat history lives here (not inside ChatInterface) so it persists
  // across page navigation for the duration of the session.
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! 👋 I'm Deadline Guardian. Tell me what you're working on — course name, what's due, when — and I'll add it to your dashboard with a full breakdown."
    }
  ]);

  const reload = useCallback(async () => {
    try { setTasks(await api.listTasks()); }
    catch (e) { console.error('Failed to load tasks', e); }
  }, []);

  useEffect(() => {
    reload();
    api.status().then(s => setAiMode(s.mode)).catch(() => setAiMode('mock'));
  }, [reload]);

  return (
    <NotificationProvider tasks={tasks}>
      <TopNav aiMode={aiMode} />
      <main className="page">
        <Routes>
          <Route path="/" element={<Dashboard tasks={tasks} reload={reload} />} />
          <Route path="/chat" element={<Chat reload={reload} chatMessages={chatMessages} setChatMessages={setChatMessages} />} />
          <Route path="/calendar" element={<Calendar tasks={tasks} />} />
          <Route path="/task/:id" element={<TaskDetail reload={reload} />} />
        </Routes>
      </main>
      <ToastContainer />
    </NotificationProvider>
  );
}
