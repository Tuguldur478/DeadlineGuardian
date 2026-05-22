import { NavLink } from 'react-router-dom';
import NotificationBell from './NotificationBell.jsx';

export default function TopNav({ aiMode }) {
  return (
    <header className="topnav">
      <NavLink to="/" className="brand">
        <span className="shield">🛡</span>
        Deadline Guardian
      </NavLink>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : ''}>Chat</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>Calendar</NavLink>
      </nav>
      <div className="topnav-right">
        <NotificationBell />
        <div className="user-chip">
          <span className="avatar">AS</span>
          <span className="user-name">Alex S.</span>
          {aiMode && (
            <span className={`mode-pill ${aiMode}`} title={aiMode === 'live' ? 'Live AI responses' : 'No API key — using mock data'}>
              {aiMode === 'live' ? 'AI LIVE' : 'MOCK'}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
