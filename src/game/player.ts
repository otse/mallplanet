import { THREE } from "../mall.js";

import * as game from "./re-exports.js"

class player extends game.superobject {
	geometry
	constructor() {
		super([0, 0]);
	}
	priority_update() {

	}
	override create() {
		this.wtorpos();
		let rectangle = new game.rectangle({ bind: this, solid: true });
		rectangle?.build();
	}
	override vanish() {
		this.rectangle?.destroy();
	}
	override think() {
		// 
	}
}

export default player;