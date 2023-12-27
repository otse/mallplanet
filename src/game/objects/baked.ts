import { THREE, BufferGeometryUtils } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"

//
const minimum_mergables = 3

export class baked extends game.superobject {
	static total = 0
	static rectangles_baked = 0
	rectangles_baked = 0
	has_enough_candidates
	match_type = 'a floor'
	match_hint = 'kitchen floor'
	geometry
	material
	mesh
	constructor() {
		super([0, 0]);
		this.type = 'a baked';
	}
	override create() {
		if (!this.chunk)
			return;
		let filtered = this.chunk.objs.filter((e: any) =>
			e.type == this.match_type &&
			e.hint == this.match_hint);
		if (filtered.length < minimum_mergables)
			return;
		this.has_enough_candidates = true;
		this.rectangles_baked = filtered.length;
		baked.total++;
		baked.rectangles_baked += this.rectangles_baked;
		const first = filtered[0] as game.superobject;
		let geometries = filtered.map((e: game.superobject) => e.rectangle?.geometry);
		this.geometry = BufferGeometryUtils.mergeGeometries(geometries, true);
		this.material = new THREE.MeshPhongMaterial({
			map: first.rectangle?.material.map,
			color: this.chunk?.color,
			//color: 'red'
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.chunk.group.add(this.mesh);
		filtered.forEach((e: any) => e.rectangle.when_baked(this));
	}
	override vanish() {
		if (!this.has_enough_candidates)
			return;
		baked.total--;
		baked.rectangles_baked -= this.rectangles_baked;
		this.chunk?.remove(this);
		this.finalize();
	}
	override think() {
		// whatever would a baked think?
	}
}

export default baked;