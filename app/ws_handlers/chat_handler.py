from app.utils import *
from app.ws_handlers.handler import Handler


class ChatHandler(Handler):
    name = 'chat'

    @action(command='send_message')
    async def send_message(self, sender, packet):
        print('sending message packet', packet)
        print('sending message sender', sender)
        await self.send_broadcast('send_message', {
            'message': packet['message'],
            'nickname': packet['nickname']
        })