/// All mall game objects use this extended class

import { pixel } from "../../util/colormap.js";

import * as game from "../re-exports.js"

let calories: game.lod.calories

export class superobject extends game.lod.obj {
	hint = ''
	bakeable = false // Not used
	pixel?: pixel
	rectangle?: game.rectangle
	constructor(counts: typeof calories) {
		super(counts);
	}
}

export default superobject;