import requests
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SafetyService:
    """
    Handles maritime safety and weather overlays via GDACS (Global Disaster Alert and Coordination System).
    """
    @staticmethod
    def fetch_safety_events():
        """
        Fetches live disaster alerts from GDACS API.
        """
        url = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventtype=TC&eventtype=FL&eventtype=EQ"
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return SafetyService._parse_gdacs(data)
        except Exception as e:
            logger.error(f"GDACS Fetch Error: {str(e)}")
            
        return SafetyService._generate_fallback_safety()

    @staticmethod
    def _parse_gdacs(data):
        events = []
        # GDACS returns a GeoJSON FeatureCollection
        features = data.get('features', [])
        for feat in features[:5]: # Last 5 major alerts
            props = feat.get('properties', {})
            geom = feat.get('geometry', {})
            coords = geom.get('coordinates', [0, 0])
            
            events.append({
                'event_type': props.get('eventtype', 'Alert'),
                'location': f"{coords[1]},{coords[0]}", # Lat, Lon
                'details': f"Live GDACS Alert: {props.get('name') or props.get('description')} (Level: {props.get('alertlevel')})",
                'is_active': True
            })
        return events

    @staticmethod
    def _generate_fallback_safety():
        return [{
            'event_type': 'Storm',
            'location': '15.5,75.2',
            'details': 'Simulated Storm Alert: Monitoring North Indian Ocean sector.',
            'is_active': True
        }]
