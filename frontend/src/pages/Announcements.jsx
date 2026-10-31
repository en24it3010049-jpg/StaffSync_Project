import { useEffect, useState } from 'react';
import { Megaphone, Plus } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Announcements(){
 const {user}=useAuth();const [items,setItems]=useState([]);const [show,setShow]=useState(false);const [error,setError]=useState('');const [form,setForm]=useState({title:'',body:''});
 async function load(){try{setItems((await api.get('/announcements')).data);}catch(e){setError(e.response?.data?.message||'Could not load announcements');}}
 useEffect(()=>{load();},[]);
 async function submit(e){e.preventDefault();try{await api.post('/announcements',form);setShow(false);setForm({title:'',body:''});load();}catch(e){setError(e.response?.data?.message||'Could not publish');}}
 return <><div className="page-heading"><div><div className="eyebrow">COMPANY UPDATES</div><h1>Announcements</h1><p>Important updates and news for everyone.</p></div>{user?.role==='HR'&&<button className="primary" onClick={()=>setShow(true)}><Plus size={17}/> New announcement</button>}</div>{error&&<div className="error-box">{error}</div>}<div className="announcement-grid">{items.map(a=><article className="announcement-card" key={a._id}><div className="announcement-card-icon"><Megaphone size={20}/></div><div className="announcement-meta">{new Date(a.createdAt).toLocaleDateString()} · {a.author?.name||'HR'}</div><h3>{a.title}</h3><p>{a.body}</p></article>)}{!items.length&&<div className="panel empty-state">No announcements have been published yet.</div>}</div>{show&&<div className="modal-backdrop"><form className="modal" onSubmit={submit}><div className="modal-head"><div><h2>New announcement</h2><p>Share a message with your workplace.</p></div><button type="button" className="icon-button" onClick={()=>setShow(false)}>×</button></div><label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Message<textarea required rows="5" value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/></label><div className="modal-actions"><button type="button" className="secondary" onClick={()=>setShow(false)}>Cancel</button><button className="primary">Publish</button></div></form></div>}</>;
}
