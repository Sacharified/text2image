const WebSocket = require('ws');

class Server {
    constructor({ port = 8080, onMessage }) {
        this._messageCallback = onMessage;
        this.ws = new WebSocket.Server({ port });
        console.log(`Socket opened`)
        this.onConnection = this.onConnection.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.ws.on('connection', this.onConnection);
    }

    onConnection(ws) {
        this.socket = ws;
        console.log(`Connection established.`);
        ws.on('message', this.onMessage);
    }

    onMessage(message) {
        try {
            const parsed = JSON.parse(message);
            this._messageCallback(parsed);
        } catch(e) {
            console.error(e);
        }
    }

    sendMessage(message) {
        this.socket.send(message);
    }
}

module.exports = Server;