const fs = require('fs');
const gm = require('gm');
const path = require("path");
const { performance } = require('perf_hooks');
const argv = require('minimist')(process.argv.slice(2));
require("gm-base64");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let buffer;
gm(500, 500, "transparent")
    .setFormat('png')
    .toBuffer((err, buf) => {
        if(err) {
            console.error(err);
            return;
        }

        buffer = buf;
    });
console.log(`Server started. Listening for Connections.`)
const textToImage = opts => {
    const { x, y, content } = opts.text;

    return new Promise((res, rej) => {
        gm(buffer)
            .drawText(x, y, content)
            .toBase64('bmp', function(err, base64){
                if (err) {
                    console.log(err);
                } else {
                    res(base64);
                }
            });
    });
}


wss.on('connection', function connection(ws) {
    console.log(`connection established`)
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        const parsed = JSON.parse(message);
        const { width, height, x, y } = parsed;
        textToImage({
            width,
            height,
            text: {
                x,
                y,
                content: parsed.message
            }
        })
            .then(res => {
                console.log(`done`)
                ws.send(res);
            });
        
    });
});