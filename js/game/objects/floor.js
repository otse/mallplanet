import * as game from "../re-exports.js";
export class floor extends game.superobject {
    type = 'a floor';
    bakeable = true;
    solid = false;
    constructor() {
        super(game.manager.tallies.tiles);
    }
    create() {
        this.wtorpos();
        let rectangle = new game.rectangle({
            bind: this,
            alignLeftBottom: true,
            staticGeometry: true
        });
        rectangle.build();
    }
    vanish() {
        this.rectangle?.destroy();
    }
    think() {
        // Whatever would a floor think?
    }
}
export default floor;
