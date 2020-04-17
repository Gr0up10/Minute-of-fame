import pytest

from app.consumers import WSConsumer
from tests.auth_communicator import AuthWebsocketCommunicator


@pytest.mark.asyncio
@pytest.mark.django_db
async def test_chat_consumer(login):
    communicator = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[0])
    connected, _ = await communicator.connect()
    assert connected
    await communicator.send_json_to({"handler": "chat", "message": "send_message", "data": {"message": "123"}})
    response = await communicator.receive_json_from()
    assert response == {'handler': 'chat', 'command': 'send_message', 'data': {'message': '123', 'nickname': 'user1'}}
    await communicator.disconnect()


@pytest.mark.asyncio
@pytest.mark.django_db
async def test_chat_consumers(login):
    communicator = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[0])
    connected, _ = await communicator.connect()
    assert connected
    communicator1 = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[1])
    connected, _ = await communicator1.connect()
    assert connected
    await communicator.send_json_to({"handler": "chat", "message": "send_message", "data": {"message": "123"}})
    response = await communicator.receive_json_from()
    assert response == {'handler': 'chat', 'command': 'send_message', 'data': {'message': '123', 'nickname': 'user1'}}
    response = await communicator1.receive_json_from()
    assert response == {'handler': 'chat', 'command': 'send_message', 'data': {'message': '123', 'nickname': 'user1'}}
    await communicator.disconnect()
    await communicator1.disconnect()


@pytest.mark.asyncio
@pytest.mark.django_db
async def test_chat_consumers_history(login):
    communicator = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[0])
    connected, _ = await communicator.connect()
    assert connected
    await communicator.send_json_to({"handler": "chat", "message": "send_message", "data": {"message": "123"}})
    response = await communicator.receive_json_from()
    assert response == {'handler': 'chat', 'command': 'send_message', 'data': {'message': '123', 'nickname': 'user1'}}
    communicator1 = AuthWebsocketCommunicator(WSConsumer, '/ws/', user=login[1])
    connected, _ = await communicator1.connect()
    assert connected
    response = await communicator1.receive_json_from()
    assert response == {"handler": "chat", "command": "set_messages", "data": [{'nickname': 'user1', "message": "123"}]}