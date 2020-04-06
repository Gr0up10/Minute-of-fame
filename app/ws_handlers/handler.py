class Handler:
    name = ''

    def __init__(self, consumer):
        self.consumer = consumer

    async def connection_opened(self, user):
        pass

    async def disconnect(self):
        pass

    async def send_in(self, command, pack=None):
        await self.consumer.send_internal_broadcast_message(self.name, command, pack)

    async def send(self, command, pack=None):
        await self.consumer.send_packet(self.name, command, pack)

    async def send_broadcast(self, command, pack=None):
        await self.consumer.send_broadcast(self.name, command, pack)

    async def send_broadcast_but_me(self, command, pack=None):
        await self.consumer.send_broadcast(self.name, command, pack, self.consumer.channel_name)