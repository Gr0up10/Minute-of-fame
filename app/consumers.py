from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncJsonWebsocketConsumer
import json

from channels.layers import get_channel_layer

from .models import *


class PollConsumer(AsyncJsonWebsocketConsumer):
    likes = 0
    dislikes = 0
    poll_result = 0

    async def connect(self):
        #self.channel_layer = get_channel_layer()
        # TODO привязать создание записи БД к началу стрима
        #item = PollStat(id=1, poll_result=self.poll_result, likes=self.likes, dislikes=self.dislikes)
        #item.save()
        print(self.channel_layer)
        await self.channel_layer.group_add("chat", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("chat", self.channel_name)
        print("Disconnected")

    async def receive_json(self, content, **kwargs):
        packet_name = content['message']
        self.packet_map[packet_name](self, content)
        #print("receive", data)

    def save_poll_result(self):
        self.poll_result = round(self.likes / (self.likes + self.dislikes) * 100)
        #self.send(str(self.poll_result))
        #item = PollStat(id=1, poll_result=self.poll_result, likes=self.likes, dislikes=self.dislikes)
        #item.save()
        # print("likes = ",self.likes,"dislikes = ", self.dislikes,"res = ", self.poll_result)

    async def like(self, packet):
        self.likes += 1
        self.save_poll_result()
        await self.update()

    async def dislike(self, packet):
        self.dislikes += 1
        self.save_poll_result()
        await self.update()

    async def open(self, packet):
        data = PollStat.objects.last()
        self.likes = data.likes
        self.dislikes = data.dislikes
        await self.send(str(data.poll_result))
        #print("open and send: ",self.poll_result)

    async def update(self):
        #data = PollStat.objects.last()
        #await self.channel_layer.group_send('main', self.likes-self.dislikes)
        await  self.channel_layer.group_send(
            "chat",
            {
                "message": "update",
                "data": {"dislikes": self.dislikes, "likes": self.likes},
            },
        )
        #self.send(str(data.poll_result))
        print("update and send: ", self.poll_result)

    packet_map = {
        "like": like,
        "dislike": dislike,
        "open": open,
    }