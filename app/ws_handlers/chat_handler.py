import redis

from app.redis import RedisConnection
from app.utils import *
from app.ws_handlers.handler import Handler


class ChatHandler(Handler):
    name = 'chat'

    async def connection_opened(self, user):
        print(user)
        els = RedisConnection().redis_instance.lrange('chat', 0, 200)
        if len(els) == 0:
            return

        def str2msg(s):
            parts = s.decode("utf-8").split(":")
            return {'nickname': parts[0], 'message': parts[1]}

        await self.send('set_messages', list(map(str2msg, els)))

    @action(command='send_message')
    async def send_message(self, sender, packet):
        print('sending message packet', packet)
        print('sending message sender', sender.scope)
        if 'user' in sender.scope:
            RedisConnection().redis_instance.lpush('chat', sender.scope['user'].username+":"+packet['message'])
            await self.send_broadcast('send_message', {
                'message': packet['message'],
                'nickname': sender.scope['user'].username
            })
        else:
            await self.send("error", "not authorized")
