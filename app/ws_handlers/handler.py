class Handler:
    def __init__(self, consumer):
        self.consumer = consumer

    async def connection_opened(self):
        pass

    async def send(self, command, pack):
        await self.consumer.send_packet(self.name, command, pack)

    async def send_broadcast(self, command, pack):
        await self.consumer.send_broadcast(self.name, command, pack)

    async def send_broadcast_but_me(self, command, pack):
        await self.consumer.send_broadcast(self.name, command, pack, self.consumer.channel_name)