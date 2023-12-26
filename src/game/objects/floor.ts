import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"

const prefabs = {
	'kitchen': {
		repeat: [16, 16],
		tex: './tex/kitchen_floor_16x.png'
	},
	'wood': {
		repeat: [32, 32],
		tex: './tex/wood_floor_32x.png'
	}
}

export class floor extends game.superobject {
	prefab
	geometry
	material
	mesh
	constructor() {
		super(game.manager.tallies.tiles);
	}
	override create() {
		this.wtorpos();

		this.prefab = prefabs[this.hint] || prefabs['kitchen'];

		const left_bottom = pts.add(this.rpos, [game.lod.size / 2, game.lod.size / 2]);

		let pixel = game.manager.colormap_.pixel(this.wpos);
		let color = pixel.normalize();
		this.geometry = new THREE.PlaneGeometry(game.lod.size, game.lod.size);
		this.material = new THREE.MeshPhongMaterial({
			wireframe: false,
			color: this.chunk?.color || new THREE.Color().fromArray(color),
			map: renderer.load_texture(this.prefab.tex)
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.position.set(left_bottom[0], 0, left_bottom[1]);
		this.mesh.rotation.x = -Math.PI / 2;
		this.mesh.updateMatrix();

		game.tiler.change_uv(this.mesh, this.wpos, this.prefab.repeat);
		//this.mesh.add(new THREE.AxesHelper(2));

		renderer.game_objects.add(this.mesh);
	}
	override vanish() {
		renderer.game_objects.remove(this.mesh);
	}
	override think() {
		// whatever would a terrain tile think?
	}
}

export default floor;