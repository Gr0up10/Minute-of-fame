from django.shortcuts import render

# Create your views here.
def get_menu_context():
    return [
        {'url': '/', 'name': 'Главная'},
        {'url': '/profile/', 'name': 'Профиль'},
        {'url': '/login/', 'name': 'Логин'},
        {'url': '/register/', 'name': 'Регистрация'},
    ]

def stream_page(request):
    context = {
        'pagename': 'Главная',
        'menu': get_menu_context(),
    }
    return render(request, 'pages/stream.html', context)

