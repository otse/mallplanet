import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";
import * as game from "../re-exports.js";
var floors;
(function (floors) {
    let tiles = [];
    function get(pos) {
        if (tiles[pos[1]])
            return tiles[pos[1]][pos[0]];
    }
    floors.get = get;
    class tile extends game.superobject {
        geometry;
        material;
        mesh;
        constructor() {
            super(game.manager.tallies.tiles);
        }
        create() {
            const left_bottom = pts.add(this.wpos, [0.5, 0.5]);
            let pixel = game.manager.colormap_.pixel(this.wpos);
            let color = pixel.normalize();
            this.geometry = new THREE.PlaneGeometry(1, 1, 1);
            this.material = new THREE.MeshPhongMaterial({
                wireframe: false,
                color: this.chunk?.color || new THREE.Color().fromArray(color),
                map: renderer.load_image('./tex/grass64x.png')
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
    floors.tile = tile;
})(floors || (floors = {}));
export default floors;
