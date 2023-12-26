import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"

const prefabs = {
	'brick': {
		single: './tex/wall_brick_single_8x.png',
		side: './tex/wall_brick_side_8x.png',
	}
}

export class wall extends game.superobject {
	prefab
	geometry
	material
	mesh
	constructor() {
		super(game.manager.tallies.walls);
		this.type = 'a wall';
	}
	ugly_prefab_code() {
		this.prefab = prefabs[this.hint] || prefabs['brick'];
	}
	override create() {
		this.wtorpos();
		this.ugly_prefab_code();
		let tex = this.prefab.single;
		let map = renderer.load_texture(this.prefab.single);
		if (this.pixel.connections() >= 3) {
			map = renderer.load_texture(this.prefab.single);
		}
		else if (this.pixel.top().is_color(this.pixel.data) &&
			this.pixel.bottom().is_color(this.pixel.data)) {
			map = renderer.load_texture(this.prefab.side, 'vert');
			map.rotation = Math.PI / 2;
		}
		else if (this.pixel.left().is_color(this.pixel.data) &&
			this.pixel.right().is_color(this.pixel.data)) {
			map = renderer.load_texture(this.prefab.side, 'horz');
			map.rotation = 0;
		}

		const left_bottom = pts.add(this.rpos, [game.lod.unit / 2, game.lod.unit / 2]);
		let colorPixel = game.manager.colormap_.pixel(this.wpos).normalize();
		this.geometry = new THREE.PlaneGeometry(game.lod.unit, game.lod.unit);  
		this.material = new THREE.MeshPhongMaterial({
			wireframe: false,
			color: this.chunk?.color || new THREE.Color().fromArray(colorPixel),
			map: map
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.position.set(left_bottom[0], 1, left_bottom[1]);
		this.mesh.rotation.x = -Math.PI / 2;
		this.mesh.updateMatrix();
		//this.mesh.add(new THREE.AxesHelper(1));
		this.chunk?.group.add(this.mesh);
		//renderer.game_objects.add(this.mesh);
	}
	override vanish() {
		this.mesh.parent.remove(this.mesh);
	}
	override think() {
		// whatever would a wall think?
	}
}

export default wall;