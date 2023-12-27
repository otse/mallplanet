import { THREE, BufferGeometryUtils } from "../../mall.js";
import * as game from "../re-exports.js";
//
const minimum_mergables = 3;
export class baked extends game.superobject {
    static total = 0;
    static rectangles_baked = 0;
    rectangles_baked = 0;
    has_enough_candidates;
    look_for = 'a floor';
    hint = 'kitchen';
    geometry;
    material;
    mesh;
    constructor() {
        super([0, 0]);
        this.type = 'a baked';
    }
    create() {
        if (!this.chunk)
            return;
        let filtered = this.chunk.objs.filter(e => e.type == this.look_for &&
            e.hint == this.hint);
        if (filtered.length < minimum_mergables)
            return;
        this.has_enough_candidates = true;
        this.rectangles_baked = filtered.length;
        baked.total++;
        baked.rectangles_baked += this.rectangles_baked;
        const first = filtered[0];
        let geometries = filtered.map((e) => e.rectangle?.geometry);
        this.geometry = BufferGeometryUtils.mergeGeometries(geometries, true);
        this.material = new THREE.MeshPhongMaterial({
            map: first.rectangle?.material.map,
            color: this.chunk?.color,
            //color: 'red'
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.chunk.group.add(this.mesh);
        filtered.forEach((e) => e.rectangle.when_baked(this));
    }
    vanish() {
        if (!this.has_enough_candidates)
            return;
        baked.total--;
        baked.rectangles_baked -= this.rectangles_baked;
        this.chunk?.remove(this);
        this.finalize();
    }
    think() {
        // whatever would a baked think?
    }
}
export default baked;
