from django.shortcuts import render

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

def stream_page(req):
    context = {}

    return render(req, 'pages/stream.html', context)

def profile_page(req):
    context = {}

    return render(req, 'pages/profile.html', context)
