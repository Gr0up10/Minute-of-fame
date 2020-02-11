from django.shortcuts import render

# Create your views here.


def stream_page(req):
    context = {}

    return render(req, 'pages/stream.html', context)

def profile_page(req):
    context = {}

    return render(req, 'pages/profile.html', context)
