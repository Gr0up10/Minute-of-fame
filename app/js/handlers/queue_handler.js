export default class QueueHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;


        stream.onstream = (act) => {
            console.log("start stream")
            let title_input = $("#title_input").val()
            console.log(title_input)
            let description_input = $("#description_input").val()
            this.send('queue', {'stream_type': act.stream_type, 'id': act.id, 'title': title_input , 'description': description_input});
        }
    }

    handle_message(name, packet) {
        if (name === "set_stream") {
        console.log('Set stream')
        console.log(packet)
        document.getElementById("stream_title").innerHTML = packet.title;
        document.getElementById("stream_description").innerHTML = packet.description;
        document.getElementById("streamer_name").innerHTML = packet.publisher
        //this.stream.watchStream(packet.id);
        }
        if (name === "stop") this.stream.stopStream();
        if (name === "update_places") console.log(packet);
        if (name === "set_time") console.log(packet);
        if (name == "update_viewers") $(".secondary-text b").text(packet.count)
    }
}