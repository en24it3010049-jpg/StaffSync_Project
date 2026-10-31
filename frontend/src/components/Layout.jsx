import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Clock3, Megaphone, GraduationCap, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/employees', 'Employees', Users],
  ['/leaves', 'Leave Requests', CalendarDays],
  ['/attendance', 'Attendance', Clock3],
  ['/announcements', 'Announcements', Megaphone],
  ['/trainings', 'Training', GraduationCap]
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">S</div><div><b>StaffSync</b><small>PEOPLE PLATFORM</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="avatar">{user?.name?.charAt(0) || 'U'}</div><div className="user-mini"><b>{user?.name}</b><small>{user?.role}</small></div><button className="icon-button" title="Log out" onClick={() => { logout(); navigate('/login'); }}><LogOut size={17}/></button></div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="mobile-brand"><Menu size={20}/> StaffSync</div><div className="topbar-right"><span className="status-dot"></span> System online <div className="avatar small">{user?.name?.charAt(0) || 'U'}</div></div></header><div className="page-content"><Outlet/></div></main>
  </div>;
}
