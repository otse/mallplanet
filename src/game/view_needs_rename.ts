/// the view manages what it sees

import pts2 from "../util/pts2.js"
import hooks from "../util/hooks.js"

import mkb from "../mkb.js"
import mall, { THREE } from "../mall.js"
import lod, { objs } from "./lod.js"
import renderer from "../renderer.js"
import projection from "./projection.js"

let stats

export class view_needs_rename {
	wpos: vec2 = [42, 54]
	rpos: vec2 = [0, 0]

	static make() {
		return new view_needs_rename;
	}
	chart(big: vec2) {
	}
	constructor() {
		this.rpos = [...this.wpos];
		new lod.world(101);
		stats = document.createElement('div');
		stats.setAttribute('id', 'stats');
		mall.whole.append(stats);
	}
	tilt = 0
	set_camera() {
		const snap_to_grid = false;
		if (snap_to_grid)
			this.rpos = pts2.floor(this.rpos);
		projection.yaw.position.x = this.rpos[0];
		projection.yaw.position.z = this.rpos[1];
		projection.yaw.updateMatrix();
		renderer.camera.zoom = projection.zoom;
		renderer.camera.updateMatrix();
		renderer.camera.updateProjectionMatrix();
	}
	think() {
		lod.ggrid.ticks();

		this.wheelbarrow();
		this.mouse_pan();
		this.set_camera();
		this.print();

		this.wpos = [...this.rpos]
		lod.gworld.update(this.wpos);
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
				dif = pts2.divide(dif, projection.zoom);
				dif = pts2.subtract(dif, this.before);
				this.rpos = pts2.inv(dif);
			}
		}
		else if (mkb.button(1) == -1) {
			this.rpos = pts2.floor(this.rpos);
		}
	}
	print() {
		stats.innerHTML = `
			${pts2.to_string_fixed(this.rpos)}: ${projection.zoom}<br /> / ${projection.string()} (tap f2)<br />
			terrains ${objs.tiles[0]} / ${objs.tiles[1]}<br />
			sectors ${lod.ggrid.shown.length} / ${lod.sector.total}
		`;
	}
	wheelbarrow() {
		let pan = 10;
		const zoomFactor = 1 / 10;
		if (mkb.key('f') == 1 || mkb.wheel == -1)
			projection.zoom -= 1;
		if (mkb.key('r') == 1 || mkb.wheel == 1)
			projection.zoom += 1;
		if (mkb.key('t') == 1) {
			lod.ggrid.shrink();
		}
		if (mkb.key('g') == 1) {
			lod.ggrid.grow();
		}
	}
}


export default view_needs_rename;