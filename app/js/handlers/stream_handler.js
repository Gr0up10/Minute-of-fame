export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;

        stream.onstream = (act) => this.send('queue', act);
    }

    handle_message(name, packet) {
        if (name === "set_stream") this.stream.watchStream(packet.id);
        if (name === "stop") this.stream.stopStream();
        if (name === "update_places") console.log(packet);
        if (name === "set_time") console.log(packet);
    }
}