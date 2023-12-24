/// mouse / keyboard

namespace mkb {
	export enum KEY {
		OFF = 0,
		PRESS,
		WAIT,
		AGAIN,
		UP
	};
	export enum MOUSE {
		UP = - 1,
		OFF = 0,
		DOWN,
		STILL
	};
	var keys = {};
	var mb = {};
	var pos: vec2 = [0, 0];
	export var wheel = 0;
	function onmousemove(e) {
		pos[0] = e.clientX;
		pos[1] = e.clientY;
	}
	function onmousedown(e) {
		mb[e.button] = 1;
		if (e.button == 1)
			return false
	}
	function onmouseup(e) {
		mb[e.button] = MOUSE.UP;
	}
	function onwheel(e) {
		wheel = e.deltaY < 0 ? 1 : -1;
	}
	function onkeys(event) {
		const key = event.key.toLowerCase();
		if ('keydown' == event.type)
			keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
		else if ('keyup' == event.type)
			keys[key] = KEY.UP;
		if (event.keyCode == 114)
			event.preventDefault();
	}
	function post_keys() {
		for (let i in keys) {
			if (keys[i] == KEY.PRESS)
				keys[i] = KEY.WAIT;
			else if (keys[i] == KEY.UP)
				keys[i] = KEY.OFF;
		}
	}
	function post_mouse_buttons() {
		for (let b of [0, 1, 2])
			if (mb[b] == MOUSE.DOWN)
				mb[b] = MOUSE.STILL;
			else if (mb[b] == MOUSE.UP)
				mb[b] = MOUSE.OFF;
	}
	export function loop() {
		wheel = 0;
		post_keys();
		post_mouse_buttons();
	}
	export function attach_listeners() {
		document.onkeydown = document.onkeyup = onkeys;
		document.onmousemove = onmousemove;
		document.onmousedown = onmousedown;
		document.onmouseup = onmouseup;
		document.onwheel = onwheel;
	}
	// api functions for consoomers:
	export function key(k: string) {
		return keys[k];
	}
	export function button(b: number) {
		return mb[b];
	}
	export function mouse(): vec2 {
		return [...pos];
	}
}

export default mkb;