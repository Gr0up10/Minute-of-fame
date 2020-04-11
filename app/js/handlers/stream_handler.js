export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;

        stream.onstream = (act) => this.send('queue', act);
    }

    handle_message(name, packet) {
        if (name === "set_stream"){
            $('#placeholder').css('display', 'none');
            console.log('hide')
            this.stream.watchStream(packet.stream);
        }
        if (name === "stop") {
            this.stream.stopStream();
            $('#placeholder').css('display', 'block');
        }
        if (name === "update_place"){
            $('#placeholder').css('display', 'none');
            console.log(packet);
        }
    }
}