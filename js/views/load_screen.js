/// the load screen for mall
// sounds can take several sounds so a load indicator is welcome
import hooks from "../util/hooks.js";
import game_manager from "../game/manager.js";
import mall from "../mall.js";
import mkb from "../mkb.js";
import time from "../util/timer.js";
var load_screen;
(function (load_screen) {
    load_screen.things_to_load = 0;
    load_screen.things_loaded = 0;
    load_screen.emojis = ['🐔']; // '🐑', '🐖', '🐉', '🍄', '🐢', 
    let whole, last, bar;
    let skipping, delay, timeout;
    function start(mall) {
        mall.view = this;
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
        hooks.register('mallAnimate', animate);
    }
    load_screen.start = start;
    function cleanup() {
        whole.remove();
        load_screen.next?.start();
        hooks.unregister('mallAnimate', animate);
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
            load_screen.done = true;
            delay = time(0.5);
        }
    }
    load_screen.increment = increment;
    function animate() {
        if (!load_screen.done)
            return;
        if (delay.done()) {
            cleanup();
        }
        else if (mkb.key(' ') == 1) {
            // go straight into game
            console.log(' skipping ');
            skipping = true;
            load_screen.next = undefined;
            cleanup();
            game_manager.start_new_game();
        }
    }
    load_screen.animate = animate;
})(load_screen || (load_screen = {}));
export default load_screen;
