import asyncio

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncJsonWebsocketConsumer
import json

from django.db.models import Sum

from .models import Stream, PollStat, LikeDislike
from .utils import *


def get_current_stream():
    return Stream.objects.get(active=True)


def get_current_stream_id():
    return get_current_stream().publisher.username


def is_stream_active():
    return Stream.objects.filter(active=True).exists()


class PollHandler:
    @action(command="like")
    async def like(self, sender, packet):
        await sync_to_async(self.vote)(sender, True)
        await self.update(sender)
        print("like")

    @action(command="dislike")
    async def dislike(self, sender, packet):
        await sync_to_async(self.vote)(sender, False)
        await self.update(sender)
        print("dislike")

    @staticmethod
    def get_stat(sender):
        stream = get_current_stream()
        stat = PollStat.objects.filter(stream=stream)
        likes, dises = 0, 0
        for s in stat:
            if s.vote == LikeDislike.LIKE:
                likes += 1
            else:
                dises += 1
        print(likes, dises)
        return likes, dises

    @staticmethod
    async def update(sender):
        likes, dislikes = await sync_to_async(PollHandler.get_stat)(sender)
        await sender.channel_layer.group_send(sender.GROUP_NAME, {
            "type": "send.command", "command": "update", "data": {"likes": likes, "dislikes": dislikes}
        })

    @staticmethod
    def vote(sender, like):
        PollStat(user=sender.scope["user"], stream=get_current_stream(),
                 vote=LikeDislike.LIKE if like else LikeDislike.DISLIKE).save()


class QueueHandler:
    @staticmethod
    async def broadcast_current_stream(sender):
        await sender.send_broadcast('set_stream', {"stream": await sync_to_async(get_current_stream_id)()})

    @action(command="queue")
    async def queue(self, sender, packet):
        print('queueing')
        user = sender.scope["user"]
        if user.is_anonymous:
            sender.send_json({"error": "You should be authorized to start stream"})
            print('not logged')
            return
        is_streaming = await sync_to_async(is_stream_active)()
        print(is_streaming)
        if is_streaming:
            print('someone streaming')
            sender.send_json({"error": "Someone is streaming right now"})
            return
        model = Stream(publisher=user)
        await sync_to_async(model.save)()
        print(user.username)
        await self.broadcast_current_stream(sender)
        print('save')
        await asyncio.sleep(40)
        model.active = False
        await sync_to_async(model.save)()
        print('end')


class WSConsumer(AsyncJsonWebsocketConsumer):
    GROUP_NAME = 'main'

    handlers = {
        "poll": PollHandler(),
        "queue": QueueHandler()
    }

    async def send_broadcast(self, command, data):
        await self.channel_layer.group_send(self.GROUP_NAME, {
            "type": "send.command", "command": command, "data": data
        })

    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
        if await sync_to_async(is_stream_active)():
            await self.send_packet('set_stream', {"stream": await sync_to_async(get_current_stream_id)()})
        print("connected")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)
        print("Disconnected")

    async def receive_json(self, content, **kwargs):
        print(content)
        handler, packet_name = content['handler'], content['message']
        await find_action(self.handlers[handler], packet_name)(self, content)
        print('called')

    async def send_packet(self, command, data):
        await self.send_json({"command": command, "data": data})

    async def send_command(self, event):
        await self.send_json({"command": event["command"], "data": event["data"]})


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print("user connected")

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group

    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        if message:
            self.send(text_data=json.dumps({
                'message': message
            }))
