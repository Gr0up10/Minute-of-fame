from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect

from .forms import *


# Create your views here.
def get_menu_context():
    return [
        {'url': '/', 'name': 'Home'},
        {'url': '/categories', 'name': 'Categories'},
        {'url': '/about/', 'name': 'About'},
    ]


def stream_page(request):
    context = {
        'pagename': 'Главная',
        'menu': get_menu_context(),
    }
    return render(request, 'pages/stream.html', context)


def login_page(request):
    context = {
        'pagename': 'Вход',
        'menu': get_menu_context(),
    }
    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            username = login_form.data['username']
            password = login_form.data['password']
            if User.objects.filter(email=login_form.data['username']).exists():
                # если пользователь найден, то в поле username вставить пользователя из бд
                user = User.objects.get(email=login_form.data['username'])
                username = str(user.username)

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.add_message(request, messages.SUCCESS, "Авторизация успешна")
                return redirect('index')
            else:
                pass
                messages.add_message(request, messages.ERROR, "Неправильный логин или пароль")
        else:
            pass
            messages.add_message(request, messages.ERROR, "Некорректные данные в форме авторизации")
    else:
        login_form = LoginForm()
        context['form'] = login_form
    return render(request, 'registration/login.html', context)


def logout_page(request):
    logout(request)
    messages.add_message(request, messages.INFO, "Вы успешно вышли из аккаунта")
    return redirect('index')


def register_page(request):
    context = dict()
    if request.method == 'POST':
        form = RegisterFormView(request.POST)
        context['form'] = form
        if form.is_valid():
            if form.unique_email():
                form.save()
                username = form.cleaned_data.get('username')
                my_password = form.cleaned_data.get('password1')
                _user = authenticate(username=username, password=my_password)
                if _user.is_active:
                    login(request, _user)
                    messages.add_message(request, messages.SUCCESS, 'Вы успешно зарегистрировались')
                    return redirect('index')
            else:
                messages.add_message(request, messages.ERROR, 'Аккаунт с этой почтой уже существует')
        else:
            messages.add_message(request, messages.ERROR, 'Вы ввели неверные данные')
        return render(request, 'registration/register.html', context)
    else:
        form = RegisterFormView()
        context['form'] = form
        return render(request, 'registration/register.html', context)
