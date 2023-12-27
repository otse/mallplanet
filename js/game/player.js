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
        let rectangle = new game.rectangle({ bind: this, solid: true });
        rectangle?.build();
    }
    vanish() {
        this.rectangle?.destroy();
    }
    think() {
        // 
    }
}
export default player;
