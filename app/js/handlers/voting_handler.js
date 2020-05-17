export default class VotingHandler {
    constructor(socket) {
        this.socket = socket;

        this.bind_buttons()
    }

    bind_buttons() {
        $('#like-stream').click(this.send_like.bind(this));
        $('#dislike-stream').click(this.send_dislike.bind(this));
    }

    handle_message(name, packet) {
        packet = JSON.parse(packet)
        console.log(packet)
        $('#likes').text(packet.likes + ' ' + packet.dislikes);
        let l = Number(packet.likes);
        let d = Number(packet.dislikes);
        let l1 = (100/(l+d))*l;
        let d1 = (100/(l+d))*d;
        // Отладочный вывод
//        console.log('l = '+l+' d = '+d);
//        console.log('l1 = '+l1+' d1 = '+d1);
//        console.log('packet.likes = '+packet.likes+' packet.dislikes = '+packet.dislikes);
        $('#likebar').attr('style','width:'+l1+'px');
        $('#dislikebar').attr('style','width:'+d1+'px');
    }

    send_like() {
        this.send('like')
    }

    send_dislike() {
        this.send('dislike')
    }
}