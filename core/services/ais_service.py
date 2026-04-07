import requests
import os
import random
from django.conf import settings
from datetime import datetime, timedelta

class AISService:
    """
    Handles communication with MarineTraffic and AIS Hub APIs.
    For now, it uses mock data if API keys are not present.
    """
    
    @staticmethod
    def fetch_latest_vessel_data():
        """
        Simulates fetching real-time data from AIS sources.
        """
        api_key_mt = os.getenv('MARINE_TRAFFIC_API_KEY')
        api_key_ais = os.getenv('AIS_HUB_API_KEY')
        
        # 1. Try Real AIS Hub API if key exists
        if api_key_ais:
            try:
                url = f"https://data.aishub.net/ws.php?username={api_key_ais}&format=1&output=json"
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    return AISService._parse_aishub(response.json())
            except Exception:
                pass

        # 2. Try MarineTraffic API if key exists
        if api_key_mt:
            try:
                url = f"https://services.marinetraffic.com/api/exportvessels/{api_key_mt}?protocol=json&msgtype=simple"
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    return response.json()
            except Exception:
                pass

        # Fallback to Simulated Real-Time Data
        return AISService._generate_simulated_live_data()

    @staticmethod
    def _generate_simulated_live_data():
        """
        Generates data that mimics real-time movement by slightly incrementing 
        existing vessel positions in the database.
        """
        from core.models import Vessel
        vessels = Vessel.objects.all()
        vessel_data = []
        
        # If no vessels exist, generate initial ones
        if not vessels.exists():
            return AISService._generate_initial_seed()

        for v in vessels:
            # Simulate a small movement (approx 100-200 meters)
            new_lat = float(v.last_position_lat) + random.uniform(-0.002, 0.002)
            new_lon = float(v.last_position_lon) + random.uniform(-0.002, 0.002)
            
            vessel_data.append({
                'mmsi': v.mmsi,
                'lat': new_lat,
                'lon': new_lon,
                'name': v.name,
                'type': v.vessel_type,
                'flag': v.flag,
                'cargo_type': v.cargo_type,
                'destination': v.destination,
                'eta': v.eta or (datetime.now() + timedelta(days=2)),
                'status': 'Active'
            })
        return vessel_data

    @staticmethod
    def _generate_initial_seed():
        # Fallback for empty DB
        return [{
            'mmsi': 351234000 + i,
            'lat': 1.29027, # Near Singapore
            'lon': 103.851959 + (i * 0.1),
            'name': f"Initial Vessel {i}",
            'type': 'Cargo',
            'status': 'Active'
        } for i in range(5)]

    @staticmethod
    def _parse_aishub(data):
        # Helper to normalize AISHub format to our internal schema
        vessels = []
        for entry in data[1]: # AISHub usually returns [metadata, [vessels...]]
            vessels.append({
                'mmsi': entry['mmsi'],
                'lat': entry['latitude'],
                'lon': entry['longitude'],
                'name': entry['name'],
                'type': entry['type'],
                'status': 'Active'
            })
        return vessels
