import pts from "./pts.js";
export const map_span = 200;
const invalid = [-1, -1, -1, -1];
export class pixel {
    parent;
    pos;
    data;
    constructor(parent, pos, data) {
        this.parent = parent;
        this.pos = pos;
        this.data = data;
    }
    left() {
        return this.parent.pixel(pts.add(this.pos, [-1, 0]));
    }
    right() {
        return this.parent.pixel(pts.add(this.pos, [1, 0]));
    }
    top() {
        return this.parent.pixel(pts.add(this.pos, [0, 1]));
    }
    bottom() {
        return this.parent.pixel(pts.add(this.pos, [0, -1]));
    }
    connections() {
        let same = 0;
        if (this.left().is_color(this.data))
            same++;
        if (this.right().is_color(this.data))
            same++;
        if (this.top().is_color(this.data))
            same++;
        if (this.bottom().is_color(this.data))
            same++;
        return same;
    }
    is_color(vec) {
        return vec[0] == this.data[0] && vec[1] == this.data[1] && vec[2] == this.data[2];
    }
    normalize() {
        return [this.data[0] / 255, this.data[1] / 255, this.data[2] / 255, this.data[3] / 255];
    }
    is_black() {
        return this.is_color([0, 0, 0]);
    }
    is_white() {
        return this.is_color([255, 255, 255]);
    }
}
export class colormap {
    data = [];
    canvas;
    ctx;
    constructor(id) {
        var img = document.getElementById(id);
        if (!img.complete)
            console.error(' mall bad colormap ', id);
        this.canvas = document.createElement('canvas');
        this.canvas.width = map_span;
        this.canvas.height = map_span;
        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            desynchronized: false,
            willReadFrequently: true
        });
        this.ctx.translate(0, map_span);
        this.ctx.scale(1, -1);
        this.ctx.drawImage(img, 0, 0, img.width, img.height);
        this.process();
    }
    get(pos) {
        return [...(() => this.data[pos[1]] ? this.data[pos[1]][pos[0]] : 0)() || invalid];
    }
    pixel(pos) {
        return new pixel(this, pos, this.get(pos));
    }
    process() {
        for (let y = 0; y < map_span; y++) {
            for (let x = 0; x < map_span; x++) {
                const data = this.ctx.getImageData(x, map_span - 1 - y, 1, 1).data;
                if (this.data[y] == undefined)
                    this.data[y] = [];
                this.data[y][x] = data;
            }
        }
    }
}
