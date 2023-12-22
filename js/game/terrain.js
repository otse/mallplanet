import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import pts2 from "../util/pts2.js";
import lod, { numbers } from "./lod.js";
var terrain;
(function (terrain) {
    let tiles = [];
    function get(pos) {
        if (tiles[pos[1]])
            return tiles[pos[1]][pos[0]];
    }
    terrain.get = get;
    function simple_populate() {
        console.log('simple populate');
        for (let y = 0; y < 400; y++) {
            for (let x = 0; x < 400; x++) {
                let til = new tile([200 - x, 200 - y]);
                lod.add(til);
            }
        }
    }
    terrain.simple_populate = simple_populate;
    class tile extends lod.obj {
        cube;
        geometry;
        material;
        constructor(wpos) {
            super(numbers.tiles);
            if (tiles[wpos[1]] == undefined)
                tiles[wpos[1]] = [];
            tiles[wpos[1]][wpos[0]] = this;
            this.wpos = wpos;
        }
        create() {
            const size = lod.size;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshPhongMaterial({
                wireframe: false,
                color: this.sector?.color
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.frustumCulled = false;
            this.cube = cube;
            this.geometry = geometry;
            this.material = material;
            const rpos = pts2.mult(this.wpos, 1);
            cube.position.set(this.wpos[0], 0, this.wpos[1]);
            cube.updateMatrix();
            //cube.add(new THREE.AxesHelper(2));
            renderer.game_objects.add(cube);
        }
        vanish() {
            // game requests disappear
            renderer.game_objects.remove(this.cube);
        }
        tick() {
            // whatever would a terrain tile think?
        }
    }
    terrain.tile = tile;
})(terrain || (terrain = {}));
export default terrain;
