from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()

class AuthTests(APITestCase):
    def setUp(self):
        self.username = 'testuser'
        self.password = 'testpass123'
        self.user = User.objects.create_user(username=self.username, password=self.password)

    def test_login_and_current_user(self):
        # Test Login
        response = self.client.post('/api/auth/login/', {'username': self.username, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)

        # Test Current User (/me/) after login
        me_response = self.client.get('/api/auth/me/')
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data['username'], self.username)
        print('SUCCESS: Authentication tests passed perfectly!')
