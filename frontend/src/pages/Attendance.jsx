import { useEffect, useState } from 'react';
import { Clock3, LogIn, LogOut } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Attendance(){
 const {user}=useAuth(); const [items,setItems]=useState([]); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
 async function load(){try{setItems((await api.get('/attendance')).data);}catch(e){setError(e.response?.data?.message||'Could not load attendance');}}
 useEffect(()=>{load();},[]);
 const today=new Date().toLocaleDateString('en-CA');
 const own=items.find(x=>x.employee?._id===user?.id && x.dateKey===today && !x.checkOut);
 async function action(path){setBusy(true);setError('');try{await api.post(path);await load();}catch(e){setError(e.response?.data?.message||'Attendance action failed');}finally{setBusy(false);}}
 return <><div className="page-heading"><div><div className="eyebrow">DAILY TRACKING</div><h1>Attendance</h1><p>Record your working day and review recent check-ins.</p></div></div>{error&&<div className="error-box">{error}</div>}
 <div className="attendance-hero"><div className="attendance-icon"><Clock3 size={25}/></div><div className="attendance-copy"><div className="eyebrow">TODAY'S ATTENDANCE</div><h2>{own?'You are checked in':'Ready to start your day?'}</h2><p>{own?`Checked in at ${new Date(own.checkIn).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`:'Check in when you start work, and check out before you finish.'}</p></div><div className="attendance-actions">{own?<button className="primary" disabled={busy} onClick={()=>action('/attendance/check-out')}><LogOut size={17}/> Check out</button>:<button className="primary" disabled={busy} onClick={()=>action('/attendance')}><LogIn size={17}/> Check in</button>}</div></div>
 <section className="panel"><div className="panel-head"><div><h3>Recent attendance</h3><p>Latest records</p></div></div><div className="table-wrap"><table><thead><tr>{user?.role!=='Employee'&&<th>Employee</th>}<th>Date</th><th>Check in</th><th>Check out</th><th>Hours</th></tr></thead><tbody>{items.map(a=>{const ms=a.checkOut?new Date(a.checkOut)-new Date(a.checkIn):0;return <tr key={a._id}>{user?.role!=='Employee'&&<td>{a.employee?.name}</td>}<td>{new Date(a.checkIn).toLocaleDateString()}</td><td>{new Date(a.checkIn).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td><td>{a.checkOut?new Date(a.checkOut).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'—'}</td><td>{a.checkOut?`${(ms/3600000).toFixed(1)} h`:'In progress'}</td></tr>})}</tbody></table>{!items.length&&<div className="empty-state">No attendance records yet.</div>}</div></section></>;
}
