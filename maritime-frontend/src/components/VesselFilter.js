import React from 'react';

const VesselFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const vesselTypes = ['Cargo', 'Tanker', 'Container', 'LNG Carrier'];
  const flags = ['Panama', 'Liberia', 'Marshall Islands', 'Hong Kong', 'Singapore', 'Greece', 'India'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label className="terminal-text" style={labelHUD}>Type Filter</label>
      <select name="vessel_type" value={filters.vessel_type} onChange={handleChange} style={selectHUDStyle}>
        <option value="">ALL_TYPES</option>
        {vesselTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
      </select>

      <label className="terminal-text" style={labelHUD}>Flag Filter</label>
      <select name="flag" value={filters.flag} onChange={handleChange} style={selectHUDStyle}>
        <option value="">ALL_FLAGS</option>
        {flags.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
      </select>
      
      <button 
        onClick={() => setFilters({ vessel_type: '', flag: '', status: '' })}
        className="terminal-text"
        style={resetHUDStyle}
      >
        Reset Telemetry Filters
      </button>
    </div>
  );
};

const labelHUD = { fontSize: '0.55rem', color: '#64748b', fontWeight: '800' };
const selectHUDStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-glass)', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' };
const resetHUDStyle = { marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#94a3b8', fontSize: '0.6rem', cursor: 'pointer' };

export default VesselFilter;
