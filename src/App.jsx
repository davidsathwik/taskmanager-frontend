// frontend/src/App.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskManager from './components/TaskManager';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  return <TaskManager />;
}
