export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;

        let name_input = document.getElementById("title_input")
        let description_input = document.getElementById("description_input")

        stream.onstream = (act) => this.send('queue', {'act': act , 'title': title_input , 'description': description_input});
    }

    handle_message(name, packet) {
        if (name === "set_stream") this.stream.watchStream(packet.id, packet.title, packet.description);
        if (name === "stop") this.stream.stopStream();
        if (name === "update_places") console.log(packet);
        if (name === "set_time") console.log(packet);
    }
}