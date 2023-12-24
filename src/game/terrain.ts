import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import pts2 from "../util/pts2.js";
import lod, { objs } from "./lod.js";
import game_manager from "./game_manager.js";

namespace terrain {
	let tiles: tile[][] = [];

	export function get(pos: vec2) {
		if (tiles[pos[1]])
			return tiles[pos[1]][pos[0]];
	}

	export function simple_populate() {
		for (let y = 0; y < 400; y++) {
			for (let x = 0; x < 400; x++) {
				let til = new tile([200 - x, 200 - y]);
				lod.add(til);
			}
		}
	}

	export class tile extends lod.obj {
		water
		geometry
		material
		mesh
		constructor(wpos: vec2) {
			super(objs.tiles);
			if (tiles[wpos[1]] == undefined)
				tiles[wpos[1]] = [];
			tiles[wpos[1]][wpos[0]] = this;
			this.wpos = wpos;
		}
		adapt_from_heightmap() {
			// edit vertices to heightmap.png
			if (this.water) {
				this.mesh.scale.set(1, 0.0, 1);
				this.mesh.updateMatrix();
				return;
			}

			const attribute = this.mesh.geometry.getAttribute('position');
			attribute.needsUpdate = true;
			for (let i = 0; i < attribute.array.length; i += 3) {
				let a = attribute.array[i + 0];
				let b = attribute.array[i + 1];
				let c = attribute.array[i + 2];
				const ar: vec2[] = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
				for (let j = 0; j < 4; j++) {
					if (a == ar[j][0] && b == 0.5 && c == ar[j][1]) {
						let height = game_manager.gheightmap.pixel(pts2.add(this.wpos, pts2.add(ar[j], [.5, .5])));
						let normal = height.normalize()[0];
						normal *= 60;
						normal = Math.floor(normal);
						normal /= 60;
						normal *= 5;
						attribute.array[i + 1] = normal;
					}
				}
				/*const ar = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
				for (let i = 0; i < 4; i++) {
					if (a == ar[i][0] && b == 0.5 && c == ar[i][1]) {
						let height = game_manager.gheightmap.pixel(pts2.add(this.wpos, pts2.add(ar[i] as vec2, [.5, .5])));
						let normal = height.normalize()[0];
						normal *= 60;
						normal = Math.floor(normal);
						normal /= 60;
						attribute.array[i + 1] = normal;
					}
				}*/
			}
			console.log('positions', attribute);

			this.geometry.computeVertexNormals();
		}
		override create() {
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
				color: this.sector?.color || new THREE.Color().fromArray(color),
				map: renderer.load_image('./tex/grass64x.png')
			});
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh.frustumCulled = false;
			this.mesh.position.set(left_bottom[0], 0, left_bottom[1]);
			this.mesh.updateMatrix();
			//cube.add(new THREE.AxesHelper(2));

			this.adapt_from_heightmap();

			renderer.game_objects.add(this.mesh);
		}
		override vanish() {
			renderer.game_objects.remove(this.mesh);
		}
		override tick() {
			// whatever would a terrain tile think?
		}
	}
}

export default terrain;