from django.shortcuts import render

# Create your views here.


def stream_test(request, num):
    return render(request, 'page{}.html'.format(num))


