/// internal camera marker
import { THREE } from "../mall.js";
import renderer from "../renderer.js";
export class dolly {
    wpos;
    vector;
    line;
    helper;
    constructor(wpos) {
        this.wpos = wpos;
    }
    make() {
        console.log(' lod create dolly marker ');
        this.vector = new THREE.Vector3(this.wpos[0], 0, this.wpos[1]);
        const material = new THREE.LineBasicMaterial({
            color: 'green'
        });
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0, 50, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.line = new THREE.Line(geometry, material);
        this.line.position.set(this.wpos[0], 0, this.wpos[1]);
        //this.line.rotation.set(Math.PI / 4, 0, Math.PI / 6);
        this.line.updateMatrix();
        this.helper = new THREE.AxesHelper(4);
        this.helper.updateMatrix();
        //this.line.add(renderer.camera);
        //this.line.add(renderer.camera);
        renderer.game_objects.add(this.line);
        renderer.game_objects.add(this.helper);
    }
    think() {
        this.line.updateMatrix();
        this.helper.updateMatrix();
        // whatever would a terrain tile think?
    }
}
export default dolly;
