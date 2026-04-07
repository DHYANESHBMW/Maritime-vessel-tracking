import React from 'react';
import { Marker, Popup, Polyline, Circle } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

// --- Icons (Shared with main component logic) ---
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const portIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const piracyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export const VesselLayer = ({ vessels, search, history, onReplay, replayPos }) => (
  <>
    {search && history.length > 0 && (
      <Polyline positions={history.map(h => [h.latitude, h.longitude])} color="#3b82f6" weight={2} dashArray="5, 5" />
    )}
    {vessels.map(v => (
      <Marker key={v.id} position={[v.last_position_lat, v.last_position_lon]} icon={blueIcon}>
        <Popup>
          <div style={{ minWidth: '150px' }}>
            <strong style={{ color: '#0f172a' }}>{v.name}</strong><br/>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>MMSI: {v.mmsi || 'N/A'}</span><br/>
            <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
            Type: {v.vessel_type}<br/>
            Flag: {v.flag || 'N/A'}<br/>
            Cargo: {v.cargo_type || 'N/A'}<br/>
            Dest: {v.destination || 'N/A'}<br/>
            Status: <span style={{ color: v.status === 'Active' ? '#10b981' : '#f59e0b' }}>{v.status}</span>
            <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
            <button 
              onClick={() => onReplay(v)}
              style={{ ...subscribeButtonStyle, background: '#10b981', marginTop: '10px' }}
            >
              🔄 Replay Voyage History
            </button>
          </div>
        </Popup>
      </Marker>
    ))}
    {replayPos && (
      <Circle 
        center={[replayPos.latitude, replayPos.longitude]} 
        radius={50000} 
        pathOptions={{ color: '#10b981', fillColor: '#10b981' }} 
      />
    )}
  </>
);

export const PortLayer = ({ ports }) => (
  <>
    {ports.map(p => (
      <Marker key={p.id} position={p.location.split(',').map(Number)} icon={portIcon}>
        <Popup><strong>{p.name}</strong><br/>Status: High Traffic</Popup>
      </Marker>
    ))}
  </>
);
const subscribeButtonStyle = {
  width: '100%',
  padding: '6px',
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '5px'
};

export const EventLayer = ({ events }) => (
  <>
    {events.filter(e => e.is_active).map(event => (
      <React.Fragment key={event.id}>
        <Circle 
          center={event.location.split(',').map(Number)} 
          radius={200000} 
          pathOptions={{ color: event.event_type === 'Storm' ? 'orange' : 'red', fillOpacity: 0.2 }}
        />
        <Marker position={event.location.split(',').map(Number)} icon={piracyIcon}>
           <Popup><strong>{event.event_type} Alert:</strong> {event.details}</Popup>
        </Marker>
      </React.Fragment>
    ))}
  </>
);
