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

    checkFileExist(url) {
                http.open('HEAD', url, false);
                http.send();
                if (http.status === 200) {
                    return true
                } else {
                    return false
                }
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

        let emote_list = "Ricardo AbsoluteLegend Doge JudgeLook Cry ThumbUp LatchBall SmugDance HamsterCam DogeDS"
        let file_types = [".png", ".gif", ".jpg"]
        let message_tokens = packet.message.split(" ")
        let final_message = ""
        for (let i = 0; i < message_tokens.length; i++){
            message_tokens[i] = message_tokens[i].replace('\n', '')
            //if keyword emote is present, switch it with a corresponding image
            if (message_tokens[i] != ''){
                if (emote_list.includes(message_tokens[i])){
                    // Find file type
                    let type = ".png"
                    for (i in file_types){
                        if (this.checkFileExist(""\"chat-emote\" src=\"static\\Pictures\\emotes\\"+ message_tokens[i] + i)){
                            type = i
                            break
                        }
                    }
                    message_tokens[i] = "<img class=\"chat-emote\" src=\"static\\Pictures\\emotes\\"+ message_tokens[i] + type +" alt=\""+ message_tokens[i] +"\">"
                }
                final_message += message_tokens[i] + " "
            }
        }
        packet.message = final_message

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
