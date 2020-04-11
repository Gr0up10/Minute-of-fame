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
        let card = document.createElement('div');
        card.className = "card";
        card.style = "background-color: rgba(91,192,222,0.3); margin: 5px";

        let card_body = document.createElement('div');
        card_body.className = "card-body";

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

        card_body.appendChild(message);
        card.append(card_body);

        return card;
    }

    handle_message(name, packet) {
        let chat_box = document.getElementById("chat-box");
        let message = this.get_message(packet);

        chat_box.appendChild(message);
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
    }

    send_message() {
        let messageInputDom = document.querySelector('#chat-message-input');
        let message = messageInputDom.value.toString();
        console.log(message);
        if (message) {
            let packet = {
            'message': message,
            };
            this.send('send_message', packet);
            messageInputDom.value = '';
        }

    }
};
