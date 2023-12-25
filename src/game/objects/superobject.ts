/// All mall game objects use this extended class

import { pixel } from "../../util/colormap.js";

import * as game from "../re-exports.js"

export class superobject extends game.lod.obj {
    pixel: pixel
    constructor(counts: [number, number]) {
        super(counts);
    }
}

export default superobject;