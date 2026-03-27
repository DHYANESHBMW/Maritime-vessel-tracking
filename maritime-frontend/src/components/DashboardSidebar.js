import React from 'react';

const modHeader = { fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px', color: '#1e293b' };
const analyticsBox = { padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' };
const label = { fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' };
const statValue = { fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' };
const alertCardStyle = { padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 'bold' };
const logEntryStyle = { padding: '12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' };
const statusTag = (status) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', marginTop: '5px', background: '#dcfce7', color: '#166534' });

export const DashboardSidebar = ({ activeModule, vessels, voyages, notifications, userRole, stats }) => {
  return (
    <div style={{ background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', height: '82vh' }}>
      {activeModule === 'analytics' && (
        <div style={{ overflowY: 'auto' }}>
          <h3 style={modHeader}>📊 Fleet Analytics</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div style={analyticsBox}>
              <div style={label}>TOTAL FLEET</div>
              <div style={statValue}>{stats?.total_vessels || vessels.length}</div>
            </div>
            <div style={analyticsBox}>
              <div style={label}>ACTIVE NOW</div>
              <div style={{...statValue, color: '#10b981'}}>{stats?.active_vessels || vessels.filter(v => v.status === 'Active').length}</div>
            </div>
          </div>

          <div style={analyticsBox}>
             <div style={label}>VESSEL TYPE DISTRIBUTION</div>
             <div style={{marginTop: '15px'}}>
                {(stats?.type_distribution || []).map(item => {
                  const percentage = (item.count / (stats?.total_vessels || 1)) * 100;
                  return (
                    <div key={item.vessel_type} style={{marginBottom: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px'}}>
                        <span>{item.vessel_type}</span>
                        <span style={{fontWeight: 'bold'}}>{item.count}</span>
                      </div>
                      <div style={{height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{
                          height: '100%', 
                          width: `${percentage}%`, 
                          background: '#3b82f6',
                          transition: 'width 1s ease-in-out'
                        }} />
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div style={analyticsBox}>
             <div style={label}>SECURITY OVERVIEW</div>
             <div style={{marginTop: '10px', fontSize: '0.8rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                   <span>Risk Alerts (24h)</span>
                   <span style={{color: '#ef4444', fontWeight: 'bold'}}>{stats?.recent_events_count || 0}</span>
                </div>
                <div style={{fontSize: '0.7rem', color: '#64748b'}}>Intelligence integrity: 98%</div>
             </div>
          </div>
        </div>
      )}

      {activeModule === 'vessels' && (
        <div>
          <h3 style={modHeader}>🚢 Voyage Audit</h3>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {voyages.map(voy => (
              <div key={voy.id} style={logEntryStyle}>
                <strong>{voy.vessel_name}</strong>
                <div style={{fontSize: '0.75rem', color: '#64748b'}}>{voy.port_from_name} ➔ {voy.port_to_name}</div>
                <div style={statusTag(voy.status)}>{voy.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModule === 'notifications' && (
        <div>
          <h3 style={{...modHeader, color: '#ef4444'}}>🚨 Risk Intelligence</h3>
          {notifications.map((note, i) => <div key={i} style={alertCardStyle}>{note}</div>)}
        </div>
      )}

      <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
        <div style={label}>IDENTITY</div>
        <div style={{fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase'}}>{userRole}</div>
      </div>
    </div>
  );
};
