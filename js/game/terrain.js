import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import pts2 from "../util/pts2.js";
import lod, { objs } from "./lod.js";
import game_manager from "./game_manager.js";
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
        water;
        cube;
        geometry;
        material;
        constructor(wpos) {
            super(objs.tiles);
            if (tiles[wpos[1]] == undefined)
                tiles[wpos[1]] = [];
            tiles[wpos[1]][wpos[0]] = this;
            this.wpos = wpos;
        }
        adapt_from_heightmap() {
            // edit vertices to heightmap.png
            if (this.water)
                return;
            let pixel = game_manager.gheightmap.pixel(this.wpos);
            let normalize = pixel.normalize();
            //console.log('height pixel', normalize[0]);
            this.cube.scale.set(1, 1 + (normalize[0] * 10), 1);
            this.cube.updateMatrix();
        }
        create() {
            const size = lod.size;
            let height = size;
            const left_bottom = pts2.add(this.wpos, [0.5, 0.5]);
            let pixel = game_manager.gcolormap.pixel(this.wpos);
            let color = pixel.normalize();
            if (pixel.is_black()) {
                height = size / 2;
                color = [0.3, 0.3, 1, 1];
                this.water = true;
            }
            this.geometry = new THREE.BoxGeometry(size, height, size);
            this.material = new THREE.MeshPhongMaterial({
                wireframe: false,
                color: this.sector?.color || new THREE.Color().fromArray(color)
            });
            this.cube = new THREE.Mesh(this.geometry, this.material);
            this.cube.frustumCulled = false;
            this.cube.position.set(left_bottom[0], 0, left_bottom[1]);
            this.cube.updateMatrix();
            //cube.add(new THREE.AxesHelper(2));
            this.adapt_from_heightmap();
            renderer.game_objects.add(this.cube);
        }
        vanish() {
            renderer.game_objects.remove(this.cube);
        }
        tick() {
            // whatever would a terrain tile think?
        }
    }
    terrain.tile = tile;
})(terrain || (terrain = {}));
export default terrain;
