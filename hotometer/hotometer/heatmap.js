import _ from 'lodash';
import h337 from 'heatmap.js';

class Heatmap {
    constructor(size, data) {
        this.size = size;
        this.heatmapInstance = h337.create({
            container: document.body,
            radius: 40
        });

        if (data) {
            this.setData(data);
        }
    }

    setData(data) {
        this.data = this.getData(data);
        this.render();
    }

    getData(data) {
        let points = [],
            max = 0;

        _.forEach(data, (xVal, x) => {
            x = parseInt(x);
            _.forEach(xVal, (yVal, y) => {
                y = parseInt(y);

                let point = {
                    x,
                    y,
                    value: yVal
                };

                if (yVal > max) {
                    max = yVal;
                }
                points.push(point);
            });
        });

        return {
            max,
            data: points
        };
    }

    render() {
        this.heatmapInstance.removeData();
        this.heatmapInstance.setData(this.data);
    }
}

export default Heatmap;