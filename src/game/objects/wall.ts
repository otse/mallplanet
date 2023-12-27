import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"


export class wall extends game.superobject {
	override type = 'a wall'
	geometry
	material
	mesh
	constructor() {
		super(game.manager.tallies.walls);
	}
	override create() {
		if (!this.pixel)
			return;
		this.wtorpos();
		if (this.pixel.connections() >= 3) {

		}
		else if (this.pixel.top().is_color(this.pixel.data) &&
			this.pixel.bottom().is_color(this.pixel.data)) {
			this.hint += ' vert';
		}
		else if (this.pixel.left().is_color(this.pixel.data) &&
			this.pixel.right().is_color(this.pixel.data)) {
			this.hint += ' horz';
		}

		this.wtorpos();
		let rectangle = new game.rectangle({ bind: this, solid: true });
		rectangle?.build();
		return;

		let map = 0;
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
		this.mesh.position.set(left_bottom[0], 0, left_bottom[1]);
		this.mesh.rotation.x = -Math.PI / 2;
		this.mesh.updateMatrix();
		//this.mesh.add(new THREE.AxesHelper(1));
		this.chunk?.group.add(this.mesh);
		//renderer.game_objects.add(this.mesh);
	}
	override vanish() {
		this.rectangle?.destroy();
	}
	override think() {
		// Whatever would a wall think?
	}
}

export default wall;