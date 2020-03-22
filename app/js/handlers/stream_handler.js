export default class StreamHandler {
    constructor(socket, stream) {
        this.socket = socket;
        this.stream = stream;

        this.timer = $('#stream-timer-overlay')

        stream.onstream = (act) => this.send('queue', act);
        stream.onstreamstop = () => this.send('stop_stream');
    }

    handle_message(name, packet) {
        console.log(name)
        switch(name){
            case "set_stream":
                this.stream.watchStream(packet.stream);
                break
            case "set_time":
                this.timer.text(packet.time > 59 ? Math.round(packet.time/60)+":"+(packet.time%60) : packet.time)
                break
            default:
                break
        }
    }
}