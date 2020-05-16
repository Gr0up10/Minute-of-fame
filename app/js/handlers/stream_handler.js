export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;
        stream.viewer()
    }

    handle_message(name, packet) {
        console.log(this.stream.sdp_answer, packet.answer, packet.presenter, name)
        if (name === "sdp_answer") this.stream.sdp_answer(packet.answer, packet.presenter);
        if (name === "ice_candidate") this.stream.ice_candidate(packet, packet.presenter);
    }
}