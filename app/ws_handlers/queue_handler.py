import asyncio
from app.utils import *
from app.ws_handlers.handler import Handler
from asgiref.sync import sync_to_async
from app.ws_handlers.stream_utils import *
from channels.db import database_sync_to_async


class QueueHandler(Handler):
    name = "stream"
    START_TIME = 40

    def __init__(self, *args):
        super().__init__(*args)
        self.stream = None
        self.user = None
        self.timer = None

    @database_sync_to_async
    def get_pending(self):
        stream = get_current_stream()
        return list(Stream.objects.filter(date__gte=stream.date, pending=True))

    @database_sync_to_async
    def get_pending_names(self):
        stream = get_current_stream()
        return list(Stream.objects.filter(date__gte=stream.date, pending=True).values_list('publisher__username', flat=True))

    async def broadcast_current_stream(self):
        await self.send_broadcast_but_me('set_stream', {"stream": await sync_to_async(get_current_stream_id)()})

    async def connection_opened(self, user):
        self.user = user
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
        if not self.user or self.user.is_anonymous:
            await self.send('error', {"error": "You should be authorized to start stream"})
            return
        is_streaming = await sync_to_async(is_stream_active)()
        print(is_streaming)
        if is_streaming:
            self.stream = Stream(publisher=self.user, stream_id=packet['id'], active=False)
            await sync_to_async(self.stream.save)()
            pending = await self.get_pending_names()
            print(pending)
            print('someone streaming')
            await self.send('update_place', {'place': len(pending), 'others': pending})
        else:
            await self.start_stream(packet['id'], packet['duration'] if 'duration' in packet else False)

    async def start_stream(self, id, duration):
        if duration > self.START_TIME:
            return

        self.stream = Stream(publisher=self.user, stream_id=id, active=True)
        await sync_to_async(self.stream.save)()
        print("{} starts stream".format(self.user.username))
        await self.broadcast_current_stream()
        self.timer = asyncio.create_task(self.start_timer(self.START_TIME if not duration else duration))
        print('save')

    @action('next', True)
    async def next(self, sender, data):
        print("Next is {}".format(data.username))
        if data.username == self.user.username:
            await self.start_stream(data.id, self.START_TIME)

    async def start_timer(self, time):
        for i in range(time, 0, -1):
            await self.send_broadcast('set_time', {'time': i})
            await asyncio.sleep(1)
        # asyncio.get_event_loop().stop()
        await self.send('stop')
        print('send stop')
        self.stream.pending = False
        self.stream.active = False
        await sync_to_async(self.stream.save)()
        print('update model')
        pendings = await self.get_pending()
        print(pendings)
        if pendings:
            await self.send_in('next', pendings[0])
