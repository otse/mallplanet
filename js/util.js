import glob from "./lib/glob.js";
import { THREE } from "./mall.js";
var util;
(function (util) {
    function load_image(file) {
        let texture = new THREE.TextureLoader().load(file + `?v=${glob.salt}`, () => 0);
        texture.generateMipmaps = false;
        //texture.center.set(0, 1);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    util.load_image = load_image;
})(util || (util = {}));
export default util;
