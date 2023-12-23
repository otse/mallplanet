/// the view manages what it sees

import mkb from "../mkb.js"
import pts2 from "../util/pts2.js"

import lod from "./lod.js"
import renderer from "../renderer.js"
import dolly from "./dolly.js"
import mall from "../mall.js"

let stats

export class view_needs_rename {
	zoom = 10
	wpos: vec2 = [0, 0]
	rpos: vec2 = [0, 0]
	compas: dolly

	static make() {
		return new view_needs_rename;
	}
	chart(big: vec2) {
	}
	constructor() {
		this.rpos = this.wpos;
		new lod.world(10);
		this.compas = new dolly([...this.wpos] as vec2);
		lod.add(this.compas);

		stats = document.createElement('div');
		stats.setAttribute('id', 'stats');
		mall.whole.append(stats);
	}
	set_camera() {
		const smooth = false;
		if (smooth)
			this.rpos = pts2.floor(this.rpos);
		renderer.camera.position.x = this.rpos[0];
		renderer.camera.position.z = this.rpos[1];
		renderer.camera.zoom = this.zoom;
		renderer.camera.updateMatrix();
		renderer.camera.updateProjectionMatrix();
	}
	tick() {
		lod.ggrid.ticks();

		this.wheelbarrow();
		this.mouse_pan();
		this.set_camera();
		this.print();

		this.wpos = [...this.rpos]
		lod.gworld.update(this.wpos);

		//const zoom = this.zoom;
		//renderer.camera.scale.set(zoom, zoom, zoom);
		//renderer.camera.updateProjectionMatrix();
	}
	begin: vec2 = [0, 0]
	before: vec2 = [0, 0]
	mouse_pan() {
		let continousMode = false;
		const continuousSpeed = -1;
		if (mkb.button(1) == 1) {
			let mouse = mkb.mouse();
			mouse[1] = -mouse[1];
			this.begin = mouse;
			this.before = pts2.clone(this.rpos);
		}
		if (mkb.button(1) >= 1) {
			let mouse = mkb.mouse();
			mouse[1] = -mouse[1];
			let dif = pts2.subtract(this.begin, mouse);
			if (continousMode) {
				dif = pts2.divide(dif, continuousSpeed);
				this.rpos = pts2.add(this.rpos, dif);
			}
			else {
				dif = pts2.divide(dif, -1);
				dif[1] = -dif[1];
				dif = pts2.mult(dif, renderer.ndpi);
				dif = pts2.divide(dif, this.zoom);
				dif = pts2.subtract(dif, this.before);
				this.rpos = pts2.inv(dif);
				//this.rpos[0] = -this.rpos[0];
			}
		}
		else if (mkb.button(1) == -1) {
			this.rpos = pts2.floor(this.rpos);
		}
	}
	print() {
		stats.innerHTML = `
			camera: ${pts2.to_string_fixed(this.rpos)}
		`;
	}
	wheelbarrow() {
		let pan = 10;
		const zoomFactor = 1 / 10;
		if ((mkb.key('f') == 1 || mkb.wheel == -1) && this.zoom > 1)
			this.zoom -= 1;
		if ((mkb.key('r') == 1 || mkb.wheel == 1) && this.zoom < 30)
			this.zoom += 1;
		if (mkb.key('t') == 1) {
			lod.ggrid.shrink();
		}
		if (mkb.key('g') == 1) {
			lod.ggrid.grow();
		}
	}
}


export default view_needs_rename;