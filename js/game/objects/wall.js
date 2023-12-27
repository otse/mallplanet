import * as game from "../re-exports.js";
export class wall extends game.superobject {
    type = 'a wall';
    solid = true;
    geometry;
    material;
    mesh;
    doOnce = true;
    shadow;
    constructor() {
        super(game.manager.tallies.walls);
    }
    create() {
        if (!this.pixel)
            return;
        if (this.doOnce) {
            if (this.pixel.connections() >= 3) {
                this.hint += ' -single';
            }
            else if (this.pixel.top().is_color(this.pixel.data) &&
                this.pixel.bottom().is_color(this.pixel.data)) {
                this.hint += ' -vert';
            }
            else if (this.pixel.left().is_color(this.pixel.data) &&
                this.pixel.right().is_color(this.pixel.data)) {
                this.hint += ' -horz';
            }
            else {
                this.hint += ' -single';
            }
            this.shadow = new wall_shadow(this);
            game.lod.add(this.shadow);
            this.doOnce = false;
        }
        this.wtorpos();
        this.rebound();
        const rectangle = new game.rectangle({
            bind: this,
            alignLeftBottom: true,
            staticGeometry: true
        });
        rectangle.yup = 3;
        //rectangle.is_box = true;
        rectangle.build();
    }
    vanish() {
        this.rectangle?.destroy();
        this.rectangle = undefined;
    }
    think() {
        // Whatever would a wall think?
    }
}
export class wall_shadow extends game.superobject {
    base;
    constructor(base) {
        super(game.manager.tallies.shadows);
        this.base = base;
        this.hint = base.hint.split('-')[0] + '-shadow';
        this.wpos = base.wpos;
    }
    create() {
        const rectangle = new game.rectangle({
            bind: this,
            alignLeftBottom: true,
            staticGeometry: true
        });
        rectangle.yup = 0.1;
        rectangle.build();
    }
    vanish() {
        this.rectangle?.destroy();
        this.rectangle = undefined;
    }
}
export default wall;
