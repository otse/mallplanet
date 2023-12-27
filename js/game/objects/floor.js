import * as game from "../re-exports.js";
export class floor extends game.superobject {
    type = 'a floor';
    bakeable = true;
    constructor() {
        super(game.manager.tallies.tiles);
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
        // whatever would a floor tile think?
    }
}
export default floor;
