from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django import forms


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


class ReportForm(forms.Form):
    multi_account = forms.BooleanField(label='multiaccount',required=False,widget= forms.CheckboxInput())
    offensive = forms.BooleanField(label='offensive', required=False,widget= forms.CheckboxInput())
    inappropriate_video_content = forms.BooleanField(label='inappropriate video content', required=False,widget= forms.CheckboxInput())
    additional_information = forms.CharField(max_length=240, min_length=1, required=True, label='additional information')