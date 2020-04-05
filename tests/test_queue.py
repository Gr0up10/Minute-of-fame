import pytest

from app.consumers import WSConsumer
from tests.auth_communicator import AuthWebsocketCommunicator


@pytest.mark.asyncio
@pytest.mark.django_db
async def test_queue_consumer(login):
    communicator = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[0])
    connected, _ = await communicator.connect()
    assert connected
    communicator1 = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[1])
    connected, _ = await communicator1.connect()
    assert connected

    await communicator.send_json_to({"handler": "stream", "message": "queue", "data": {'id': 123}})
    response = await communicator1.receive_json_from(2)
    assert response == {'handler': 'stream', 'command': 'set_stream', 'data': {'id': 123}}
    await communicator.disconnect()