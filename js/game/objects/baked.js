import { THREE, BufferGeometryUtils } from "../../mall.js";
import * as game from "../re-exports.js";
const minimum_mergables = 3;
export class baked extends game.superobject {
    static total = 0;
    static rectangles_baked = 0;
    rectangles_baked = 0;
    match_type = 'a floor';
    match_hint = 'kitchen floor';
    geometry;
    material;
    mesh;
    constructor() {
        super(game.manager.tallies.bakeds);
        this.type = 'a baked';
    }
    static filter(chunk, type, hint) {
        return chunk.children.filter((e) => e.type == type &&
            e.hint == hint);
    }
    create() {
        if (!this.chunk)
            return;
        const filtered = baked.filter(this.chunk, this.match_type, this.match_hint);
        this.rectangles_baked = filtered.length;
        baked.rectangles_baked += this.rectangles_baked;
        const first = filtered[0];
        let geometries = filtered.map((e) => e.rectangle?.geometry);
        this.geometry = BufferGeometryUtils.mergeGeometries(geometries, true);
        this.material = new THREE.MeshPhongMaterial().copy(first.rectangle?.material);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.chunk.group.add(this.mesh);
        filtered.forEach((e) => e.rectangle.when_baked(this));
    }
    vanish() {
        this.finalize();
        this.chunk?.remove(this);
        baked.rectangles_baked -= this.rectangles_baked;
    }
    think() {
        // whatever would a baked think?
    }
}
export default baked;
