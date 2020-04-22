import Socket from './socket.js'
import Stream from './stream.js'
import PacketHandler from './handlers/packet_handler.js'
import VotingHandler from './handlers/voting_handler.js'
import StreamHandler from './handlers/stream_handler.js'
import ChatHandler from "./handlers/chat_handler";

$(document).ready(function () {
    let stream = new Stream();

    let socket = new Socket();
    let packet_handler = new PacketHandler({
        'poll': new VotingHandler(socket),
        'queue': new StreamHandler(socket, stream),
        'chat': new ChatHandler(socket)

    });
    packet_handler.bind_handlers(socket);

    socket.onpacket = packet_handler.handle_packet.bind(packet_handler);

    socket.connect();
});


grecaptcha.ready(function() {
    console.log('recapcha ready')
  $('#register_btn').click(function(e){
      var form = this;
      e.preventDefault()
      grecaptcha.execute('6Lc3K-MUAAAAAJM2Ho9U4tiTIZp-A9PPeGIyyw5z', {action: 'register_form'}).then(function(token) {
            console.log(token);
            console.log(document.getElementById("add_form"));
          $('#recaptcha').val(token);
          $('#register_form').submit()
      });
  })
});