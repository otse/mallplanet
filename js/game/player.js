import mkb from "../mkb.js";
import glob from "../util/glob.js";
import * as game from "./re-exports.js";
class player extends game.superobject {
    geometry;
    constructor() {
        super([0, 0]);
    }
    priority_update() {
        const speed = 8;
        const w = mkb.key_state('w');
        const a = mkb.key_state('a');
        const s = mkb.key_state('s');
        const d = mkb.key_state('d');
        let moveTo = [0, 0];
        if (w) {
            moveTo[1] -= speed * glob.delta;
            this.rotatey = Math.PI;
        }
        if (a) {
            moveTo[0] -= speed * glob.delta;
            this.rotatey = -Math.PI / 2;
        }
        if (s) {
            moveTo[1] += speed * glob.delta;
            this.rotatey = 0;
        }
        if (d) {
            moveTo[0] += speed * glob.delta;
            this.rotatey = Math.PI / 2;
        }
        this.rebound();
        this.try_move_as_square(moveTo);
        this.wtorpos();
        this.rectangle?.update();
        game.lod.chunk.swap(this);
    }
    create() {
        this.wtorpos();
        this.hint = 'player';
        let rectangle = new game.rectangle({
            bind: this,
            staticGeometry: false,
            alignLeftBottom: false,
        });
        rectangle.yup = 3;
        //rectangle.tex = './tex/player_32x.png';
        rectangle.build();
    }
    vanish() {
        this.rectangle?.destroy();
    }
    think() {
        // 
    }
}
export default player;
