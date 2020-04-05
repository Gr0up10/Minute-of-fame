from django.contrib.auth.models import User
from django.test import TestCase
from django.test.utils import setup_test_environment
from django.test import Client
from tests.ordered import *


class AuthenticationTest(TestCase):
    def setUp(self) -> None:
        User(username="user", password="test").save()

    @ordered
    def test_index_page(self):
        response = self.client.get('/')
        self.assertContains(response, 'Home', status_code=200)

    @ordered
    def test_registration(self):
        response = self.client.post('/register/', {'username': '55555', 'email': 'mail@mail.com', 'password1': 'PLM333EEsfdsafd3334', 'password2': 'PLM333EEsfdsafd3334'}, follow=True)
        self.assertContains(response, '55555', status_code=200)

    @ordered
    def test_logout(self):
        resp = self.client.post('/logout/')
        self.assertEqual(resp.status_code, 302)

    @ordered
    def test_login(self):
        resp = self.client.post('/login/', {'username': 'user', 'password': 'test'}, follow=True)
        self.assertContains(resp, 'user', status_code=200)
