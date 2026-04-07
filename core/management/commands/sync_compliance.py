import random
from django.core.management.base import BaseCommand
from core.models import Vessel, ComplianceAudit, Company, InsurancePolicy

class Command(BaseCommand):
    help = 'Generates Compliance Audits and Stakeholder Analytics'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting Compliance & Stakeholder Sync...'))
        
        # 1. Ensure Companies Exist
        cos = ['Maersk Line', 'MSC', 'CMA CGM', 'Hapag-Lloyd']
        companies = []
        for name in cos:
            c, _ = Company.objects.get_or_create(name=name, defaults={
                'fleet_size': random.randint(10, 50),
                'utilization_rate': round(random.uniform(70, 98), 1)
            })
            companies.append(c)

        # 2. Assign Owners & Insurance to Vessels
        vessels = Vessel.objects.all()
        for v in vessels:
            if not v.owner:
                v.owner = random.choice(companies)
                v.save()
            
            InsurancePolicy.objects.get_or_create(vessel=v, defaults={
                'premium_usd': random.randint(5000, 25000),
                'risk_score': round(random.uniform(0.1, 0.9), 2),
                'coverage_details': 'Standard Maritime Hull & Machinery'
            })

        # 3. Generate Audits
        audit_types = ['Safety', 'Environmental', 'Security']
        for v in vessels[:5]: # Audit first 5 vessels
            ComplianceAudit.objects.create(
                vessel=v,
                audit_type=random.choice(audit_types),
                status=random.choice(['Passed', 'Passed', 'Pending', 'Failed']),
                performed_by='International Maritime Org (IMO)',
                notes='Periodic inspection of safety logs and equipment.'
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {len(companies)} companies and generated audits.'))
