import mkb from "../mkb.js";
import glob from "../util/glob.js";
import pts from "../util/pts.js";
import * as game from "./re-exports.js";
class player extends game.superobject {
    geometry;
    constructor() {
        super([0, 0]);
    }
    move() {
        let speed = 1 * game.lod.unit * glob.delta;
        let x = 0;
        let y = 0;
        if (mkb.key_state('w')) {
            y -= 1;
        }
        if (mkb.key_state('s')) {
            y += 1;
        }
        if (mkb.key_state('a')) {
            x -= 1;
        }
        if (mkb.key_state('d')) {
            x += 1;
        }
        if (mkb.key_state('x')) {
            speed *= 5;
        }
        if (x || y) {
            let angle = -pts.angle([x, y], [0, 0]);
            angle += game.projection.yaw.rotation.y;
            // this.rotatey = angle;
            x = speed * Math.sin(angle);
            y = speed * Math.cos(angle);
        }
        let pos = pts.subtract(this.wpos, game.manager.view.mwpos);
        let angle = -pts.angle([0, 0], [pos[0], pos[1]]);
        this.rotatey = angle;
        return [x, y];
    }
    priority_update() {
        let move_to = this.move();
        this.rebound();
        this.try_move_as_square(move_to);
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
