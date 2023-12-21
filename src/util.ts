import glob from "./lib/glob.js";

import { THREE } from "./mall.js";

namespace util {

    export function load_image(file: string) {
        let texture = new THREE.TextureLoader().load(file + `?v=${glob.salt}`, () => 0);
		texture.generateMipmaps = false;
		//texture.center.set(0, 1);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

}

export default util;