import hooks from "../util/hooks.js";
import pts from "../util/pts.js";
import aabb from "../util/aabb.js";
// Internal class
class toggle {
    _active = false;
    get active() { return this._active; }
    on() {
        if (this._active)
            return true;
        this._active = true;
        return false;
    }
    off() {
        if (!this._active)
            return true;
        this._active = false;
        return false;
    }
}
var lod;
(function (lod) {
    lod.size = 1;
    const chunk_coloration = false;
    const fog_of_war = false;
    const grid_crawl_makes_chunks = true;
    lod.chunk_span = 4;
    lod.chunks = [0, 0];
    function register() {
    }
    lod.register = register;
    function project(unit) {
        return pts.mult(pts.project(unit), lod.size);
    }
    lod.project = project;
    function unproject(pixel) {
        return pts.divide(pts.unproject(pixel), 1.1);
    }
    lod.unproject = unproject;
    function add(obj) {
        let chunk = lod.gworld.at(lod.world.big(obj.wpos));
        chunk.add(obj);
    }
    lod.add = add;
    function remove(obj) {
        obj.chunk?.remove(obj);
    }
    lod.remove = remove;
    class world {
        arrays = [];
        constructor(dummy) {
            lod.gworld = this;
            new grid(4, 4);
        }
        update(wpos) {
            lod.ggrid.big = lod.world.big(wpos);
            lod.ggrid.ons();
            lod.ggrid.offs();
        }
        lookup(big) {
            if (this.arrays[big[1]] == undefined)
                this.arrays[big[1]] = [];
            return this.arrays[big[1]][big[0]];
        }
        at(big) {
            return this.lookup(big) || this.make(big);
        }
        make(big) {
            let s = this.lookup(big);
            if (s)
                return s;
            s = this.arrays[big[1]][big[0]] = new chunk(big, this);
            return s;
        }
        static big(units) {
            return pts.floor(pts.divide(units, lod.chunk_span));
        }
    }
    lod.world = world;
    class chunk extends toggle {
        big;
        world;
        static total = 0;
        color;
        fog_of_war = false;
        small;
        objs = [];
        constructor(big, world) {
            super();
            this.big = big;
            this.world = world;
            if (chunk_coloration)
                this.color = (['lightsalmon', 'lightblue', 'beige', 'pink'])[Math.floor(Math.random() * 4)];
            let min = pts.mult(this.big, lod.chunk_span);
            let max = pts.add(min, [lod.chunk_span - 1, lod.chunk_span - 1]);
            this.small = new aabb(max, min);
            lod.chunks[1]++;
            world.arrays[this.big[1]][this.big[0]] = this;
            //console.log('sector');
            chunk.total++;
            hooks.call('lod_chunk_create', this);
        }
        add(obj) {
            let i = this.objs.indexOf(obj);
            if (i == -1) {
                this.objs.push(obj);
                obj.chunk = this;
                if (this.active && !obj.active)
                    obj.show();
            }
        }
        stacked(wpos) {
            let stack = [];
            for (let obj of this.objs)
                if (pts.equals(wpos, pts.round(obj.wpos)))
                    stack.push(obj);
            return stack;
        }
        remove(obj) {
            let i = this.objs.indexOf(obj);
            if (i > -1) {
                obj.chunk = null;
                return !!this.objs.splice(i, 1).length;
            }
        }
        static swap(obj) {
            // Call me whenever you move
            let oldChunk = obj.chunk;
            let newChunk = oldChunk.world.at(lod.world.big(pts.round(obj.wpos)));
            if (oldChunk != newChunk) {
                oldChunk.remove(obj);
                newChunk.add(obj);
                if (!newChunk.active)
                    obj.hide();
            }
        }
        think() {
            hooks.call('lod_chunk_think', this);
            //for (let obj of this.objs)
            //	obj.think();
        }
        show() {
            if (this.on())
                return;
            lod.chunks[0]++;
            for (let obj of this.objs)
                obj.show();
            hooks.call('lod_chunk_show', this);
        }
        hide() {
            if (this.off())
                return;
            lod.chunks[0]--;
            for (let obj of this.objs)
                obj.hide();
            hooks.call('lod_chunk_hide', this);
        }
        dist() {
            return pts.distsimple(this.big, lod.ggrid.big);
        }
        grayscale() {
            this.color = 'gray';
        }
    }
    lod.chunk = chunk;
    class grid {
        spread;
        outside;
        big = [0, 0];
        shown = [];
        visibleObjs = [];
        constructor(spread, outside) {
            this.spread = spread;
            this.outside = outside;
            lod.ggrid = this;
            if (this.outside < this.spread) {
                console.warn(' lod: outside less than spread ', this.spread, this.outside);
                this.outside = this.spread;
            }
        }
        grow() {
            this.spread++;
            this.outside++;
        }
        shrink() {
            this.spread--;
            this.outside--;
        }
        visible(chunk) {
            return chunk.dist() < this.spread;
        }
        ons() {
            // spread = -2; < 2
            for (let y = -this.spread; y < this.spread + 1; y++) {
                for (let x = -this.spread; x < this.spread + 1; x++) {
                    let pos = pts.add(this.big, [x, y]);
                    let chunk = grid_crawl_makes_chunks ? lod.gworld.at(pos) : lod.gworld.lookup(pos);
                    if (!chunk)
                        continue;
                    if (!chunk.active) {
                        this.shown.push(chunk);
                        chunk.show();
                        //for (let obj of chunk.objs)
                        //	obj.think();
                        // Todo why do we think here
                    }
                }
            }
        }
        offs() {
            // Hide chunks
            this.visibleObjs = [];
            let i = this.shown.length;
            while (i--) {
                let chunk;
                chunk = this.shown[i];
                if (chunk.dist() > this.outside) {
                    chunk.hide();
                    this.shown.splice(i, 1);
                }
                else {
                    chunk.think();
                    this.visibleObjs = this.visibleObjs.concat(chunk.objs);
                }
                if (fog_of_war) {
                    if (chunk.dist() == this.outside) {
                        //console.log('brim-chunk');
                        chunk.fog_of_war = true;
                        //sector.color = '#555555';
                    }
                    else {
                        chunk.fog_of_war = false;
                        //sector.color = '#ffffff';
                    }
                }
            }
        }
        think() {
            for (let chunk of this.shown)
                for (let obj of chunk.objs)
                    obj.think();
        }
    }
    lod.grid = grid;
    ;
    class obj extends toggle {
        counts;
        id = -1;
        type = 'an obj';
        networked = false;
        solid = false;
        wpos = [0, 0];
        rpos = [0, 0];
        size = [100, 100];
        chunk;
        ro = 0;
        z = 0;
        calcz = 0;
        height = 0;
        bound;
        expand = .5;
        constructor(counts = [0, 0]) {
            super();
            this.counts = counts;
            this.counts[1]++;
        }
        finalize() {
            // this.hide();
            this.counts[1]--;
        }
        show() {
            if (this.on())
                return;
            this.counts[0]++;
            this.create();
            //this.shape?.show();
        }
        hide() {
            if (this.off())
                return;
            this.counts[0]--;
            this.vanish();
            //this.delete();
            //this.shape?.hide();
            // console.log(' obj.hide ');
        }
        rebound() {
            this.bound = new aabb([-this.expand, -this.expand], [this.expand, this.expand]);
            this.bound.translate(this.wpos);
        }
        wtorpos() {
        }
        rtospos() {
            this.wtorpos();
            return pts.clone(this.rpos);
        }
        think() {
            // implement me
        }
        create() {
            // implement me
            console.warn(' lod: blank obj.create ');
        }
        vanish() {
            // implement me
            console.warn(' lod: blank obj.vanish ');
        }
    }
    lod.obj = obj;
})(lod || (lod = {}));
export default lod;
