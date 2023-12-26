import { THREE, BufferGeometryUtils } from "../../mall.js";
import * as game from "../re-exports.js";
//
export class baked extends game.superobject {
    //rectangle: game.rectangle
    filter = 'a floor';
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
        let filtered = this.chunk.objs.filter(e => e.type == this.filter);
        filtered = filtered.filter(e => e.hint == this.hint);
        if (filtered.length < 2)
            return;
        const first = filtered[0];
        let geometries = filtered.map((e) => e.rectangle?.geometry);
        //new game.rectangle({ bind: this, solid: true });
        //this.rectangle.build();
        this.geometry = BufferGeometryUtils.mergeGeometries(geometries, true);
        this.material = new THREE.MeshPhongMaterial({
            map: first.rectangle?.material.map,
            //color: 'blue'
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = -1;
        this.mesh.updateMatrix();
        this.chunk.group.add(this.mesh);
        filtered.forEach((e) => e.rectangle?.baked());
        console.log('baked', filtered.length, 'rectangles');
    }
    vanish() {
        const spliced = this.chunk?.remove(this);
        console.log('spliced baked', spliced);
    }
    think() {
        // whatever would a baked think?
    }
}
export default baked;
