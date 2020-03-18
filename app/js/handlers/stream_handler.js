export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;

        stream.onstream = (act) => this.send('queue');
    }

    handle_message(name, packet) {
        if (name === "set_stream") this.stream.watchStream(packet.stream);
    }
}