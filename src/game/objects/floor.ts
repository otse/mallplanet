import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"

const textures = {
	'kitchen': './tex/kitchen_floor_16x.png',
	'wood': './tex/wood_floor_32x.png'
}

export class floor extends game.superobject implements game.has_single_rectangle {
	rectangle?: game.rectangle
	constructor() {
		super(game.manager.tallies.tiles);
		this.type = 'a floor';
	}
	override create() {
		this.wtorpos();
		this.rectangle = new game.rectangle({ bind: this, solid: true });
		//this.rectangle.tex = textures[this.hint];
		this.rectangle.build();
	}
	override vanish() {
		//renderer.game_objects.remove(this.mesh);
	}
	override think() {
		// whatever would a terrain tile think?
	}
}

export default floor;