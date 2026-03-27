from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Vessel, Port, Voyage

class MaritimeSecurityTests(APITestCase):
    def setUp(self):
        # Create different identities
        self.admin = User.objects.create_user(username='admin_test', password='password123', role='admin')
        self.operator = User.objects.create_user(username='operator_test', password='password123', role='operator')
        
        # Create test vessels
        self.active_vessel = Vessel.objects.create(
            name="Active Ship", mmsi=111111111, vessel_type="Cargo",
            last_position_lat=15.0, last_position_lon=70.0, status='Active'
        )
        self.decommissioned_vessel = Vessel.objects.create(
            name="Old Ship", mmsi=222222222, vessel_type="Tanker",
            last_position_lat=16.0, last_position_lon=71.0, status='Decommissioned'
        )

    def test_unauthenticated_access_denied(self):
        """Ensure core endpoints are protected by JWT requirement."""
        url = reverse('vessel-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_surveillance_access(self):
        """Admin should see ALL vessels regardless of status."""
        self.client.force_authenticate(user=self.admin)
        url = reverse('vessel-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_operator_surveillance_access(self):
        """Operator should ONLY see 'Active' vessels."""
        self.client.force_authenticate(user=self.operator)
        url = reverse('vessel-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Active Ship")

    def test_user_management_privacy(self):
        """Non-admin operators should not be able to browse other users."""
        self.client.force_authenticate(user=self.operator)
        url = reverse('user-list')
        response = self.client.get(url)
        # Check that it only returns the operator themselves
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'operator_test')

class MaritimeModelTests(TestCase):
    def test_user_role_defaults(self):
        """Ensure new users default to 'operator' role."""
        user = User.objects.create_user(username='new_user', password='password123')
        self.assertEqual(user.role, 'operator')
