import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- HUD STYLE SYSTEM ---
const modHeader = { 
  fontSize: '0.75rem', 
  fontWeight: '800', 
  textTransform: 'uppercase', 
  marginBottom: '20px', 
  color: 'var(--accent-blue)', 
  letterSpacing: '2px',
  borderBottom: '1px solid var(--border-glass)',
  paddingBottom: '10px'
};

const analyticsBox = { 
  padding: '15px', 
  background: 'rgba(255,255,255,0.03)', 
  borderRadius: '12px', 
  border: '1px solid var(--border-glass)', 
  marginBottom: '15px' 
};

const labelHUD = { 
  fontSize: '0.6rem', 
  color: '#64748b', 
  fontWeight: '800', 
  letterSpacing: '1px',
  textTransform: 'uppercase'
};

const statValueHUD = { 
  fontSize: '1.4rem', 
  fontWeight: 'bold', 
  color: '#fff',
  fontFamily: 'var(--terminal-font)'
};

const alertCardHUDStyle = { 
  padding: '12px', 
  background: 'rgba(244, 63, 94, 0.1)', 
  color: 'var(--neon-red)', 
  borderRadius: '10px', 
  border: '1px solid var(--neon-red)',
  marginBottom: '10px', 
  fontSize: '0.75rem' 
};

const logEntryHUDStyle = { 
  padding: '12px', 
  background: 'none', 
  borderBottom: '1px solid var(--border-glass)', 
  fontSize: '0.8rem',
  color: '#cbd5e1'
};

const statusTagHUD = (status) => ({ 
  display: 'inline-block', 
  padding: '2px 8px', 
  borderRadius: '4px', 
  fontSize: '0.6rem', 
  fontWeight: 'bold', 
  marginTop: '5px', 
  background: status === 'Failed' || status === 'High' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
  color: status === 'Failed' || status === 'High' ? 'var(--neon-red)' : 'var(--neon-green)',
  border: `1px solid ${status === 'Failed' || status === 'High' ? 'var(--neon-red)' : 'var(--neon-green)'}`
});

export const DashboardSidebar = ({ activeModule, vessels, voyages, notifications, userRole, stats, ports, companies, insurance, compliance }) => {
  return (
    <div style={{ background: 'none', color: '#fff' }}>
      {activeModule === 'analytics' && (
        <div>
          <h3 style={modHeader}>📊 FLEET ANALYTICS</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div style={analyticsBox}>
              <div style={labelHUD}>TOTAL FLEET</div>
              <div style={statValueHUD}>{stats?.total_vessels || vessels.length}</div>
            </div>
            <div style={analyticsBox}>
              <div style={labelHUD}>ACTIVE</div>
              <div style={{...statValueHUD, color: 'var(--neon-green)'}}>{stats?.active_vessels || vessels.filter(v => v.status === 'Active').length}</div>
            </div>
          </div>

          <div style={analyticsBox}>
             <div style={labelHUD}>VESSEL DISTRIBUTION</div>
             <div style={{height: '150px', width: '100%', marginTop: '15px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.type_distribution || []}>
                    <XAxis dataKey="vessel_type" hide />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: '0.7rem' }} />
                    <Bar dataKey="count" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}

      {activeModule === 'ports' && (
        <div>
          <h3 style={modHeader}>⚓ PORT LOGISTICS</h3>
          {(ports || []).map(port => (
            <div key={port.id} style={logEntryHUDStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{port.name.toUpperCase()}</span>
                <span style={statusTagHUD(port.congestion_level)}>
                  {port.congestion_level}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '5px' }}>
                AVG WAIT: <span style={{ color: '#fff' }}>{port.avg_wait_time}H</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeModule === 'notifications' && (
        <div>
          <h3 style={{...modHeader, color: 'var(--neon-red)'}}>🚨 THREAT INTEL</h3>
          {notifications.map((note, i) => <div key={i} style={alertCardHUDStyle}>{note}</div>)}
        </div>
      )}

      {activeModule === 'companies' && (
        <div>
          <h3 style={modHeader}>🏢 STAKEHOLDERS</h3>
          {companies.map(co => (
            <div key={co.id} style={analyticsBox}>
              <div style={labelHUD}>{co.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                <span style={statValueHUD}>{co.fleet_size} <span style={{fontSize: '0.6rem'}}>UNITS</span></span>
                <span style={{ color: 'var(--neon-green)', fontWeight: 'bold', fontSize: '0.8rem' }}>{co.utilization_rate}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeModule === 'compliance' && (
        <div>
          <h3 style={modHeader}>📜 REGULATORY AUDIT</h3>
          {compliance.map(audit => (
            <div key={audit.id} style={logEntryHUDStyle}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <strong>{audit.vessel_name}</strong>
                <span style={statusTagHUD(audit.status)}>{audit.status}</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>TYPE: {audit.audit_type}</div>
            </div>
          ))}
        </div>
      )}

      {activeModule === 'admin' && (
        <div>
          <h3 style={modHeader}>⚙️ CORE CONFIG</h3>
          <div style={analyticsBox}>
            <div style={labelHUD}>NETWORK UPTIME</div>
            <div style={{ fontSize: '0.7rem', marginTop: '10px', color: '#94a3b8' }}>
              • MARINETRAFFIC: <span style={{ color: 'var(--neon-green)' }}>SYNCED</span><br/>
              • GDACS SAFETY: <span style={{ color: 'var(--neon-green)' }}>SYNCED</span><br/>
              • AIS HUB: <span style={{ color: '#f59e0b' }}>DEGRADED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
