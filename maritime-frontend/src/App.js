import React, { useState } from 'react';
import VesselMap from './components/VesselMap';
import Login from './components/Login';
import Register from './components/Register';
import VesselFilter from './components/VesselFilter';
import './App.css';

function App() {
  // --- 1. STATE DEFINITIONS ---
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [view, setView] = useState('login'); 
  const [activeModule, setActiveModule] = useState('vessels');
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ vessel_type: '', flag: '', status: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Role tracking for RBAC requirements
  const [userRole] = useState(localStorage.getItem('user_role') || 'operator');

  // --- 2. LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setView('login');
  };

  // --- 3. AUTHENTICATION GUARD ---
  if (!token) {
    return view === 'login' ? (
      <Login setToken={setToken} setView={setView} />
    ) : (
      <Register setView={setView} />
    );
  }

  // --- 4. PREMIUM COMMAND CENTER LAYOUT ---
  return (
    <div className="App" style={{ backgroundColor: 'var(--bg-deep)', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. THE MAP (FULL-BLEED BACKDROP) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <VesselMap search={searchTerm} activeModule={activeModule} filters={filters} />
      </div>

      {/* 2. THE HUD HEADER */}
      <header className="glass-hud" style={headerHUDStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="pulse-live"></div>
          <h1 className="terminal-text" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>
            System <span style={{ color: '#fff' }}>Online</span>
          </h1>
        </div>
        
        <div style={{ flex: 1, maxXWidth: '400px', margin: '0 40px' }}>
          <input 
            type="text" 
            placeholder="SCAN MMSI / VESSEL NAME..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="terminal-text"
            style={searchHUDStyle}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <button onClick={handleLogout} className="terminal-text" style={logoutHUDButtonStyle}>Initialize De-Auth</button>
        </div>
      </header>

      {/* 3. THE FLOATING COMMAND PANEL */}
      <aside 
        className="glass-hud custom-scrollbar" 
        style={{ 
          ...floatingSidebarStyle, 
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-340px)',
          opacity: isSidebarOpen ? 1 : 0
        }}
      >
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          style={toggleButtonStyle}
        >
          {isSidebarOpen ? '«' : '»'}
        </button>

        <div style={{ padding: '20px' }}>
          <label className="terminal-text" style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', display: 'block', marginBottom: '15px' }}>
            Mission Control
          </label>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Navigation Groups */}
            <p className="terminal-text" style={navGroupLabel}>Maritime Feed</p>
            <button onClick={() => setActiveModule('vessels')} style={activeModule === 'vessels' ? activeHUDItem : navHUDItem}>
                🛰️ Global Fleet
            </button>
            <button onClick={() => setActiveModule('ports')} style={activeModule === 'ports' ? activeHUDItem : navHUDItem}>
                ⚓ Port Logistics
            </button>

            <p className="terminal-text" style={navGroupLabel}>Intelligence</p>
            <button onClick={() => setActiveModule('notifications')} style={activeModule === 'notifications' ? activeHUDItem : navHUDItem}>
                ⚠️ Risk Alerts
            </button>
            <button onClick={() => setActiveModule('piracy')} style={activeModule === 'piracy' ? activeHUDItem : navHUDItem}>
                🛡️ Security Zones
            </button>

            <p className="terminal-text" style={navGroupLabel}>Governance</p>
            <button onClick={() => setActiveModule('companies')} style={activeModule === 'companies' ? activeHUDItem : navHUDItem}>
                🏢 Stakeholders
            </button>
            <button onClick={() => setActiveModule('compliance')} style={activeModule === 'compliance' ? activeHUDItem : navHUDItem}>
                📜 Compliance
            </button>

            {/* Admin only */}
            {(userRole === 'admin' || userRole === 'analyst') && (
              <>
                <p className="terminal-text" style={navGroupLabel}>Root Operations</p>
                <button onClick={() => setActiveModule('admin')} style={activeModule === 'admin' ? activeHUDItem : navHUDItem}>
                    ⚙️ Core Config
                </button>
              </>
            )}
          </nav>

          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-glass)', paddingTop: '15px' }}>
             {activeModule === 'vessels' && <VesselFilter filters={filters} setFilters={setFilters} />}
          </div>
        </div>
      </aside>

      {/* 4. DATA THeM (Optional Ticker at bottom) */}
      <footer className="glass-hud" style={footerHUDStyle}>
          <div className="terminal-text" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
            SECURE LINK 772  //  ROLE: {userRole.toUpperCase()}  //  LIVE TELEMETRY: ACTIVE
          </div>
      </footer>
    </div>
  );
}

// --- HUD DESIGN SYSTEM ---
const headerHUDStyle = { position: 'absolute', top: '20px', left: '20px', right: '20px', height: '60px', padding: '0 30px', display: 'flex', alignItems: 'center', zIndex: 100, borderRadius: '15px' };
const searchHUDStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px 15px', color: '#fff', fontSize: '0.75rem', outline: 'none' };
const floatingSidebarStyle = { position: 'absolute', top: '100px', left: '20px', width: '300px', bottom: '100px', zIndex: 100, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', overflowY: 'auto' };
const footerHUDStyle = { position: 'absolute', bottom: '20px', left: '20px', right: '20px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderRadius: '10px' };
const navGroupLabel = { fontSize: '0.6rem', color: '#64748b', marginTop: '20px', marginBottom: '8px' };
const navHUDItem = { padding: '10px 15px', textAlign: 'left', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', transition: '0.3s', marginBottom: '2px' };
const activeHUDItem = { ...navHUDItem, background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', borderLeft: '3px solid var(--accent-blue)' };
const logoutHUDButtonStyle = { background: 'none', border: '1px solid var(--neon-red)', color: 'var(--neon-red)', padding: '6px 15px', borderRadius: '6px', fontSize: '0.65rem', cursor: 'pointer' };
const toggleButtonStyle = { position: 'absolute', right: '10px', top: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.5 };

// --- DESIGN SYSTEM STYLES ---
const headerStyle = { display: 'none' }; // Replaced by HUD
const sidebarStyle = { display: 'none' }; // Replaced by Floating

export default App;