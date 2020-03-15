from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path, re_path

from . import consumers

websocket_urlpatterns = [
    path('ws/', consumers.WSConsumer),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
]

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
