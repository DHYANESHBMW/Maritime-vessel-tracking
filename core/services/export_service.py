import csv
import io
from django.http import HttpResponse

class ExportService:
    """
    Handles data exports for Administrative and Stakeholder reporting.
    """
    @staticmethod
    def export_vessels_to_csv(queryset):
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'MMSI', 'Type', 'Status', 'Flag', 'Owner', 'Risk Score'])
        
        for v in queryset:
            risk = v.insurance.risk_score if hasattr(v, 'insurance') else 'N/A'
            owner = v.owner.name if v.owner else 'Independent'
            writer.writerow([v.id, v.name, v.mmsi, v.vessel_type, v.status, v.flag, owner, risk])
            
        return output.getvalue()

    @staticmethod
    def export_audit_log(queryset):
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Vessel', 'Type', 'Status', 'Performer', 'Timestamp'])
        
        for a in queryset:
            writer.writerow([a.id, a.vessel.name, a.audit_type, a.status, a.performed_by, a.timestamp])
            
        return output.getvalue()
