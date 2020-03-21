export default class VotingHandler {
    constructor(socket) {
        this.socket = socket

        this.bind_buttons()
    }

    bind_buttons() {
        $('#like-stream').click(this.send_like.bind(this));
        $('#dislike-stream').click(this.send_dislike.bind(this));
    }

    handle_message(name, packet) {
        $('#likes').text(packet.likes + ' ' + packet.dislikes);
    }

    send_like() {
        this.send('like')
    }

    send_dislike() {
        this.send('dislike')
    }
}