export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;

        stream.onstream = (act) => this.send('queue', act);
    }

    handle_message(name, packet) {
        if (name === "set_stream") this.stream.watchStream(packet.stream);
        if (name === "stop") this.stream.stopStream();
        if (name === "update_place") console.log(packet);
        if (name === "set_time") $('#stream-timer-overlay').text(packet.time);
    }
}