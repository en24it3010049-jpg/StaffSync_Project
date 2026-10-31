import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('hr@staffsync.demo');
  const [password, setPassword] = useState('StaffSync123!');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await login(email, password); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Cannot connect to server. Start the backend first.'); }
    finally { setBusy(false); }
  }
  return <div className="login-page"><div className="login-art"><div className="login-logo"><div className="brand-mark">S</div><span>StaffSync</span></div><div className="art-content"><div className="eyebrow">PEOPLE • PROCESS • PROGRESS</div><h1>Better work<br/>starts with<br/><span>people.</span></h1><p>One simple workspace for your people operations, attendance, leave and team growth.</p><div className="art-pills"><span><UsersRound size={15}/> People first</span><span><ShieldCheck size={15}/> Secure access</span></div></div><div className="art-footer">STAFFSYNC HUMAN RESOURCE PLATFORM</div></div><div className="login-form-side"><form className="login-card" onSubmit={submit}><div className="form-icon"><UsersRound size={24}/></div><h2>Welcome back</h2><p className="muted">Sign in to your StaffSync workspace.</p>{error && <div className="error-box">{error}</div>}<label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="primary full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in to workspace'}</button><div className="demo-hint"><b>Demo login</b><span>hr@staffsync.demo</span><span>Password: StaffSync123!</span></div></form></div></div>;
}
