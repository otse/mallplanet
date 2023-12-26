import { THREE, BufferGeometryUtils } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"

//

export class baked extends game.superobject {
	//rectangle: game.rectangle
	filter = 'a floor'
	hint = 'kitchen'
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
		let filtered = this.chunk.objs.filter(e => e.type == this.filter);
		filtered = filtered.filter(e => e.hint == this.hint);
		if (filtered.length < 2)
			return;
		const first = filtered[0] as game.has_single_rectangle;
		let geometries = filtered.map((e: any) => e.rectangle?.geometry);
		//new game.rectangle({ bind: this, solid: true });
		//this.rectangle.build();
		this.geometry = BufferGeometryUtils.mergeGeometries(geometries, true);
		this.material = new THREE.MeshPhongMaterial({
			map: first.rectangle?.material.map,
			//color: 'blue'
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.y = -1;
		this.mesh.updateMatrix();
		this.chunk.group.add(this.mesh);
		filtered.forEach((e: any) => e.rectangle?.baked());
		console.log('baked', filtered.length, 'rectangles');
	}
	override vanish() {
		const spliced = this.chunk?.remove(this);
		console.log('spliced baked', spliced);
	}
	override think() {
		// whatever would a baked think?
	}
}

export default baked;