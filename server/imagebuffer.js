const gm = require('gm');

class ImageBuffer {
    constructor(props = {}) {
        this.buffer = {};
        this.format = "png";
        this.backgroundColor = "transparent";
        this.createBuffer(props.width, props.height);
    }

    createBuffer(width = 500, height = 500) {
        gm(width, height, this.backgroundColor)
            .setFormat(this.format)
            .toBuffer((err, buf) => {
                if(err) {
                    console.error(err);
                    return;
                }

                this.buffer = buf;
            });
    }
}

module.exports = ImageBuffer;