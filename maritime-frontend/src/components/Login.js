import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${API_BASE}/api/token/`, { username, password });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_role', response.data.role || 'operator'); 
      localStorage.setItem('username', response.data.username);
      
      setToken(response.data.access);
    } catch (error) {
      setError("AUTHENTICATION FAILED: ACCESS DENIED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="glass-hud" style={formStyle}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div className="pulse-live" style={{ margin: '0 auto 15px', width: '15px', height: '15px' }}></div>
            <h2 className="terminal-text" style={{ color: 'var(--accent-blue)', margin: '0', fontSize: '1.2rem' }}>COMMAND CENTER</h2>
            <p className="terminal-text" style={{ color: '#64748b', fontSize: '0.6rem', marginTop: '5px' }}>SECURE LINK ESTABLISHED</p>
        </div>

        {error && <div style={errorBanner}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <label className="terminal-text" style={labelHUDStyle}>ID_KEY</label>
          <input 
            type="text" 
            placeholder="OPERATOR_ID" 
            value={username}
            onChange={e => setUsername(e.target.value)} 
            style={inputHUDStyle} 
            required 
          />

          <label className="terminal-text" style={labelHUDStyle}>SEC_PASS</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)} 
            style={inputHUDStyle} 
            required 
          />

          <button type="submit" className="terminal-text" style={loginHUDButtonStyle} disabled={isLoading}>
            {isLoading ? 'ENCRYPTING...' : 'INITIALIZE SYSTEM'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.7rem', color: '#64748b' }}>
          NEW OPERATOR? <span onClick={() => setView('register')} style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 'bold' }}>REGISTER HERE</span>
        </p>
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)' };
const formStyle = { padding: '50px', width: '380px', border: '1px solid var(--border-glass)' };
const labelHUDStyle = { display: 'block', marginBottom: '8px', fontSize: '0.6rem', color: '#64748b' };
const inputHUDStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '0.8rem', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' };
const loginHUDButtonStyle = { width: '100%', padding: '15px', background: 'var(--accent-blue)', color: '#020617', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const errorBanner = { padding: '10px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--neon-red)', borderRadius: '6px', fontSize: '0.7rem', marginBottom: '20px', textAlign: 'center', border: '1px solid var(--neon-red)' };

export default Login;