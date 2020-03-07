$( document ).ready(function() {
    var socket = new WebSocket('ws://'+ window.location.host +'/ws/');

    function send(handler, message, packet){
        console.log(handler, message, packet)
        socket.send(JSON.stringify({'handler': handler, 'message': message, 'data': packet}))
    }

    window.socket = socket
    window.send = send

    //pollConsumer.addEventListener('message', poll_update)
    //pollConsumer.addEventListener('open', open)

    function send_like() {
        send('poll', 'like')
    }

    function send_dislike() {
        send('poll', 'dislike')
    }

    socket.onmessage = function(event) {
        console.log(event.data)
        pack = JSON.parse(event.data)
        if (pack.command == "update")
            $('#likes').text(pack.data.likes + ' ' + pack.data.dislikes);
        if(pack.command == "set_stream")
            window.watchStream(pack.data.stream)
    }

    socket.onopen  = function(event) {
        //socket.send(JSON.stringify({'message': "open"}));
    }

    $('#like-stream').click(send_like);
    $('#dislike-stream').click(send_dislike);
})