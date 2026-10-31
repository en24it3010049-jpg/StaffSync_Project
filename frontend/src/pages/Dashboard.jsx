import { useEffect, useState } from 'react';
import { Users, CalendarClock, Clock3, GraduationCap, ArrowUpRight, CalendarDays, Megaphone } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ employees: [], leaves: [], attendance: [], announcements: [], trainings: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([
      api.get('/employees'), api.get('/leaves'), api.get('/attendance'),
      api.get('/announcements'), api.get('/trainings')
    ]).then(res => setData({ employees: res[0].data, leaves: res[1].data, attendance: res[2].data, announcements: res[3].data, trainings: res[4].data }))
      .catch(() => setError('Could not load dashboard data. Check that the backend and MongoDB are running.'));
  }, []);
  const pending = data.leaves.filter(x => x.status === 'Pending').length;
  const today = new Date().toLocaleDateString();
  return <><div className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Good to see you, {user?.name?.split(' ')[0]} 👋</h1><p>Here’s what’s happening across your workplace today.</p></div><div className="date-chip"><CalendarDays size={17}/>{today}</div></div>
    {error && <div className="error-box">{error}</div>}
    <div className="stat-grid">
      <Stat icon={Users} label="Active employees" value={data.employees.length} note="People in your directory" tone="blue"/>
      <Stat icon={CalendarClock} label="Pending leave" value={pending} note="Requests need attention" tone="orange"/>
      <Stat icon={Clock3} label="Attendance records" value={data.attendance.length} note="Recent check-ins" tone="green"/>
      <Stat icon={GraduationCap} label="Training programs" value={data.trainings.length} note="Learning opportunities" tone="purple"/>
    </div>
    <div className="dashboard-grid"><section className="panel"><div className="panel-head"><div><h3>Recent leave requests</h3><p>Track team time off</p></div><a href="/leaves">View all <ArrowUpRight size={15}/></a></div>{data.leaves.length ? <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Leave type</th><th>Dates</th><th>Status</th></tr></thead><tbody>{data.leaves.slice(0,5).map(l=><tr key={l._id}><td><b>{l.employee?.name || 'Employee'}</b></td><td>{l.leaveType}</td><td>{new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}</td><td><span className={`badge ${l.status.toLowerCase()}`}>{l.status}</span></td></tr>)}</tbody></table></div> : <Empty text="No leave requests yet."/>}</section>
    <section className="panel"><div className="panel-head"><div><h3>Company announcements</h3><p>News and updates</p></div><Megaphone size={19} className="panel-icon"/></div>{data.announcements.slice(0,3).map(a=><div className="announcement-mini" key={a._id}><div className="announcement-dot"></div><div><b>{a.title}</b><p>{a.body}</p><small>{a.author?.name || 'HR'} · {new Date(a.createdAt).toLocaleDateString()}</small></div></div>)}{!data.announcements.length && <Empty text="No announcements yet."/>}</section></div>
    <section className="panel team-panel"><div className="panel-head"><div><h3>Employee directory preview</h3><p>Meet the people behind the work</p></div><a href="/employees">View directory <ArrowUpRight size={15}/></a></div><div className="people-grid">{data.employees.slice(0,4).map(e=><div className="person-card" key={e._id}><div className="person-avatar">{e.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}</div><b>{e.name}</b><span>{e.jobTitle}</span><small>{e.department}</small></div>)}</div></section>
  </>;
}
function Stat({icon:Icon,label,value,note,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>; }
function Empty({text}) { return <div className="empty-state">{text}</div>; }
