export default class ChatHandler {
    constructor(socket) {
        this.socket = socket;
        this.bind()
    }

    bind() {
        $('#chat-message-submit').click(this.send_message.bind(this));
        $('#chat-message-input').keyup(this.keyup.bind(this));

    }

    keyup() {
        document.querySelector('#chat-message-input').onkeyup = function (e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#chat-message-input').focus();
                document.querySelector('#chat-message-submit').click();
            }
        };
    }

    handle_message(packet, name) {
        console.debug('asdafds');
        document.querySelector('#chat-box').value += (packet + name + '\n');
    }

    send_message() {
        let messageInputDom = document.querySelector('#chat-message-input');
        let message = messageInputDom.value.toString();
        console.log(message);
        this.send('send_message', message, message);
        messageInputDom.value = '';

    }
};
