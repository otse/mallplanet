import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import pts2 from "../util/pts2.js";
import lod, { numbers } from "./lod.js";

namespace terrain {
	let tiles: tile[][] = [];

	export function get(pos: vec2): tile | undefined {
		if (tiles[pos[1]])
			return tiles[pos[1]][pos[0]];
	}

	export function simple_populate() {
		console.log('simple populate');

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				let til = new tile([x, y]);
				lod.add(til);
			}
		}
	}

	export class tile extends lod.obj {
		cube
		constructor(wpos: vec2) {
			super(numbers.tiles);

			if (tiles[wpos[1]] == undefined)
				tiles[wpos[1]] = [];
			tiles[wpos[1]][wpos[0]] = this;

			this.wpos = wpos;

		}
		override create() {
			const size = 1 * lod.size;

			const geometry = new THREE.BoxGeometry(size, size, size);
			const material = new THREE.MeshPhongMaterial({ wireframe: true, color: 'red' });
			const cube = new THREE.Mesh(geometry, material);
			this.cube = cube;

			const rpos = pts2.mult(this.wpos, 1);

			cube.position.set(this.wpos[0], 0, this.wpos[1]);
			cube.updateMatrix();
			cube.add(new THREE.AxesHelper(2));

			renderer.game_objects.add(cube);
		}
		override vanish() {
			// game requests disappear

			renderer.game_objects.remove(this.cube);
		}
		override tick() {

		}

	}
}

export default terrain;