import React from 'react';
import { Marker, Popup, Polyline, Circle } from 'react-leaflet';
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

export const VesselLayer = ({ vessels, search, history }) => (
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
            Status: <span style={{ color: v.status === 'Active' ? '#10b981' : '#f59e0b' }}>{v.status}</span>
          </div>
        </Popup>
      </Marker>
    ))}
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

export const EventLayer = ({ events }) => (
  <>
    {events.map(event => (
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
