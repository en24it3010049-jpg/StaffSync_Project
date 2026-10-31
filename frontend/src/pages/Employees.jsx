import { useEffect, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Employees() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'Employee', department:'Engineering', jobTitle:'Team Member', phone:'' });
  async function load() { try { setItems((await api.get('/employees')).data); } catch(e) { setError(e.response?.data?.message || 'Could not load employees'); } }
  useEffect(()=>{load();},[]);
  async function create(e) {
    e.preventDefault(); setError('');
    try { await api.post('/employees', form); setShow(false); setForm({ name:'', email:'', password:'', role:'Employee', department:'Engineering', jobTitle:'Team Member', phone:'' }); load(); }
    catch(e) { setError(e.response?.data?.message || 'Could not create employee'); }
  }
  async function deactivate(id) { if (!confirm('Deactivate this employee account?')) return; try { await api.delete(`/employees/${id}`); load(); } catch(e) { setError(e.response?.data?.message || 'Could not deactivate'); } }
  const filtered = items.filter(e => `${e.name} ${e.email} ${e.department} ${e.jobTitle}`.toLowerCase().includes(search.toLowerCase()));
  return <><div className="page-heading"><div><div className="eyebrow">PEOPLE</div><h1>Employee directory</h1><p>Manage your people and team information in one place.</p></div>{user?.role==='HR' && <button className="primary" onClick={()=>setShow(true)}><Plus size={17}/> Add employee</button>}</div>
    {error && <div className="error-box">{error}<button onClick={()=>setError('')}><X size={15}/></button></div>}
    <section className="panel"><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search name, role or department…" value={search} onChange={e=>setSearch(e.target.value)}/></div><span className="result-count">{filtered.length} people</span></div><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Job title</th><th>Department</th><th>Role</th><th>Status</th>{user?.role==='HR'&&<th>Action</th>}</tr></thead><tbody>{filtered.map(e=><tr key={e._id}><td><div className="employee-cell"><div className="table-avatar">{e.name?.charAt(0)}</div><div><b>{e.name}</b><small>{e.email}</small></div></div></td><td>{e.jobTitle}</td><td>{e.department}</td><td>{e.role}</td><td><span className="badge approved">Active</span></td>{user?.role==='HR'&&<td><button className="text-button danger-text" onClick={()=>deactivate(e._id)}>Deactivate</button></td>}</tr>)}</tbody></table>{!filtered.length&&<div className="empty-state">No employees match your search.</div>}</div></section>
    {show && <div className="modal-backdrop"><form className="modal" onSubmit={create}><div className="modal-head"><div><h2>Add employee</h2><p>Create an employee account.</p></div><button type="button" className="icon-button" onClick={()=>setShow(false)}><X size={19}/></button></div><div className="form-grid"><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Temporary password<input required minLength="8" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><label>Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Employee</option><option>Manager</option><option>HR</option></select></label><label>Department<input value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></label><label>Job title<input value={form.jobTitle} onChange={e=>setForm({...form,jobTitle:e.target.value})}/></label><label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label></div><div className="modal-actions"><button type="button" className="secondary" onClick={()=>setShow(false)}>Cancel</button><button className="primary">Create employee</button></div></form></div>}
  </>;
}
