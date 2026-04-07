from django.core.management.base import BaseCommand
from core.models import Port, Event, Notification
from core.services.port_service import PortService
from core.services.safety_service import SafetyService

class Command(BaseCommand):
    help = 'Synchronizes Port Analytics (UNCTAD) and Safety Overlays (NOAA)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting Port & Safety Synchronization...'))
        
        # 1. Sync Port Stats
        ports = Port.objects.all()
        for p in ports:
            stats = PortService.fetch_port_stats(p.name)
            p.avg_wait_time = stats['avg_wait_time']
            p.congestion_level = stats['congestion_level']
            p.arrivals_24h = stats['arrivals_24h']
            p.departures_24h = stats['departures_24h']
            p.save()
            
            if p.congestion_level == 'High':
                Notification.objects.create(
                    message=f"CRITICAL CONGESTION: {p.name} Reporting {p.avg_wait_time}h wait time."
                )

        # 2. Sync Safety Events
        safety_data = SafetyService.fetch_safety_events()
        # Deactivate old simulated events (optional logic)
        Event.objects.filter(is_active=True, vessel=None).update(is_active=False)
        
        for data in safety_data:
            Event.objects.create(
                event_type=data['event_type'],
                location=data['location'],
                details=data['details'],
                is_active=data['is_active']
            )
            
            Notification.objects.create(
                message=f"SAFETY ALERT: New {data['event_type']} detected via NOAA satellite overlay."
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {ports.count()} ports and created {len(safety_data)} safety events.'))
