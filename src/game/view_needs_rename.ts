/// View manages the LOD

import pts from "../util/pts.js"
import hooks from "../util/hooks.js"

import mkb from "../mkb.js"
import renderer from "../renderer.js"
import mall, { THREE } from "../mall.js"

import * as game from "./re-exports.js"

let stats

export class view_needs_rename {
	wpos: vec2 = [50, 45]
	rpos: vec2 = [0, 0]

	static make() {
		return new view_needs_rename;
	}
	chart(big: vec2) {
	}
	constructor() {
		this.rpos = game.lod.project(this.wpos);
		new game.lod.world(0);
		stats = document.createElement('div');
		stats.setAttribute('id', 'stats');
		mall.whole.append(stats);
	}
	update_camera() {
		const snap_to_grid = false;
		if (snap_to_grid)
			this.rpos = pts.floor(this.rpos);
		game.projection.yaw.position.x = this.rpos[0];
		game.projection.yaw.position.z = this.rpos[1];
		game.projection.yaw.updateMatrix();
		renderer.camera.zoom = game.projection.zoom;
		renderer.camera.updateMatrix();
		renderer.camera.updateProjectionMatrix();
	}
	think() {
		game.lod.ggrid.think();
		this.handle_input();
		this.mouse_pan();
		this.wpos = game.lod.unproject(this.rpos);
		this.update_camera();
		this.print();
		//this.wpos = [...this.rpos]
		game.lod.gworld.update(this.wpos);
	}
	begin: vec2 = [0, 0]
	before: vec2 = [0, 0]
	mouse_pan() {
		let continousMode = false;
		const continuousSpeed = -100;
		if (mkb.mouse_button(1) == 1) {
			let mouse = mkb.mouse_pos();
			mouse[1] = -mouse[1];
			this.begin = mouse;
			this.before = pts.clone(this.rpos);
		}
		if (mkb.mouse_button(1) >= 1) {
			let current = mkb.mouse_pos();
			current[1] = -current[1];
			let dif = pts.subtract(this.begin, current);
			dif[1] = -dif[1];
			if (continousMode) {
				dif = pts.divide(dif, continuousSpeed);
				this.rpos = pts.add(this.rpos, dif);
				this.rpos = pts.inv(dif);
			}
			else {
				dif = pts.divide(dif, -1);
				//dif[1] = -dif[1];
				dif = pts.mult(dif, renderer.ndpi);
				dif = pts.divide(dif, game.projection.zoom);
				dif = pts.subtract(dif, this.before);
				this.rpos = pts.inv(dif);
			}
		}
		else if (mkb.mouse_button(1) == -1) {
			this.rpos = pts.floor(this.rpos);
		}
	}
	print() {
		stats.innerHTML = `
			${pts.to_string_fixed(this.rpos)}: ${game.projection.zoom}<br />
			/ ${game.projection.debug()} (tap f2)<br />
			lod ${game.lod.ggrid.spread} / ${game.lod.ggrid.outside}: ${game.lod.size}x <br />
			walls ${game.manager.tallies.walls[0]} / ${game.manager.tallies.walls[1]}<br />
			floors ${game.manager.tallies.tiles[0]} / ${game.manager.tallies.tiles[1]}<br />
			chunks ${game.lod.ggrid.shown.length} / ${game.lod.chunk.total}
		`;
	}
	handle_input() {
		if (mkb.key_state('f') == 1 || mkb.wheel == -1)
			game.projection.zoom -= 1;
		if (mkb.key_state('r') == 1 || mkb.wheel == 1)
			game.projection.zoom += 1;
		if (mkb.key_state('t') == 1)
			game.lod.ggrid.shrink();
		if (mkb.key_state('g') == 1)
			game.lod.ggrid.grow();
			game.projection.zoom = mall.clamp(game.projection.zoom, 1, 10); 
	}
}


export default view_needs_rename;