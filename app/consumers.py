from channels.generic.websocket import WebsocketConsumer
import json


class ChatConsumer(WebsocketConsumer):
    likes = 0;
    dislikes = 0;
    poll_result = 0;

    def connect(self):
        self.accept()
        print("Yes, connected")

    def disconnect(self, close_code):
        print("Disconnected")


    def receive(self, text_data):
        data = json.loads(text_data)
        packet_name = data['message']
        self.packet_map[packet_name](self, data)
        print("receive", data)





    def handle_message(self, packet):
        print(packet,"=message")

    def like(self, packet):
        print(packet,"=like")
        #self.likes += 1;
        #self.poll_result = round(self.likes / (self.likes + self.dislikes) * 100);

    def dislike(self, packet):
        print(packet,"=dislike")
        #self.dislikes += 1;
        #self.poll_result = round(self.likes / (self.likes + self.dislikes) * 100);

    packet_map = {
        "message": handle_message,
        "like": like,
        "dislike": dislike,
    }