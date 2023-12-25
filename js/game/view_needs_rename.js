/// View manages the lod, camera and panning
import pts from "../util/pts.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import mall from "../mall.js";
import * as game from "./re-exports.js";
let stats;
export class view_needs_rename {
    wpos = [42, 54];
    rpos = [0, 0];
    static make() {
        return new view_needs_rename;
    }
    chart(big) {
    }
    constructor() {
        this.rpos = [...this.wpos];
        new game.lod.world(101); // Shill
        stats = document.createElement('div');
        stats.setAttribute('id', 'stats');
        mall.whole.append(stats);
    }
    tilt = 0;
    set_camera() {
        const snap_to_grid = false;
        if (snap_to_grid)
            this.rpos = pts.floor(this.rpos);
        game.projection.yaw.position.x = this.rpos[0];
        game.projection.yaw.position.z = this.rpos[1];
        game.projection.yaw.updateMatrix();
        renderer.camera.zoom = game.projection.zoom;
        renderer.camera.updateMatrix();
        renderer.camera.updateProjectionMatrix();
    }
    think() {
        game.lod.ggrid.ticks();
        this.wheelbarrow();
        this.mouse_pan();
        this.set_camera();
        this.print();
        this.wpos = [...this.rpos];
        game.lod.gworld.update(this.wpos);
    }
    begin = [0, 0];
    before = [0, 0];
    mouse_pan() {
        let continousMode = false;
        const continuousSpeed = -1;
        if (mkb.button(1) == 1) {
            let mouse = mkb.mouse();
            mouse[1] = -mouse[1];
            this.begin = mouse;
            this.before = pts.clone(this.rpos);
        }
        if (mkb.button(1) >= 1) {
            let mouse = mkb.mouse();
            mouse[1] = -mouse[1];
            let dif = pts.subtract(this.begin, mouse);
            if (continousMode) {
                dif = pts.divide(dif, continuousSpeed);
                this.rpos = pts.add(this.rpos, dif);
            }
            else {
                dif = pts.divide(dif, -1);
                dif[1] = -dif[1];
                dif = pts.mult(dif, renderer.ndpi);
                dif = pts.divide(dif, game.projection.zoom);
                dif = pts.subtract(dif, this.before);
                this.rpos = pts.inv(dif);
            }
        }
        else if (mkb.button(1) == -1) {
            this.rpos = pts.floor(this.rpos);
        }
    }
    print() {
        stats.innerHTML = `
			${pts.to_string_fixed(this.rpos)}: ${game.projection.zoom}<br />
			/ ${game.projection.debug()} (tap f2)<br />
			terrains ${game.manager.tallies.tiles[0]} / ${game.manager.tallies.tiles[1]}<br />
			sectors ${game.lod.ggrid.shown.length} / ${game.lod.chunk.total}
		`;
    }
    wheelbarrow() {
        let pan = 10;
        const zoomFactor = 1 / 10;
        if (mkb.key('f') == 1 || mkb.wheel == -1)
            game.projection.zoom -= 1;
        if (mkb.key('r') == 1 || mkb.wheel == 1)
            game.projection.zoom += 1;
        if (mkb.key('t') == 1) {
            game.lod.ggrid.shrink();
        }
        if (mkb.key('g') == 1) {
            game.lod.ggrid.grow();
        }
    }
}
export default view_needs_rename;
