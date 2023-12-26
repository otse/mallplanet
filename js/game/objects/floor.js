import * as game from "../re-exports.js";
const textures = {
    'kitchen': './tex/kitchen_floor_16x.png',
    'wood': './tex/wood_floor_32x.png'
};
export class floor extends game.superobject {
    rectangle;
    constructor() {
        super(game.manager.tallies.tiles);
        this.type = 'a floor';
    }
    create() {
        this.wtorpos();
        this.rectangle = new game.rectangle({ bind: this, solid: true });
        //this.rectangle.tex = textures[this.hint];
        this.rectangle.build();
    }
    vanish() {
        //renderer.game_objects.remove(this.mesh);
    }
    think() {
        // whatever would a terrain tile think?
    }
}
export default floor;
