from channels.generic.websocket import WebsocketConsumer, AsyncJsonWebsocketConsumer
from .utils import *
from app.ws_handlers.poll_handler import PollHandler
from app.ws_handlers.queue_handler import QueueHandler
from app.ws_handlers.chat_handler import ChatHandler


class WSConsumer(AsyncJsonWebsocketConsumer):
    GROUP_NAME = 'main'

    handlers = {
        "poll": PollHandler(),
        "queue": QueueHandler()
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.handlers = [
            PollHandler(self),
            QueueHandler(self),
            ChatHandler(self)
        ]

        self.handlers = {h.name: h for h in self.handlers}

    async def send_broadcast(self, handler, command, data, name=None):
        await self.channel_layer.group_send(self.GROUP_NAME, {
            "type": "send.command", "handler": handler, "command": command, "data": data, "chan_name": name
        })

    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
        if await sync_to_async(is_stream_active)():
            await self.send_packet('queue', 'set_stream', {"stream": await sync_to_async(get_current_stream_id)()})
        print("connected")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)
        print("Disconnected")

    async def receive_json(self, content, **kwargs):
        print(content)
        handler, packet_name = content['handler'], content['message']
        await find_action(self.handlers[handler], packet_name)(self, content['data'] if 'data' in content else None)
        print('called')

    async def send_packet(self, handler, command, data):
        await self.send_json({"handler": handler, "command": command, "data": data})

    async def send_command(self, event):
        if not event['chan_name'] or self.channel_name != event['chan_name']:
            print(self.channel_name, event['chan_name'])
            await self.send_packet(event["handler"], event["command"], event["data"])


