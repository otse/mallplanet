import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";
import * as game from "../re-exports.js";
const prefabs = {
    'brick': {
        size: [8, 8],
        tex: './tex/grass64x.png'
    }
};
export class wall extends game.superobject {
    prefab;
    geometry;
    material;
    mesh;
    constructor() {
        super(game.manager.tallies.walls);
    }
    ugly_prefab_code() {
        this.prefab = prefabs[this.hint] || prefabs['brick'];
    }
    create() {
        this.wtorpos();
        this.ugly_prefab_code();
        const left_bottom = pts.add(this.rpos, [8, 8]);
        let pixel = game.manager.colormap_.pixel(this.wpos);
        let color = pixel.normalize();
        this.geometry = new THREE.PlaneGeometry(this.prefab.size[0], this.prefab.size[0], 1);
        this.material = new THREE.MeshPhongMaterial({
            wireframe: false,
            color: this.chunk?.color || new THREE.Color().fromArray(color),
            map: renderer.load_image('./tex/placeholder8x.png')
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.mesh.position.set(left_bottom[0], 0, left_bottom[1]);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.updateMatrix();
        //this.mesh.add(new THREE.AxesHelper(2));
        renderer.game_objects.add(this.mesh);
    }
    vanish() {
        renderer.game_objects.remove(this.mesh);
    }
    think() {
        // whatever would a terrain tile think?
    }
}
export default wall;
