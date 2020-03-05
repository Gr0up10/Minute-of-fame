import channels.layers
from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .models import *
import sched, time




class PollConsumer(WebsocketConsumer):
    likes = 0;
    dislikes = 0;
    poll_result = 0;

    def connect(self):
        self.room='room'
        self.room_group_name = 'ws_%s' % self.room
        self.accept()
        #TODO привязать создание записи БД к началу стрима
        item = PollStat(id=1, poll_result=self.poll_result, likes=self.likes, dislikes=self.dislikes)
        item.save()
        print("Yes, connected")


    def disconnect(self, close_code):
        print("Disconnected")


    def receive(self, text_data):
        data = json.loads(text_data)
        packet_name = data['message']
        self.packet_map[packet_name](self, data)
        #print("receive", data)


    def handle_message(self, packet):
        print(packet,"= message_test is OK")

    def send_poll_result(self):
        self.poll_result = round(self.likes / (self.likes + self.dislikes) * 100)
        #self.send(str(self.poll_result))
        item = PollStat(id=1,poll_result=self.poll_result, likes=self.likes, dislikes=self.dislikes)
        item.save()
        # print("likes = ",self.likes,"dislikes = ", self.dislikes,"res = ", self.poll_result)

    def like(self, packet):
        self.likes += 1;
        self.send_poll_result()

    def dislike(self, packet):
        self.dislikes += 1
        self.send_poll_result()

    def open(self, packet):
        data = PollStat.objects.last()
        self.likes=data.likes
        self.dislikes=data.dislikes
        self.send(str(data.poll_result))
        #print("open and send: ",self.poll_result)

    def update(self, packet):
        data = PollStat.objects.last()
        self.send(str(data.poll_result))
        print("update and send: ", self.poll_result)

    packet_map = {
        "message": handle_message,
        "like": like,
        "dislike": dislike,
        "update": update,
        "open": open,
    }