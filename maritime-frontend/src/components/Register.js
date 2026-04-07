import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setView }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'operator' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("SECURITY PASSWORDS MISMATCH");
    setIsLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
      await axios.post(`${API_BASE}/api/register/`, formData);
      setView('login');
    } catch (error) {
      setError("ENROLLMENT FAILED: SYSTEM REJECTED IDENTITY");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="glass-hud" style={formStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 className="terminal-text" style={{ color: 'var(--accent-blue)', margin: '0', fontSize: '1.2rem' }}>IDENTITY ENROLLMENT</h2>
            <p className="terminal-text" style={{ color: '#64748b', fontSize: '0.6rem', marginTop: '5px' }}>NEW OPERATOR PROTOCOL</p>
        </div>

        {error && <div style={errorBanner}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <label className="terminal-text" style={labelHUDStyle}>OP_ID</label>
          <input type="text" placeholder="USERNAME" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputHUDStyle} required />
          
          <label className="terminal-text" style={labelHUDStyle}>COMM_CHANNEL</label>
          <input type="email" placeholder="EMAIL" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputHUDStyle} required />

          <label className="terminal-text" style={labelHUDStyle}>SEC_LEVEL</label>
          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={inputHUDStyle}>
            <option value="operator">OPERATOR (MONITOR)</option>
            <option value="analyst">ANALYST (INSIGHTS)</option>
            <option value="admin">ADMIN (ROOT)</option>
          </select>

          <label className="terminal-text" style={labelHUDStyle}>PASS_CODE</label>
          <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputHUDStyle} required />

          <label className="terminal-text" style={labelHUDStyle}>CONFIRM_PASS</label>
          <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} style={inputHUDStyle} required />

          <button type="submit" className="terminal-text" style={regHUDButtonStyle} disabled={isLoading}>
            {isLoading ? 'ENROLLING...' : 'FINALIZE PROFILE'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.7rem', color: '#64748b' }}>
          ALREADY ENROLLED? <span onClick={() => setView('login')} style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 'bold' }}>LOG IN</span>
        </p>
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)', padding: '40px 0' };
const formStyle = { padding: '50px', width: '380px', border: '1px solid var(--border-glass)' };
const labelHUDStyle = { display: 'block', marginBottom: '8px', fontSize: '0.6rem', color: '#64748b' };
const inputHUDStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '0.8rem', outline: 'none', marginBottom: '15px', boxSizing: 'border-box' };
const regHUDButtonStyle = { width: '100%', padding: '15px', background: 'var(--neon-green)', color: '#020617', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const errorBanner = { padding: '10px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--neon-red)', borderRadius: '6px', fontSize: '0.7rem', marginBottom: '20px', textAlign: 'center', border: '1px solid var(--neon-red)' };

export default Register;