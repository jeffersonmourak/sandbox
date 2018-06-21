class Ambient {
    constructor(interval = 500) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, this.getStream.bind(this), this.dispatch.bind(this, 'videoError'));
        }

        this.interval = interval;
        this.mockElements = {
            video: document.createElement("video"),
            canvas: document.createElement("canvas")
        }

        this.mockElements.canvas.width = 500;
        this.mockElements.canvas.height = 375;

        this.subscribers = {};

        setInterval( () => {
            this.dispatch('light_update', this.getData() )
        } , this.interval);
    }

    getData() {
        this.snapshot();
        return this.getAverageRGB();
    }

    snapshot() {
        let ctx = this.mockElements.canvas.getContext('2d');

        ctx.drawImage(this.mockElements.video, 0, 0, this.mockElements.canvas.width, this.mockElements.canvas.height);
    }

    getStream(stream) {
        this.mockElements.video.src = window.URL.createObjectURL(stream);;
    }

    on(eventName, fn) {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }

        this.subscribers[eventName].push(fn);
    }

    dispatch(eventName, data) {
        if (!this.subscribers[eventName]) {
            return;
        }

        this.subscribers[eventName].forEach(ev => ev(data));
    }

    getAverageRGB() {
        let blockSize = 5,
            defaultRGB = {
                r: 0,
                g: 0,
                b: 0
            },
            data = null,
            context = this.mockElements.canvas.getContext('2d'),
            i = 0,
            count = 0,
            rgb = defaultRGB;

            if (!context) {
                return defaultRGB;
            }

            try {
                data = context.getImageData(0, 0, this.mockElements.canvas.width, this.mockElements.canvas.height);
            } catch(e) {
                /* security error, img on diff domain */
                return defaultRGB;
            }

            while ( (i += blockSize * 4) < data.data.length ) {
                ++count;
                rgb.r += data.data[i];
                rgb.g += data.data[i+1];
                rgb.b += data.data[i+2];
            }

            rgb.r = ~~(rgb.r/count);
            rgb.g = ~~(rgb.g/count);
            rgb.b = ~~(rgb.b/count);

            return rgb;
    }
}