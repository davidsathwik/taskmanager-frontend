// frontend/src/components/TaskManager.jsx
import { useEffect, useState } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthToken(token);
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error(err);
      }
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await API.post('/tasks', { title: newTask });
      setTasks(prev => [res.data, ...prev]);
      setNewTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await API.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks(prev => prev.map(t => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ maxWidth: 720, margin: '40px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Task Manager</h1>
        <div>
          <button onClick={logout} style={{ padding: '6px 12px', borderRadius: 6 }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task"
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button onClick={addTask} style={{ padding: '10px 14px', borderRadius: 6 }}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid #eee' }}>
            <span onClick={() => toggleComplete(task)} style={{ cursor: 'pointer', textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <div>
              <button onClick={() => deleteTask(task._id)} style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6 }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
