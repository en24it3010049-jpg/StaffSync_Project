import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Trainings from './pages/Trainings';

function Protected({children}) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace/>;
}
export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace/> : <Login/>}/>
    <Route path="/" element={<Protected><Layout/></Protected>}>
      <Route index element={<Dashboard/>}/>
      <Route path="employees" element={<Employees/>}/>
      <Route path="leaves" element={<Leaves/>}/>
      <Route path="attendance" element={<Attendance/>}/>
      <Route path="announcements" element={<Announcements/>}/>
      <Route path="trainings" element={<Trainings/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
