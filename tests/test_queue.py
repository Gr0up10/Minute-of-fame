import pytest

from app.consumers import WSConsumer
from tests.auth_communicator import AuthWebsocketCommunicator


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_queue_consumer_start(login):
    communicator = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[0])
    connected, _ = await communicator.connect()
    assert connected
    communicator1 = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[1])
    connected, _ = await communicator1.connect()
    assert connected

    await communicator.send_json_to({"handler": "stream", "message": "queue", "data": {'id': 123, 'duration': 1}})
    response = await communicator1.receive_json_from(2)
    assert response == {'handler': 'stream', 'command': 'set_stream', 'data': {'stream': '123'}}
    response = await communicator1.receive_json_from(2)
    assert response == {'handler': 'stream', 'command': 'set_time', 'data': {'time': 1}}
    response = await communicator.receive_json_from(2)
    assert response == {'handler': 'stream', 'command': 'set_time', 'data': {'time': 1}}

    await communicator.disconnect()


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_queue_consumer(login):
    communicator = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[0])
    connected, _ = await communicator.connect()
    assert connected
    communicator1 = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[1])
    connected, _ = await communicator1.connect()
    assert connected

    await communicator.send_json_to({"handler": "stream", "message": "queue", "data": {'id': 123, 'duration': 2}})
    response = await communicator1.receive_json_from(2)
    assert response == {'handler': 'stream', 'command': 'set_stream', 'data': {'stream': '123'}}
    await communicator1.send_json_to({"handler": "stream", "message": "queue", "data": {'id': 321, 'duration': 2}})
    response = await communicator1.receive_json_from(2)
    assert response == {'handler': 'stream', 'command': 'update_place', 'data': {'place': 2, 'others': ['user1', 'user2']}}
    for i in range(2, 0, -1):
        response = await communicator1.receive_json_from(2)
        assert response == {'handler': 'stream', 'command': 'set_time', 'data': {'time': i}}
        response = await communicator.receive_json_from(2)
        assert response == {'handler': 'stream', 'command': 'set_time', 'data': {'time': i}}

    response = await communicator.receive_json_from(2)
    assert response == {'handler': 'stream', 'command': 'stop', 'data': None}
    #response = await communicator.receive_json_from(2)
    #assert response == {'handler': 'stream', 'command': 'set_stream', 'data': {'stream': '321'}}

    await communicator.disconnect()
