import { THREE, BufferGeometryUtils } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"

const minimum_mergables = 3

export class baked extends game.superobject {
	static total = 0
	static rectangles_baked = 0
	array = []
	rectangles_baked = 0
	match_type = 'a floor'
	match_hint = 'kitchen floor'
	geometry
	material
	mesh
	constructor() {
		super(game.manager.tallies.bakeds);
		this.type = 'a baked';
	}
	static filter(chunk, type, hint) {
		return chunk.objs.filter((e: any) =>
			e.type == type &&
			e.hint == hint);
	}
	override create() {
		if (!this.chunk)
			return;
		this.rectangles_baked = this.array.length;
		baked.rectangles_baked += this.rectangles_baked;
		const first = this.array[0] as game.superobject;
		let geometries = this.array.map((e: game.superobject) => e.rectangle?.geometry);
		this.geometry = BufferGeometryUtils.mergeGeometries(geometries, true);
		this.material = new THREE.MeshPhongMaterial({
			map: first.rectangle?.material.map,
			color: this.chunk?.color || 'white',
			//color: 'red'
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.chunk.group.add(this.mesh);
		this.array.forEach((e: any) => e.rectangle.when_baked(this));
	}
	override vanish() {
		this.finalize();
		this.chunk?.remove(this);
		baked.rectangles_baked -= this.rectangles_baked;
	}
	override think() {
		// whatever would a baked think?
	}
}

export default baked;