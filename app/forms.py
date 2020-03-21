from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from .models import *


class RegisterFormView(UserCreationForm):
    # Ссылка, на которую будет перенаправляться пользователь в случае успешной регистрации.
    # В данном случае указана ссылка на страницу входа для зарегистрированных пользователей.
    success_url = "/login/"

    # Шаблон, который будет использоваться при отображении представления.
    template_name = "registration/register.html"
    email = forms.EmailField(max_length=254, help_text='Это поле обязательно')

    def unique_email(self):
        if User.objects.filter(email=self.data['email']).exists():
            return False
        else:
            return True

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2',)


class LoginForm(forms.Form):
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
        return super().is_valid() or '@' in self.data['username']


class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = '__all__'
        widgets = {'badass': forms.HiddenInput(),'sender': forms.HiddenInput()}


class Quotes(forms.Form):
    quotes = forms.CharField(label="статус",
                                max_length=60)
