/// All mall game objects use this extended class
import * as game from "../re-exports.js";
export class superobject extends game.lod.obj {
    hint;
    pixel;
    constructor(counts) {
        super(counts);
    }
}
export default superobject;
