import random
import string

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.conf import settings
import requests
from .forms import *
from .models import *
from django.contrib.auth.decorators import login_required


def stream_test(request, num):
    item = PollStat(poll_result=0, likes=0, dislikes=0)
    item.save()
    return render(request, 'page{}.html'.format(num))


def screen_share(request):
    return render(request, 'screen_share_test.html')


def get_menu_context():
    return [
        {'url': '/', 'name': 'Home'},
        # {'url': '/categories', 'name': 'Categories'},
        {'url': '/about/', 'name': 'About'},
    ]


def stream_page(request):
    context = {'pagename': 'Главная', 'menu': get_menu_context(),
               'test': 1,
               # 'Regform': RegisterFormView(),
               # 'Logform': LoginForm(),
               'stream_id': ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(16))}
    return render(request, 'pages/stream.html', context)


def login_page(request):
    context = {'pagename': 'Вход',
               'menu': get_menu_context()
               # 'Regform': RegisterFormView(),
               # 'Logform': LoginForm()
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
    return render(request, 'pages/stream.html', context)


def logout_page(request):
    logout(request)
    messages.add_message(request, messages.INFO, "Вы успешно вышли из аккаунта")
    return redirect('index')


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def register_page(request):
    context = dict()
    context['menu'] = get_menu_context()
    context['site_key'] = settings.RECAPTCHA_SITE_KEY
    if request.method == 'POST':
        form = RegisterFormView(request.POST)
        context['form'] = form
        if form.is_valid():
            if form.unique_email():
                form.save()
                username = form.cleaned_data.get('username')
                my_password = form.cleaned_data.get('password1')
                _user = authenticate(username=username, password=my_password)

                # captcha verification
                secret_key = settings.RECAPTCHA_SECRET_KEY
                data = {
                    'response': request.POST.get('g-recaptcha-response'),
                    'secret': secret_key,
                    'remoteip': get_client_ip(request)
                }
                resp = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
                result_json = resp.json()

                print(result_json)

                if not result_json.get('success'):
                    # return render(request, 'registration/register.html', {'is_robot': True})
                    return render(request, 'pages/stream.html', {'is_robot': True})
                # end captcha verification

                new_user = form.save()
                username = form.cleaned_data.get('username')
                my_password = form.cleaned_data.get('password1')
                _user = authenticate(username=username, password=my_password)

                if _user.is_active:
                    print("register success")
                    login(request, new_user)
                    messages.add_message(request, messages.SUCCESS, 'Вы успешно зарегистрировались')
                    return redirect('index')
            else:
                messages.add_message(request, messages.ERROR, 'Аккаунт с этой почтой уже существует')
        else:
            messages.add_message(request, messages.ERROR, 'Вы ввели неверные данные')
        # return render(request, 'registration/register.html', context)
    else:
        form = RegisterFormView()
        context['form'] = form
        # return render(request, 'registration/register.html', context)
        return render(request, 'pages/stream.html', context)
    return redirect('index')


def profile_page(req):
    context = {
        'menu': get_menu_context()
    }

    return render(req, 'pages/profile.html', context)

def profile_settings_page(req):
    context = {
        'menu': get_menu_context()
    }

    return render(req, 'pages/profile_settings.html', context)

def about_page(req):
    context = {
        'menu': get_menu_context()
    }

    return render(req, 'pages/about.html', context)


@login_required()
def report_page(request, badass_id):
    context = {
        'menu': get_menu_context(),
        'Form': ReportForm(initial={'badass': badass_id,'sender': request.user.id}),
    }
    if request.method == 'GET':
        return render(request,'pages/report.html',context)
    if request.method == 'POST':
        report = ReportForm(request.POST)
        if report.is_valid():
            report.cleaned_data['sender'] = request.user.id
            report.save()
            messages.add_message(request, messages.SUCCESS, 'report was sent to moders team of (=^･ｪ･^=)')
            return render(request, 'pages/stream.html', context)
        else:
            messages.add_message(request, messages.ERROR, 'Form is not valid')
            return render(request, 'pages/report.html', context)