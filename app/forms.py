"""import"""
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from .models import Report


class RegisterFormView(UserCreationForm):
    """RegisterFormView"""
    success_url = "/login/"
    template_name = "registration/register.html"
    email = forms.EmailField(max_length=254)

    def unique_email(self):
        """email"""
        if User.objects.filter(email=self.data['email']).exists():
            return False
        return True

    class Meta(object):
        """Meta"""
        model = User
        fields = ('username', 'email', 'password1', 'password2',)


class LoginForm(forms.Form):
    """LoginForm"""
    username = forms.CharField(
        label="Username",
        max_length=20,
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Username',
            }
        )
    )
    password = forms.CharField(
        label="Password",
        max_length=20,
        required=True,
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Password',
            }
        )
    )

    def is_valid(self):
        """is valid"""
        return super().is_valid() or '@' in self.data['username']


class ReportForm(forms.ModelForm):
    """ReportForm"""

    class Meta(object):
        """meta"""
        model = Report
        fields = '__all__'
        widgets = {'badass': forms.HiddenInput(
        ), 'sender': forms.HiddenInput()}
