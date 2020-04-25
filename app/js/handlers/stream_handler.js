export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;


        stream.onstream = (act) => {
            console.log("start stream")
            let name_input = $("#title_input").val()
            console.log(name_input)
            let description_input = $("#description_input").val()
            this.send('queue', {'stream_type': act.stream_type, 'id': act.id, 'title': name_input , 'description': description_input});
        }
    }

    handle_message(name, packet) {
        if (name === "set_stream") this.stream.watchStream(packet.id, packet.title, packet.description);
        if (name === "stop") this.stream.stopStream();
        if (name === "update_places") console.log(packet);
        if (name === "set_time") console.log(packet);
    }
}