import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";
import * as game from "../re-exports.js";
const prefabs = {
    'default': {
        spriteTuple: game.sprites.placeholder_8x,
    },
    'car': {
        spriteTuple: game.sprites.sprJacketCar,
        isAnimated: true,
        transparent: true
    },
    'player': {
        spriteTuple: game.sprites.jacket,
        isAnimated: true,
        transparent: true
    },
    'brick wall -single': {
        spriteTuple: game.sprites.wall_brick_single_8x,
        posBasedUv: true,
    },
    'brick wall -shadow': {
        spriteTuple: game.sprites.wall_brick_shadow_8x,
        offset: [3, 3],
        transparent: true,
        opacity: .3
    },
    'brick wall -box': {
        spriteTuple: game.sprites.wall_brick_under_8x,
        box: true
    },
    'brick wall -vert': {
        spriteTuple: game.sprites.wall_brick_vert_8x,
        posBasedUv: true,
        //turn: true
    },
    'brick wall -horz': {
        spriteTuple: game.sprites.wall_brick_horz_8x,
        posBasedUv: true,
    },
    'kitchen floor': {
        spriteTuple: game.sprites.floor_kitchen,
        posBasedUv: true,
    },
    'wooden floor': {
        spriteTuple: game.sprites.floor_wooden,
        posBasedUv: true,
    }
};
// Todo Refactor when you can and, inevitably, destroy it
export class rectangle {
    static active = 0;
    cell = [0, 0];
    prefab;
    baked;
    split;
    geometry;
    material;
    mesh;
    bind;
    staticGeometry;
    yup = 0;
    size;
    pos;
    left_bottom;
    constructor({ bind, staticGeometry, alignLeftBottom: left_bottom }) {
        this.bind = bind;
        this.staticGeometry = staticGeometry;
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
    update_cell() {
        //console.log('update cell for', this.bind.hint);
        this.material.map.matrix.copy(game.sprites.get_uv_transform(this.cell, this.prefab.spriteTuple));
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
        this.size = this.prefab.spriteTuple[1] || [game.lod.unit, game.lod.unit];
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
        if (this.prefab.posBasedUv && !pts.same(this.prefab.spriteTuple[0], this.prefab.spriteTuple[1]))
            game.tiler.position_based_uv(this.geometry, this.bind.wpos, this.prefab.spriteTuple[0]);
        this.material = new THREE.MeshPhongMaterial({
            wireframe: false,
            color: this.bind.chunk?.color || 'white',
            map: renderer.load_texture(this.prefab.spriteTuple[3]),
            transparent: !!this.prefab.transparent,
            opacity: this.prefab.opacity != undefined ? this.prefab.opacity : 1
        });
        if (this.prefab.isAnimated) {
            this.material.map.matrixAutoUpdate = false;
            // Clamp to edge wrapping prevents fuzzy borders
            this.material.map.wrapS = this.material.map.wrapT = THREE.ClampToEdgeWrapping;
            this.update_cell();
        }
        if (this.prefab.posBasedUv)
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
