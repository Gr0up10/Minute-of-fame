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

    get_message(packet) {
        let nickname = packet.nickname.toString();
        nickname += ': ';

        let message = document.createElement('div'); // message block
        message.className = "chat-message d-flex";

        let p_tag = document.createElement('p'); // message paragraph
        let b_tag = document.createElement('b'); // nickname

        let text_message = document.createElement('div'); // message text
        b_tag.innerHTML = nickname;

        text_message.innerHTML = packet.message;
        p_tag.appendChild(b_tag);

        p_tag.appendChild(text_message);
        message.appendChild(p_tag);

        return message;
    }

    handle_message(name, packet) {
        let chat_box = document.getElementById("chat-box");
        let message = this.get_message(packet);

        chat_box.appendChild(message);
    }

    send_message() {
        let messageInputDom = document.querySelector('#chat-message-input');
        let message = messageInputDom.value.toString();
        console.log(message);
        if (message) {
            let nickname = 'user';
            let packet = {
            'message': message,
            'nickname': nickname
            };
            this.send('send_message', packet);
            messageInputDom.value = '';
        }

    }
};
