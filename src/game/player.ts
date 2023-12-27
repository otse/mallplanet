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
		this.hint = 'player';
		let rectangle = new game.rectangle({
			bind: this,
			left_bottom: false,
			solid: false
		});
		rectangle.yup = 1;
		//rectangle.tex = './tex/player_32x.png';
		rectangle.build();
	}
	override vanish() {
		this.rectangle?.destroy();
	}
	override think() {
		// 
	}
}

export default player;