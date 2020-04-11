export default class PacketHandler {
    constructor(handlers) {
        this.handlers = handlers;
    }

    bind_handlers(socket) {
        for (const [key, value] of Object.entries(this.handlers)) value.send = (cmd, p)=> socket.send(key, cmd, p)
    }

    handle_packet(pack) {
        if(pack.handler in this.handlers) {
            this.handlers[pack.handler].handle_message(pack.command, JSON.parse(pack.data))
        } else {
            console.error("Cannot find handler for packet command: "+pack.handler)
        }
    }
}