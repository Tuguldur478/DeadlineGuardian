import { useState } from 'react';
import ChatInterface from '../components/ChatInterface.jsx';
import ManualTaskForm from '../components/ManualTaskForm.jsx';

export default function Chat({ reload, chatMessages, setChatMessages }) {
  const [tab, setTab] = useState('chat');
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Create a task</h1>
          <p className="page-subtitle">Talk it out, or fill in the form.</p>
        </div>
      </div>
      <div className="center-stack">
        <div className="tabs">
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>💬 AI Chat</button>
          <button className={tab === 'manual' ? 'active' : ''} onClick={() => setTab('manual')}>📝 Manual</button>
        </div>
        {tab === 'chat' && <ChatInterface onTaskCreated={reload} messages={chatMessages} setMessages={setChatMessages} />}
        {tab === 'manual' && <ManualTaskForm onCreated={reload} />}
      </div>
    </>
  );
}
