import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const NotificationContext = createContext(null);

/**
 * Notification types:
 *   'deadline'  — task due within 3 days, not completed
 *   'start'     — AI suggests starting now (high priority, low progress)
 *   'completed' — task just hit 100%
 *
 * Bell list is "currently relevant only" — derived from task state every render.
 * Toasts are transient — added imperatively, auto-dismiss after 5s.
 */

function deriveFromTasks(tasks) {
  const list = [];
  for (const t of tasks) {
    if (!t || !t.id) continue;
    const days = t.daysRemaining;
    const progress = computePct(t);

    // Completed task (no toast here — that comes from the event hook)
    if (t.priority === 'COMPLETED' || progress === 100) {
      list.push({
        id: `completed-${t.id}`,
        type: 'completed',
        taskId: t.id,
        title: `${t.title} complete`,
        body: 'Nice work — checklist all done.',
        icon: '🎉',
        sortKey: -1
      });
      continue;
    }

    // Deadline approaching ≤3 days
    if (days != null && days <= 3 && days >= 0) {
      let title;
      if (days === 0) title = `${t.title} is due today`;
      else if (days === 1) title = `${t.title} is due tomorrow`;
      else title = `${t.title} due in ${days} days`;

      list.push({
        id: `deadline-${t.id}`,
        type: 'deadline',
        taskId: t.id,
        title,
        body: t.courseName ? `${t.courseName} · ${progress}% done` : `${progress}% done`,
        icon: days <= 1 ? '🚨' : '⏰',
        sortKey: days
      });
      continue;
    }

    // Start-now suggestion: HIGH priority + <25% progress + due within a week
    if (t.priority === 'HIGH' && progress < 25 && days != null && days <= 7) {
      list.push({
        id: `start-${t.id}`,
        type: 'start',
        taskId: t.id,
        title: `Start ${t.title} today`,
        body: t.startRecommendation || `${days}d left — get the first step done`,
        icon: '⚡',
        sortKey: days + 100   // sort after deadlines
      });
    }
  }
  return list.sort((a, b) => a.sortKey - b.sortKey);
}

function computePct(t) {
  if (!t.checklist || t.checklist.length === 0) return 0;
  const done = t.checklist.filter(c => c.completed).length;
  return Math.round((done * 100) / t.checklist.length);
}

export function NotificationProvider({ tasks, children }) {
  const [toasts, setToasts] = useState([]);
  const seenCompleted = useRef(new Set());     // tasks we've already toasted "completed" for
  const prevDeadlineIds = useRef(new Set());   // deadline notifications seen on last render
  const firstRender = useRef(true);

  const notifications = useMemo(() => deriveFromTasks(tasks), [tasks]);

  // Fire toasts when NEW notifications appear (not on first load)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      // seed the "seen" set so we don't spam toasts for everything on first mount
      for (const n of notifications) {
        if (n.type === 'completed') seenCompleted.current.add(n.taskId);
        if (n.type === 'deadline') prevDeadlineIds.current.add(n.id);
      }
      return;
    }

    const newToasts = [];

    // Newly-completed tasks
    for (const n of notifications) {
      if (n.type === 'completed' && !seenCompleted.current.has(n.taskId)) {
        seenCompleted.current.add(n.taskId);
        newToasts.push({ ...n, toastId: `${n.id}-${Date.now()}` });
      }
    }

    // Newly-approaching deadlines (didn't exist last render)
    const currentDeadlineIds = new Set(notifications.filter(n => n.type === 'deadline').map(n => n.id));
    for (const n of notifications) {
      if (n.type === 'deadline' && !prevDeadlineIds.current.has(n.id)) {
        newToasts.push({ ...n, toastId: `${n.id}-${Date.now()}` });
      }
    }
    prevDeadlineIds.current = currentDeadlineIds;

    // Forget completed-task IDs that are no longer in the list (so retoggling shows again)
    const stillCompleted = new Set(notifications.filter(n => n.type === 'completed').map(n => n.taskId));
    for (const id of [...seenCompleted.current]) {
      if (!stillCompleted.has(id)) seenCompleted.current.delete(id);
    }

    if (newToasts.length) {
      setToasts(t => [...t, ...newToasts]);
    }
  }, [notifications]);

  const dismissToast = useCallback((toastId) => {
    setToasts(t => t.filter(x => x.toastId !== toastId));
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map(t => setTimeout(() => dismissToast(t.toastId), 5000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismissToast]);

  // --- Unread badge tracking ---
  // We track which notification IDs the user has already seen (by opening the
  // bell). The badge counts only notifications not yet seen, so it clears to 0
  // after the user opens the dropdown, and ticks up again when something new appears.
  const [seenIds, setSeenIds] = useState(new Set());

  const unseenCount = notifications.filter(n => !seenIds.has(n.id)).length;

  const markAllSeen = useCallback(() => {
    setSeenIds(new Set(notifications.map(n => n.id)));
  }, [notifications]);

  // Drop seen IDs that no longer correspond to a live notification, so the
  // same ID reappearing later counts as new again.
  useEffect(() => {
    const live = new Set(notifications.map(n => n.id));
    setSeenIds(prev => {
      let changed = false;
      const next = new Set();
      for (const id of prev) {
        if (live.has(id)) next.add(id);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [notifications]);

  const value = { notifications, toasts, dismissToast, unseenCount, markAllSeen };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
