import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { VesselLayer, PortLayer, EventLayer } from './MapLayers';
import { DashboardSidebar } from './DashboardSidebar';

// --- Helper: Haversine Formula ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const VesselMap = ({ search = "", activeModule = "vessels" }) => {
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [userRole] = useState((localStorage.getItem('user_role') || 'operator').toLowerCase());

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const authConfig = { headers: { Authorization: `Bearer ${token}` } };
      
      const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
      
      const results = await Promise.allSettled([
        axios.get(`${API_BASE}/api/vessels/`, authConfig),
        axios.get(`${API_BASE}/api/ports/`, authConfig),
        axios.get(`${API_BASE}/api/history/`, authConfig),
        axios.get(`${API_BASE}/api/events/`, authConfig),
        axios.get(`${API_BASE}/api/voyages/`, authConfig),
        axios.get(`${API_BASE}/api/stats/`, authConfig)
      ]);

      if (results[0].status === 'fulfilled') setVessels(results[0].value.data);
      if (results[1].status === 'fulfilled') setPorts(results[1].value.data);
      if (results[2].status === 'fulfilled') setHistory(results[2].value.data);
      if (results[3].status === 'fulfilled') setEvents(results[3].value.data);
      if (results[4].status === 'fulfilled') setVoyages(results[4].value.data);
      if (results[5].status === 'fulfilled') setStats(results[5].value.data);

      if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
          runSafetyAnalysis(results[0].value.data, results[1].value.data);
      }
    } catch (err) { 
      console.error("Satellite Sync Error:", err); 
    } finally { setLoading(false); }
  };

  const runSafetyAnalysis = (currVessels, currPorts) => {
    const alerts = [];
    currVessels.forEach(v => {
      currPorts.forEach(p => {
        const pCoords = p.location.split(',').map(Number);
        const dist = calculateDistance(v.last_position_lat, v.last_position_lon, pCoords[0], pCoords[1]);
        if (dist < 100) alerts.push(`⚠️ ${v.name} within 100km of ${p.name}`);
      });
    });
    setNotifications(alerts.slice(0, 5));
  };

  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    (v.mmsi && v.mmsi.toString().includes(search))
  );

  if (loading) return <div style={loadingStyle}>Connecting to Global AIS Network...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', height: '100%' }}>
      <div style={mapWrapperStyle}>
        <MapContainer center={[15, 75]} zoom={4} style={{ height: '82vh', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Layer Management */}
          {(activeModule === 'vessels' || activeModule === 'analytics') && (
            <VesselLayer vessels={filteredVessels} search={search} history={history} />
          )}
          
          {(activeModule === 'ports' || activeModule === 'analytics') && (
            <PortLayer ports={ports} />
          )}
          
          {(activeModule === 'notifications' || activeModule === 'piracy') && (
            <EventLayer events={events} />
          )}
        </MapContainer>
      </div>

      <DashboardSidebar 
        activeModule={activeModule}
        vessels={vessels}
        voyages={voyages}
        notifications={notifications}
        userRole={userRole}
        stats={stats}
      />
    </div>
  );
};

const loadingStyle = { textAlign: 'center', padding: '100px', color: '#64748b', fontSize: '1rem', fontWeight: 'bold' };
const mapWrapperStyle = { position: 'relative', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0' };

export default VesselMap;