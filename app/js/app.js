import Socket from './socket.js'
import Stream from './stream.js'
import PacketHandler from './handlers/packet_handler.js'
import VotingHandler from './handlers/voting_handler.js'
import StreamHandler from './handlers/stream_handler.js'

$( document ).ready(function() {
    var stream = new Stream();

    var socket = new Socket();
    var packet_handler = new PacketHandler({
        'poll': new VotingHandler(socket),
        'stream': new StreamHandler(socket, stream)
    });
    packet_handler.bind_handlers(socket);

    socket.onpacket = packet_handler.handle_packet.bind(packet_handler)

    socket.connect();
});