// as you guessed this is the intro 
import mall from "../mall.js";
var main_menu;
(function (main_menu) {
    let time = 0;
    let holder, logo;
    function make_button(text) {
        let button = document.createElement('div');
        //button.setAttribute('id', 'main_menu')
        button.classList.add('button');
        button.innerHTML = text;
        return button;
    }
    function boot() {
        holder = document.createElement('div');
        holder.setAttribute('id', 'main_menu');
        mall.page.append(holder);
        logo = document.createElement('div');
        logo.setAttribute('id', 'logo');
        logo.innerHTML = 'Mall Planet';
        holder.append(logo);
        let start = make_button('start');
        let quit = make_button('quit');
        holder.append(start);
        holder.append(quit);
    }
    main_menu.boot = boot;
    function cleanup() {
    }
    main_menu.cleanup = cleanup;
    function animate() {
    }
    main_menu.animate = animate;
})(main_menu || (main_menu = {}));
export default main_menu;
