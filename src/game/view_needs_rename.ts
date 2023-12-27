/// View manages the LOD

import pts from "../util/pts.js"
import hooks from "../util/hooks.js"

import mkb from "../mkb.js"
import renderer from "../renderer.js"
import mall, { THREE } from "../mall.js"

import * as game from "./re-exports.js"
import glob from "../util/glob.js"

let stats

export class view_needs_rename {
	wpos: vec2 = [35, 35]
	rpos: vec2 = [0, 0]
	mrpos: vec2 = [0, 0]
	mwpos: vec2 = [0, 0]
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
		renderer.camera.rotation.z = Math.PI / 360 * this.rotate;
		renderer.camera.updateMatrix();
		renderer.camera.updateProjectionMatrix();
	}
	think() {
		game.lod.ggrid.think();
		this.handle_input();
		this.set_mouse();
		this.mouse_pan();
		this.wpos = game.lod.unproject(this.rpos);
		this.update_camera();
		this.print();
		//this.update();
	}
	update() {
		game.lod.gworld.update(this.wpos);
	}
	set_mouse() {
		let mouse = mkb.mouse_pos();
		mouse = pts.subtract(mouse, pts.divide(renderer.screen, 2));
		mouse = pts.mult(mouse, renderer.ndpi);
		mouse = pts.divide(mouse, game.projection.zoom);
		//mouse[1] = -mouse[1];
		this.mrpos = pts.add(mouse, this.rpos);
		this.mwpos = game.lod.unproject(this.mrpos);
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
	hide = false
	print() {
		if (mkb.key_state('h') == 1)
			this.hide = !this.hide;
		stats.style.visibility = this.hide ? 'hidden' : 'visible';
		stats.innerHTML = `
			fps ${mall.fps.toFixed(1)}
			<br />delta ${glob.delta.toFixed(3)}
			<br />unit ${game.lod.unit}x
			<br />zoom 1:${game.projection.zoom}
			<br />(render pos, world pos)
			<br />rpos <x_vec2>[${pts.to_string_fixed(this.rpos)}]</x_vec2>
			<br />wpos <x_vec2>[${pts.to_string_fixed(this.wpos)}]</x_vec2>
			<br />mwpos <x_vec2>[${pts.to_string_fixed(this.mwpos)}]</x_vec2>
			<br />${game.projection.debug()}
			<br />
			<br />chunk size ${game.lod.chunk_span}
			<br />lod grid size ${game.lod.ggrid.spread * 2 + 1} * ${game.lod.ggrid.spread * 2 + 1}
			<br />objects ${game.lod.objs[0]} / ${game.lod.objs[1]}
			<br />merged geometries ${game.manager.tallies.bakeds[0]}
			<br />rectangles baked ${game.baked.rectangles_baked} / ${game.rectangle.active}
			<br />chunks ${game.lod.ggrid.shown.length} / ${game.lod.chunks[1]}
			<br />walls ${game.manager.tallies.walls[0]} / ${game.manager.tallies.walls[1]}
			<br />floors ${game.manager.tallies.tiles[0]} / ${game.manager.tallies.tiles[1]}
			<br />shadows ${game.manager.tallies.shadows[0]} / ${game.manager.tallies.shadows[1]}
			<br />(middle mouse drag, scrollwheel zoom)
			<br />(tap f2 to change projection)
			<br />(tap t and g to change lod grid)
			<br />(tap h to hide)
			`;
	}
	rotate = 0
	handle_input() {
		if (mkb.key_state('arrowup'))
			this.rotate += 1;
		if (mkb.key_state('arrowdown'))
			this.rotate -= 1;
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