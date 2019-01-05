const Server = require("./server/socket.js");
const ImageBuffer = require("./server/imagebuffer");
const { performance } = require("perf_hooks");
const gm = require('gm');
require("gm-base64");

const socket = new Server({ onMessage });
const image = new ImageBuffer();

function onMessage(data) {
    console.log('Image requested', data);
    const t = performance.now();
    const { x, y, message } = data;
    textToImage({ text: { x, y, message } })
        .then(res => {
            socket.sendMessage(res);
            console.log(`Image created in ${((performance.now() - t) / 1000).toFixed(3)}s`);
        });
}

const textToImage = opts => {
    const { x, y, message, fontSize = 40 } = opts.text;

    return new Promise((res, rej) => {
        gm(image.buffer)
            .fontSize(fontSize)
            .drawText(x, y, message, "Center")
            .toBase64('bmp', function(err, base64){
                if (err) {
                    console.log(err);
                } else {
                    res(base64);
                }
            });
    });
}
