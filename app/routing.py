from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.conf.urls import url
from . import consumers



websocket_urlpatterns = [
    path('ws', consumers.PollConsumer),
    #url(r'^ws/chat$', consumers.ChatConsumer),
    #url(r'^ws/chat$', consumers.ChatConsumer),
    #re_path(r'ws/poll_websocket/test', consumers.ChatConsumer),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})