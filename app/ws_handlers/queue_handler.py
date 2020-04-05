import asyncio
from app.utils import *
from app.ws_handlers.handler import Handler
from asgiref.sync import sync_to_async
from app.ws_handlers.stream_utils import *
from channels.db import database_sync_to_async


class QueueHandler(Handler):
    name = "stream"

    async def broadcast_current_stream(self, sender):
        await self.send_broadcast_but_me('set_stream', {"stream": await sync_to_async(get_current_stream_id)()})

    async def connection_opened(self):
        print("check active stream")
        if await sync_to_async(is_stream_active)():
            print("send connect")
            await self.send('set_stream', {"stream": await sync_to_async(get_current_stream_id)()})

    @action(command="stop_stream")
    async def stop_stream(self, sender, packet):
        user = sender.scope["user"]
        if user.is_anonymous and await sync_to_async(Stream.objects.filter(user=user).exists()):
            stream = await sync_to_async(Stream.objects.get(user=user))
            stream.active = False
            await sync_to_async(stream.save)()

    @action(command="queue")
    async def queue(self, sender, packet):
        print('queueing')
        user = sender.scope["user"]
        if user.is_anonymous:
            await self.send('error', {"error": "You should be authorized to start stream"})
            print('not logged')
            return
        is_streaming = await sync_to_async(is_stream_active)()
        print(is_streaming)
        if is_streaming:
            print('someone streaming')
            # sender.send_json({"error": "Someone is streaming right now"})
            # return
            stream = await sync_to_async(get_current_stream)()
            stream.active = False
            await sync_to_async(stream.save)()
        print("creating model")
        model = Stream(publisher=user, stream_id=packet['id'])
        print("model created")
        await sync_to_async(model.save)()
        print(user.username)
        await self.broadcast_current_stream(sender)
        asyncio.create_task(self.start_timer(90))
        print('save')

    async def start_timer(self, time):
        for i in range(time, 0, -1):
            await self.send_broadcast('set_time', {'time': i})
            await asyncio.sleep(1)
