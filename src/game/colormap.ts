import pts2 from "../util/pts2";

export const map_span = 100

export class pixel {
	constructor(public readonly pos: vec2, public data: vec4) {
	}
	is_color(vec: vec3) {
		return vec[0] == this.data[0] &&
			vec[1] == this.data[1] &&
			vec[2] == this.data[2];
	}
	normalize(): vec4 {
		return [
			this.data[0] / 255,
			this.data[1] / 255,
			this.data[2] / 255,
			this.data[3] / 255,
		]
	}
	is_black() {
		return this.is_color([0, 0, 0]);
	}
	is_white() {
		return this.is_color([255, 255, 255]);
	}
}

export class colormap {
	readonly data: vec4[][] = []
	canvas
	ctx
	constructor(id: string) {
		var img = document.getElementById(id) as any;
		if (!img.complete)
			console.error(' mall bad colormap ', id);
		this.canvas = document.createElement('canvas')!;
		this.canvas.width = map_span;
		this.canvas.height = map_span;
		this.ctx = this.canvas.getContext('2d', {
			alpha: true,
			desynchronized: false,
			willReadFrequently: true
		})
		this.ctx.translate(0, map_span);
		this.ctx.scale(1, -1);
		this.ctx.drawImage(img, 0, 0, img.width, img.height);
		this.process();
	}
	get(pos: vec2): vec4 {
		if (this.data[pos[1]])
			return this.data[pos[1]][pos[0]] || [0, 0, 0, 0];
		return [0, 0, 0, 0];
	}
	pixel(pos: vec2) {
		return new pixel(pos, [...this.get(pos)] as vec4);
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