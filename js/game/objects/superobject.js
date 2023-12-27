/// All mall game objects use this extended class
import aabb from "../../util/aabb.js";
import pts from "../../util/pts.js";
import * as game from "../re-exports.js";
export class superobject extends game.lod.obj {
    isSuperobject = true;
    solid = false;
    hint = '';
    variant = '';
    bakeable = false; // Not used
    pixel;
    rotatey = 0;
    rectangle;
    constructor(counts) {
        super(counts);
    }
    try_move_as_square(to) {
        if (!this.bound)
            return;
        let both = aabb.dupe(this.bound);
        both.translate(to);
        let dupex = aabb.dupe(this.bound);
        dupex.translate([to[0], 0]);
        let dupey = aabb.dupe(this.bound);
        dupey.translate([0, to[1]]);
        let collision = false;
        for (let obj of game.lod.ggrid.visibles) {
            if (this == obj)
                continue;
            const so = obj;
            if (so.solid) {
                const test = both.test(obj.bound);
                const testx = dupex.test(obj.bound);
                const testy = dupey.test(obj.bound);
                if (test > 0 && testx == 0 && testy == 0) {
                    // we are hugging a corner,
                    // prevent splitting into it
                    //to = [0, 0];
                }
                if (testx > 0) {
                    collision = true;
                    to[0] = 0;
                }
                if (testy > 0) {
                    collision = true;
                    to[1] = 0;
                }
            }
        }
        const friction = 0.66;
        if (collision)
            to = pts.mult(to, friction);
        this.wpos = pts.add(this.wpos, to);
        this.rebound();
    }
}
export default superobject;
