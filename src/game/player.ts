import { THREE } from "../mall.js";

import * as game from "./re-exports.js"

class player extends game.lod.obj {
	geometry
	constructor() {
		super();
		this.geometry = new THREE.PlaneGeometry(game.lod.unit, game.lod.unit);
		this.geometry.rotateX(-Math.PI / 2);
	}
	update() {

	}
	override think() {
		// We update manually before the others
	}
}

export default player;