/// All mall game objects use this extended class

import { pixel } from "../../util/colormap.js";

import * as game from "../re-exports.js"

let calories: game.lod.calories

export interface has_single_rectangle {
	rectangle?: game.rectangle
}

export class superobject extends game.lod.obj {
	pixel: pixel
	constructor(counts: typeof calories) {
		super(counts);
	}
}