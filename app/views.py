from django.contrib.auth import authenticate, login
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
    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            username = login_form.data['username']
            password = login_form.data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                # messages.add_message(request, messages.SUCCESS, "Авторизация успешна")
            else:
                pass
                # messages.add_message(request, messages.ERROR, "Неправильный логин или пароль")
        else:
            pass
            # messages.add_message(request, messages.ERROR, "Некорректные данные в форме авторизации")
    return redirect('registration/login')


def register(request):
    context = dict()
    if request.method == 'POST':
        form = RegisterFormView(request.POST)
        context['form'] = form
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            my_password = form.cleaned_data.get('password1')
            _user = authenticate(username=username, password=my_password)
            if _user.is_active:
                login(request, _user)
                return render(request, 'index.html', context)
        return render(request, 'registration/register.html', context)
    else:
        form = RegisterFormView()
        context['form'] = form
        return render(request, 'registration/register.html', context)
