import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";
import * as game from "../re-exports.js";
const prefabs = {
    'default': {
        tex: './tex/placeholder_8x.png'
    },
    'player': {
        tex: './tex/player_32x.png',
        size: [32, 32],
        transparent: true
    },
    'brick wall -single': {
        tex: './tex/wall_brick_single_8x.png'
    },
    'brick wall -shadow': {
        tex: './tex/wall_brick_single_8x_shadow.png',
        size: [8, 8],
        offset: [3, 3],
        transparent: true,
        opacity: .3
    },
    'brick wall -box': {
        tex: './tex/wall_brick_under_8x.png',
        size: [8, 8],
        box: true
    },
    'brick wall -vert': {
        tex: './tex/wall_brick_side_8x.png',
        turn: true
    },
    'brick wall -horz': {
        tex: './tex/wall_brick_side_8x.png'
    },
    'kitchen floor': {
        repeat: [16, 16],
        tex: './tex/kitchen_floor_16x.png'
    },
    'wooden floor': {
        repeat: [32, 32],
        tex: './tex/wood_floor_32x.png'
    }
};
// Todo Refactor when you can and, inevitably, destroy it
export class rectangle {
    static active = 0;
    prefab;
    baked;
    split;
    geometry;
    material;
    mesh;
    bind;
    staticGeometry;
    tex;
    yup = 0;
    size;
    pos;
    left_bottom;
    constructor({ bind, staticGeometry, alignLeftBottom: left_bottom, tex }) {
        this.bind = bind;
        this.staticGeometry = staticGeometry;
        this.tex = tex;
        bind.rectangle = this;
        rectangle.active++;
    }
    destroy() {
        rectangle.active--;
        this.mesh.parent?.remove(this.mesh);
    }
    when_baked(baked) {
        this.baked = baked;
        this.mesh.parent?.remove(this.mesh);
    }
    repos() {
        let pos = pts.clone(this.bind.rpos);
        if (this.left_bottom)
            pos = pts.add(pos, pts.divide(this.size, 2));
        if (this.prefab.offset)
            pos = pts.add(pos, this.prefab.offset);
        this.pos = pos;
    }
    build() {
        this.bind.wtorpos();
        this.prefab = prefabs[this.bind.hint] || prefabs['default'];
        this.size = this.prefab.size || [game.lod.unit, game.lod.unit];
        this.repos();
        if (this.prefab.box) {
            const height = 3;
            this.geometry = new THREE.BoxGeometry(this.size[0], height, this.size[1]);
            this.geometry.translate(0, height / 2, 0);
            game.tiler.remove_top_face(this.geometry);
        }
        else {
            this.geometry = new THREE.PlaneGeometry(this.size[0], this.size[1]);
            this.geometry.rotateX(-Math.PI / 2);
            // Turning geometry may cause incorrect repeating
        }
        if (this.prefab.turn)
            this.geometry.rotateY(-Math.PI / 2);
        if (this.staticGeometry)
            this.geometry.translate(this.pos[0], this.yup, this.pos[1]);
        if (this.prefab.repeat)
            game.tiler.change_uv(this.geometry, this.bind.wpos, this.prefab.repeat);
        this.material = new THREE.MeshPhongMaterial({
            wireframe: false,
            color: this.bind.chunk?.color || 'white',
            map: renderer.load_texture(this.tex || this.prefab.tex),
            transparent: !!this.prefab.transparent,
            opacity: this.prefab.opacity != undefined ? this.prefab.opacity : 1
        });
        this.material.map.wrapS = this.material.map.wrapT = THREE.RepeatWrapping;
        if (this.prefab.box) {
            this.material = new THREE.MeshPhongMaterial({ color: '#333' });
        }
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.update();
        this.mesh.frustumCulled = false;
        this.mesh.updateMatrix();
        this.add_to_chunk_group();
    }
    update() {
        if (!this.staticGeometry) {
            this.repos();
            this.mesh.position.set(this.pos[0], this.yup, this.pos[1]);
        }
        this.mesh.rotation.y = this.bind.rotatey;
        this.mesh.updateMatrix();
    }
    add_to_chunk_group() {
        this.bind.chunk?.group.add(this.mesh);
    }
}
export default rectangle;
