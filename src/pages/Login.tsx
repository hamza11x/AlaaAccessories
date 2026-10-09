import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: '400px' }}>
      <h1>Admin Login</h1>
      <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
        Please log in to manage your store.
      </p>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', marginBottom: '1rem', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-input" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
