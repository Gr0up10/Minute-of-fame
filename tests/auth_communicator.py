from channels.testing import WebsocketCommunicator


class AuthWebsocketCommunicator(WebsocketCommunicator):
    def __init__(self, application, path, headers=None, subprotocols=None, user=None):
        super(AuthWebsocketCommunicator, self).__init__(application, path, headers, subprotocols)
        if user is not None:
            self.scope['user'] = user
