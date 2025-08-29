// frontend/src/pages/Login.jsx
import { useState } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 20, borderRadius: 8, background: '#fff' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
        <button type="submit" style={{ padding: 10, borderRadius: 6 }}>Login</button>
      </form>
      <p style={{ marginTop: 12 }}>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
