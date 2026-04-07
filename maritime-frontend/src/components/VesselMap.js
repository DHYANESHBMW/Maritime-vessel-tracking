import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { VesselLayer, PortLayer, EventLayer } from './MapLayers';
import { DashboardSidebar } from './DashboardSidebar';

const VesselMap = ({ search = "", activeModule = "vessels", filters = {} }) => {
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [userRole] = useState((localStorage.getItem('user_role') || 'operator').toLowerCase());
  const [showSafety, setShowSafety] = useState(false);
  const [replayingVessel, setReplayingVessel] = useState(null);
  const [replayIndex, setReplayIndex] = useState(0);

  useEffect(() => {
    if (replayingVessel) {
      const timer = setInterval(() => {
        setReplayIndex(prev => (prev < history.length - 1 ? prev + 1 : prev));
      }, 500);
      return () => clearInterval(timer);
    }
  }, [replayingVessel, history]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 15000);
    return () => clearInterval(interval);
  }, [filters, search]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const authConfig = { headers: { Authorization: `Bearer ${token}` } };
      const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
      
      const results = await Promise.allSettled([
        axios.get(`${API_BASE}/api/vessels/`, { ...authConfig, params: { search, ...filters } }),
        axios.get(`${API_BASE}/api/ports/`, authConfig),
        axios.get(`${API_BASE}/api/history/`, authConfig),
        axios.get(`${API_BASE}/api/events/`, authConfig),
        axios.get(`${API_BASE}/api/voyages/`, authConfig),
        axios.get(`${API_BASE}/api/stats/`, authConfig),
        axios.get(`${API_BASE}/api/notifications/`, authConfig),
        axios.get(`${API_BASE}/api/companies/`, authConfig),
        axios.get(`${API_BASE}/api/insurance/`, authConfig),
        axios.get(`${API_BASE}/api/compliance/`, authConfig)
      ]);

      if (results[0].status === 'fulfilled') setVessels(results[0].value.data);
      if (results[1].status === 'fulfilled') setPorts(results[1].value.data);
      if (results[2].status === 'fulfilled') setHistory(results[2].value.data);
      if (results[3].status === 'fulfilled') setEvents(results[3].value.data);
      if (results[4].status === 'fulfilled') setVoyages(results[4].value.data);
      if (results[5].status === 'fulfilled') setStats(results[5].value.data);
      if (results[6].status === 'fulfilled') setNotifications(results[6].value.data.map(n => n.message));
      if (results[7].status === 'fulfilled') setCompanies(results[7].value.data);
      if (results[8].status === 'fulfilled') setInsurance(results[8].value.data);
      if (results[9].status === 'fulfilled') setCompliance(results[9].value.data);
    } catch (err) { console.error("Sync Error:", err); } 
    finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
      <div className="terminal-text" style={{ color: 'var(--accent-blue)' }}>BOOTING SATELLITE LINK...</div>
    </div>
  );

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <MapContainer center={[15, 75]} zoom={4} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer 
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}" 
          attribution="&copy; Esri"
        />
        <TileLayer 
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}" 
          attribution=""
        />
        
        {/* Layer Toggle HUD */}
        <div style={{ position: 'absolute', top: '100px', right: '20px', zIndex: 100 }}>
          <button 
            onClick={() => setShowSafety(!showSafety)}
            className="glass-hud terminal-text"
            style={{ padding: '10px 15px', color: showSafety ? 'var(--neon-red)' : '#fff', border: 'none', cursor: 'pointer', fontSize: '0.65rem' }}
          >
            {showSafety ? 'NOAA ACTIVE' : 'NOAA STANDBY'}
          </button>
        </div>

        {/* Modules */}
        <VesselLayer 
          vessels={vessels} 
          search={search} 
          history={history} 
          onReplay={(v) => { setReplayingVessel(v); setReplayIndex(0); }}
          replayPos={replayingVessel ? history[replayIndex] : null}
        />
        <PortLayer ports={ports} />
        {showSafety && <EventLayer events={events} />}
      </MapContainer>

      {/* Floating Side Detail Panel (Integrates the existing Sidebar logic but smaller) */}
      <div style={{ position: 'absolute', top: '100px', right: '20px', bottom: '100px', width: '300px', zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', height: '100%', overflowY: 'auto' }} className="glass-hud custom-scrollbar">
           <DashboardSidebar 
            activeModule={activeModule}
            vessels={vessels} voyages={voyages} notifications={notifications}
            userRole={userRole} stats={stats} ports={ports}
            companies={companies} insurance={insurance} compliance={compliance}
           />
        </div>
      </div>
    </div>
  );
};

export default VesselMap;