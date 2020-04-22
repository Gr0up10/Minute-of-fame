export default class Socket {
    constructor() {
        this.socket = undefined;

        this.onpacket = () => ({});
    }

    get isConnected() {
        if (this.socket) return (this.socket.readyState === 1);
        return false;
    }

    connect() {
        if(this.isConnected) return;
        let addr = `${(DEBUG ? 'ws://' : 'wss://')}${window.location.host}:${WS_PORT}/`
        console.log('connection to '+addr)
        this.socket = new WebSocket(addr);
        this.socket.onopen = this.connected;
        console.log('Connected to ' + addr);

        this.socket.onmessage = (event) => {
            console.log(event.data);
            this.onpacket(JSON.parse(event.data))
        }
    }

    connected() {
        console.log('Successfully connected')
    }

    send(handler, message, packet) {
        console.log(handler, message, packet);
        this.socket.send(JSON.stringify({'handler': handler, 'command': message, 'data': packet || ''}))
    }
}