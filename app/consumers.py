from channels.generic.websocket import WebsocketConsumer
import json


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        packet_name = data['command']
        self.packet_map[packet_name](self, data)

    def handle_message(self, packet):
        print(packet)

    packet_map = {
        "message": handle_message
    }
