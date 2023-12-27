import * as game from "./re-exports.js";
class player extends game.superobject {
    geometry;
    constructor() {
        super([0, 0]);
    }
    priority_update() {
    }
    create() {
        this.wtorpos();
        this.hint = 'player';
        let rectangle = new game.rectangle({
            bind: this,
            left_bottom: false,
            solid: false
        });
        rectangle.yup = 1;
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
