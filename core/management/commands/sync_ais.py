from django.core.management.base import BaseCommand
from core.models import Vessel, VesselHistory, Subscription, Notification
from core.services.ais_service import AISService
from django.utils import timezone

class Command(BaseCommand):
    help = 'Synchronizes vessel data with MarineTraffic and AIS Hub'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting AIS Synchronization...'))
        
        ais_data = AISService.fetch_latest_vessel_data()
        
        for data in ais_data:
            vessel, created = Vessel.objects.update_or_create(
                mmsi=data['mmsi'],
                defaults={
                    'name': data['name'],
                    'vessel_type': data['type'],
                    'last_position_lat': data['lat'],
                    'last_position_lon': data['lon'],
                    'status': data['status'],
                    'flag': data.get('flag'),
                    'cargo_type': data.get('cargo_type'),
                    'destination': data.get('destination'),
                    'eta': data.get('eta')
                }
            )
            
            # Record History
            VesselHistory.objects.create(
                vessel=vessel,
                latitude=data['lat'],
                longitude=data['lon']
            )
            
            # Check for subscriptions and create notifications
            subscriptions = Subscription.objects.filter(vessel=vessel)
            for sub in subscriptions:
                if sub.alert_on_position_change:
                    Notification.objects.create(
                        message=f"ALERT: Subscribed vessel {vessel.name} updated position to {data['lat']}, {data['lon']}."
                    )

        self.stdout.write(self.style.SUCCESS(f'Successfully synchronized {len(ais_data)} vessels.'))
