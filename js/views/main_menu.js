// as you guessed this is the intro 
import hooks from "../util/hooks.js";
import mall from "../mall.js";
import game_manager from "../game/game_manager.js";
import snd from "../snd.js";
var main_menu;
(function (main_menu) {
    let time = 0;
    let music;
    let fader, holder, logo;
    function make_button(text) {
        let button = document.createElement('div');
        //button.setAttribute('id', 'main_menu')
        button.classList.add('button');
        button.innerHTML = text;
        return button;
    }
    function start() {
        mall.view = this;
        fader = document.createElement('div');
        fader.setAttribute('id', 'fader');
        mall.whole.append(fader);
        setTimeout(() => { fader.remove(); }, 4000);
        holder = document.createElement('div');
        holder.setAttribute('id', 'main_menu');
        mall.whole.append(holder);
        logo = document.createElement('div');
        logo.setAttribute('id', 'logo');
        logo.innerHTML = 'MallPlanet';
        holder.append(logo);
        let start = make_button('start');
        let quit = make_button('quit');
        start.onclick = () => {
            //entry
            console.log('boo');
            cleanup();
            game_manager.start_new_game();
        };
        holder.append(start);
        holder.append(quit);
        music = snd.play_regular('blurringmyday', 0.5, true);
        hooks.register('mallAnimate', animate);
    }
    main_menu.start = start;
    function cleanup() {
        mall.whole.innerHTML = '';
        music.stop();
        hooks.unregister('mallAnimate', animate);
    }
    main_menu.cleanup = cleanup;
    function animate() {
    }
    main_menu.animate = animate;
})(main_menu || (main_menu = {}));
export default main_menu;
