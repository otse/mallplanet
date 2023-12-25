/// Not used any more
import pts from "../../util/pts.js";
import renderer from "../../renderer.js";
import { THREE } from "../../mall.js";
import * as game from "../re-exports.js";
var terrain;
(function (terrain) {
    let tiles = [];
    function get(pos) {
        if (tiles[pos[1]])
            return tiles[pos[1]][pos[0]];
    }
    terrain.get = get;
    function simple_populate() {
        return;
        for (let y = 0; y < 400; y++) {
            for (let x = 0; x < 400; x++) {
                let til = new tile([200 - x, 200 - y]);
                game.lod.add(til);
            }
        }
    }
    terrain.simple_populate = simple_populate;
    class tile extends game.superobject {
        water;
        geometry;
        material;
        mesh;
        constructor(wpos) {
            super(game.manager.tallies.tiles);
            if (tiles[wpos[1]] == undefined)
                tiles[wpos[1]] = [];
            tiles[wpos[1]][wpos[0]] = this;
            this.wpos = wpos;
        }
        create() {
            const size = game.lod.size;
            let height = size;
            const left_bottom = pts.add(this.wpos, [0.5, 0.5]);
            let pixel = game.manager.colormap_.pixel(this.wpos);
            let color = pixel.normalize();
            if (pixel.is_black()) {
                height = size / 2;
                color = [0.3, 0.3, 1, 1];
                this.water = true;
            }
            this.geometry = new THREE.BoxGeometry(size, height, size);
            this.material = new THREE.MeshPhongMaterial({
                wireframe: false,
                color: this.chunk?.color || new THREE.Color().fromArray(color),
                map: renderer.load_image('./tex/grass64x.png')
            });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.mesh.position.set(left_bottom[0], 0, left_bottom[1]);
            this.mesh.updateMatrix();
            //cube.add(new THREE.AxesHelper(2));
            renderer.game_objects.add(this.mesh);
        }
        vanish() {
            renderer.game_objects.remove(this.mesh);
        }
        tick() {
            // whatever would a terrain tile think?
        }
    }
    terrain.tile = tile;
})(terrain || (terrain = {}));
export default terrain;
