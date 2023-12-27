import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";
import * as game from "../re-exports.js";
const prefabs = {
    'default': {
        tex: './tex/placeholder_8x.png'
    },
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
    geometry;
    material;
    mesh;
    baked;
    constructor(literal) {
        this.literal = literal;
        literal.bind.rectangle = this;
        rectangle.active++;
    }
    destroy() {
        rectangle.active--;
    }
    when_baked(baked) {
        this.baked = baked;
        this.mesh.parent?.remove(this.mesh);
    }
    build() {
        this.literal.bind.wtorpos();
        const prefab = prefabs[this.literal.bind.hint] || prefabs['default'];
        let size = prefab.size || [game.lod.unit, game.lod.unit];
        const left_bottom = pts.add(this.literal.bind.rpos, pts.divide(size, 2));
        this.geometry = new THREE.PlaneGeometry(size[0], size[1]);
        this.geometry.rotateX(-Math.PI / 2);
        if (this.literal.solid)
            this.geometry.translate(left_bottom[0], 0, left_bottom[1]);
        if (prefab.repeat)
            game.tiler.change_uv(this.geometry, this.literal.bind.wpos, prefab.repeat);
        this.material = new THREE.MeshPhongMaterial({
            wireframe: false,
            color: this.literal.bind.chunk?.color,
            map: renderer.load_texture(this.literal.tex || prefab.tex)
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
