import timer from "../../util/timer.js";
import * as game from "../re-exports.js";
const frameTime = 0.1;
class car extends game.superobject {
    geometry;
    weapon_group;
    constructor() {
        super();
    }
    create() {
        this.wtorpos();
        this.hint = 'car';
        this.rotatey = Math.PI / 2;
        let rectangle = new game.rectangle({
            bind: this,
            staticGeometry: false,
            alignLeftBottom: false,
        });
        rectangle.yup = 1;
        rectangle.build();
        this.timer = new timer(1);
    }
    vanish() {
        this.rectangle?.destroy();
        this.rectangle = undefined;
    }
    timer;
    cell = 0;
    think() {
        if (!this.rectangle)
            return;
        if (this.timer.done()) {
            this.timer = new timer(frameTime, this.timer);
            this.timer.elapsed;
            this.cell++;
            if (this.cell > 12)
                this.cell = 0;
            this.rectangle.cell = [this.cell, 0];
            this.rectangle.update_cell();
        }
    }
}
export default car;
