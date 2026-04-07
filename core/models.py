from django.db import models
from django.contrib.auth.models import AbstractUser

# --- Milestone 1: Custom User & Role-Based Access ---
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('analyst', 'Analyst'),
        ('operator', 'Operator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')

# --- Milestone 6: Multi-Stakeholder Infrastructure ---
class Company(models.Model):
    name = models.CharField(max_length=100)
    fleet_size = models.IntegerField(default=0)
    hq_location = models.CharField(max_length=100, null=True, blank=True)
    utilization_rate = models.FloatField(default=0.0)

    def __str__(self):
        return self.name

# --- Milestone 2: Vessel Metadata ---
class Vessel(models.Model):
    name = models.CharField(max_length=100)
    mmsi = models.IntegerField(unique=True, null=True) 
    vessel_type = models.CharField(max_length=50)
    last_position_lat = models.FloatField()
    last_position_lon = models.FloatField()
    status = models.CharField(max_length=20, default='Active') 
    
    # New Fields for Advanced Tracking
    flag = models.CharField(max_length=50, null=True, blank=True)
    cargo_type = models.CharField(max_length=100, null=True, blank=True)
    destination = models.CharField(max_length=100, null=True, blank=True)
    eta = models.DateTimeField(null=True, blank=True)
    
    # Ownership & Insurance
    owner = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='vessels')

    def __str__(self):
        return self.name

class InsurancePolicy(models.Model):
    vessel = models.OneToOneField(Vessel, on_delete=models.CASCADE, related_name='insurance')
    premium_usd = models.FloatField(default=1000.0)
    risk_score = models.FloatField(default=0.0) # 0 to 1
    coverage_details = models.TextField(null=True, blank=True)
    last_renewal = models.DateField(auto_now_add=True)

# --- Milestone 3: Port Metadata ---
class Port(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100) # format: "lat, lon"
    
    # UNCTAD Analytics
    avg_wait_time = models.FloatField(default=0.0) # in hours
    congestion_level = models.CharField(max_length=20, default='Low') # Low, Medium, High
    arrivals_24h = models.IntegerField(default=0)
    departures_24h = models.IntegerField(default=0)

    def __str__(self):
        return self.name

# --- Milestone 3: Vessel History ---
class VesselHistory(models.Model):
    # Using 'Vessel' as a string to avoid model registry issues
    vessel = models.ForeignKey('Vessel', on_delete=models.CASCADE, related_name='history')
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

# --- Milestone 4: Voyages ---
class Voyage(models.Model):
    vessel = models.ForeignKey('Vessel', on_delete=models.CASCADE, related_name='voyages')
    port_from = models.ForeignKey('Port', related_name='departures', on_delete=models.CASCADE)
    port_to = models.ForeignKey('Port', related_name='arrivals', on_delete=models.CASCADE)
    departure_time = models.DateTimeField(auto_now_add=True)
    arrival_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='On Schedule')

# --- Milestone 3: Safety Events ---
class Event(models.Model):
    vessel = models.ForeignKey('Vessel', on_delete=models.CASCADE, null=True, blank=True)
    event_type = models.CharField(max_length=50) # Storm, Piracy, Collision Risk, etc.
    location = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True) 
    details = models.TextField()
    is_active = models.BooleanField(default=True) # For live overlays

# --- Milestone 3: Notifications ---
class Notification(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

# --- Milestone 5: Subscriptions & Alerts ---
class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE, related_name='subscribers')
    alert_on_position_change = models.BooleanField(default=True)
    alert_on_status_change = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'vessel')

    def __str__(self):
        return f"{self.user.username} -> {self.vessel.name}"

# --- Milestone 6: Compliance & Auditing ---
class ComplianceAudit(models.Model):
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE)
    audit_type = models.CharField(max_length=50) # Safety, Environmental, Security
    status = models.CharField(max_length=20, default='Passed') # Passed, Pending, Failed
    performed_by = models.CharField(max_length=100)
    notes = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)