/// the load screen for mall
// sounds can take several seconds so a load indicator was welcome
import hooks from "../util/hooks.js";
import manager from "../game/manager.js";
import mall from "../mall.js";
import mkb from "../mkb.js";
import time from "../util/timer.js";
var loading_screen;
(function (loading_screen) {
    loading_screen.things_to_load = 0;
    loading_screen.things_loaded = 0;
    loading_screen.emojis = ['🐔']; // '🐑', '🐖', '🐉', '🍄', '🐢', 
    let whole, last, bar;
    let delay;
    let timeout;
    let skipping;
    function start(mall) {
        mall.view = this;
        whole = document.createElement('div');
        whole.setAttribute('id', 'load_screen');
        mall.whole.append(whole);
        whole.innerHTML = `
		<div id="skip_hint">(tap space to launch into game)</div>
		<div id="last"></div>
		<br />
		<div id="bar"></div>
		`;
        last = whole.querySelector('#last');
        bar = whole.querySelector('#bar');
        hooks.register('mallAnimate', animate);
    }
    loading_screen.start = start;
    function cleanup() {
        whole.remove();
        loading_screen.next?.start();
        hooks.unregister('mallAnimate', animate);
    }
    loading_screen.cleanup = cleanup;
    function increment(asset = './') {
        const thing = document.createElement('div');
        thing.classList.add('thing');
        thing.innerHTML = mall.sample(loading_screen.emojis);
        bar.append(thing);
        loading_screen.things_loaded++;
        last.innerHTML = `${asset}`;
        if (loading_screen.things_loaded >= loading_screen.things_to_load) {
            loading_screen.done = true;
            delay = time(0.5);
        }
    }
    loading_screen.increment = increment;
    function animate() {
        if (!loading_screen.done)
            return;
        if (delay.done()) {
            cleanup();
        }
        else if (mkb.key_state(' ') == 1) {
            // go straight into game
            console.log(' skipping ');
            skipping = true;
            loading_screen.next = undefined;
            cleanup();
            manager.start_new_game();
        }
    }
    loading_screen.animate = animate;
})(loading_screen || (loading_screen = {}));
export default loading_screen;
