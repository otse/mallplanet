/// the load screen for mall
// sounds can take several sounds so a load indicator is welcome
import mall from "../mall.js";
import startup from "./startup.js";
var load_screen;
(function (load_screen) {
    load_screen.things_to_load = 0;
    load_screen.things_loaded = 0;
    load_screen.emojis = ['🐑', '🐖', '🐉', '🍄', '🐢', '🐔'];
    let whole, last, bar;
    function boot(mall) {
        start(mall);
    }
    load_screen.boot = boot;
    function start(mall) {
        whole = document.createElement('div');
        whole.setAttribute('id', 'load_screen');
        mall.whole.append(whole);
        whole.innerHTML = `
		<div id="last"></div>
		<br />
		<div id="bar"></div>
		`;
        last = whole.querySelector('#last');
        bar = whole.querySelector('#bar');
        load_screen.next = startup;
    }
    load_screen.start = start;
    function cleanup() {
        whole.remove();
        load_screen.next?.start();
    }
    load_screen.cleanup = cleanup;
    function increment(asset = './') {
        const thing = document.createElement('div');
        thing.classList.add('thing');
        thing.innerHTML = mall.sample(load_screen.emojis);
        bar.append(thing);
        load_screen.things_loaded++;
        last.innerHTML = `${asset}`;
        if (load_screen.things_loaded >= load_screen.things_to_load) {
            console.log(' load screen done ');
            setTimeout(cleanup, 500);
        }
    }
    load_screen.increment = increment;
    function animate() {
    }
    load_screen.animate = animate;
})(load_screen || (load_screen = {}));
export default load_screen;
