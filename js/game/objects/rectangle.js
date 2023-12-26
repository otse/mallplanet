import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";
import * as game from "../re-exports.js";
const prefabs = {
    'kitchen': {
        repeat: [16, 16],
        tex: './tex/kitchen_floor_16x.png'
    },
    'wood': {
        repeat: [32, 32],
        tex: './tex/wood_floor_32x.png'
    }
};
export class rectangle {
    literal;
    static active = 0;
    prefab;
    geometry;
    material;
    mesh;
    constructor(literal) {
        this.literal = literal;
        rectangle.active++;
    }
    destroy() {
        rectangle.active--;
    }
    baked() {
        this.mesh.parent?.remove(this.mesh);
    }
    build() {
        this.literal.bind.wtorpos();
        this.prefab = prefabs[this.literal.bind.hint] || prefabs['kitchen'];
        const units = pts.divide([game.lod.unit, game.lod.unit], 2);
        const left_bottom = pts.add(this.literal.bind.rpos, units);
        this.geometry = new THREE.PlaneGeometry(game.lod.unit, game.lod.unit);
        this.geometry.rotateX(-Math.PI / 2);
        if (this.literal.solid)
            this.geometry.translate(left_bottom[0], 0, left_bottom[1]);
        if (this.prefab.repeat)
            game.tiler.change_uv(this.geometry, this.literal.bind.wpos, this.prefab.repeat);
        this.material = new THREE.MeshPhongMaterial({
            wireframe: false,
            color: this.literal.bind.chunk?.color,
            map: renderer.load_texture(this.literal.tex || this.prefab.tex)
        });
        this.material.map.wrapS = this.material.map.wrapT = THREE.RepeatWrapping;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        if (!this.literal.solid)
            this.mesh.position.set(left_bottom[0], 0, left_bottom[1]);
        this.mesh.frustumCulled = false;
        this.mesh.updateMatrix();
        this.add_to_chunk_group();
    }
    add_to_chunk_group() {
        this.literal.bind.chunk?.group.add(this.mesh);
    }
}
export default rectangle;
