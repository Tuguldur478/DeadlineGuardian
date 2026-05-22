import CalendarView from '../components/CalendarView.jsx';

export default function Calendar({ tasks }) {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Calendar</h1>
          <p className="page-subtitle">Every deadline, laid out.</p>
        </div>
      </div>
      <CalendarView tasks={tasks} />
    </>
  );
}
