/// the sounds for mall planet
// uses the positional audio panner because it's sexe
import { THREE } from "./mall.js";
import renderer from "./renderer.js";
import hooks from "./util/hooks.js";
import load_screen from "./views/load_screen.js";
class asd {
    asd;
}
var snd;
(function (snd) {
    var listener;
    let gestured = false;
    snd.loaded = false;
    let sounds_loaded = 0, sounds_to_load = 0;
    snd.music = [
        './snd/strelok.mp3',
        './snd/blurringmyday.mp3',
    ];
    snd.footsteps = [];
    snd.buffers = {};
    function boot() {
        gesture();
    }
    snd.boot = boot;
    function gesture() {
        if (gestured)
            return;
        load();
        gestured = true;
    }
    function load() {
        listener = new THREE.AudioListener();
        renderer.camera.add(listener);
        console.log(' snd load ');
        let loads = [];
        loads = loads.concat(snd.music, snd.footsteps);
        sounds_to_load = loads.length;
        load_screen.things_to_load += sounds_to_load;
        const loader = new THREE.AudioLoader();
        for (let path of loads) {
            let filename = path.replace(/^.*[\\/]/, '');
            let basename = filename.split('.')[0];
            console.log(' loading snd ', filename);
            loader.load(path, function (buffer) {
                snd.buffers[basename] = buffer;
                load_screen.increment(path);
            }, function () { }, function () {
                console.warn(' mall audio cannot load ', filename);
            });
        }
        snd.loaded = true;
    }
    function loaded_sound() {
        sounds_loaded++;
        if (sounds_loaded >= sounds_to_load) {
            console.log(' snd all sounds ');
            hooks.call('sndLoaded', 1);
        }
    }
    snd.loaded_sound = loaded_sound;
    function play_directional(id, volume = 1, loop = false) {
        const buffer = snd.buffers[id];
        if (!buffer) {
            console.warn(' sound doesnt exist ', id);
            return;
        }
        let positional = new THREE.PositionalAudio(listener);
        positional.setBuffer(buffer);
        positional.setLoop(loop);
        positional.setVolume(volume);
        positional.play();
        return positional;
    }
    snd.play_directional = play_directional;
    function play_regular(id = 'placeholder', volume = 1, loop = false) {
        const buffer = snd.buffers[id];
        if (!buffer) {
            console.warn(' sound doesnt exist ', id);
            return;
        }
        const sound = new THREE.Audio(listener);
        sound.setBuffer(buffer);
        sound.setVolume(volume);
        sound.setLoop(loop);
        sound.play();
        return sound;
    }
    snd.play_regular = play_regular;
})(snd || (snd = {}));
export default snd;
