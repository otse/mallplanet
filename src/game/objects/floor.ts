import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"

export class floor extends game.superobject {
	override type = 'a floor'
	override bakeable = true
	constructor() {
		super(game.manager.tallies.tiles);
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
		// Whatever would a floor think?
	}
}

export default floor;