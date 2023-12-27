/// All mall game objects use this extended class
import * as game from "../re-exports.js";
let calories;
export class superobject extends game.lod.obj {
    bakeable = false; // Not used
    pixel;
    rectangle;
    constructor(counts) {
        super(counts);
    }
}
export default superobject;
