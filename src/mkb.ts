/// mouse keyboard

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
	var buttons = {};
	var pos: vec2 = [0, 0];
	export var wheel = 0;
	function onmousemove(e) {
		pos[0] = e.clientX;
		pos[1] = e.clientY;
	}
	function onmousedown(e) {
		buttons[e.button] = 1;
		if (e.button == 1)
			return false
	}
	function onmouseup(e) {
		buttons[e.button] = MOUSE.UP;
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
		return buttons[b];
	}
	export function mouse(): vec2 {
		return [...pos];
	}
}

export default mkb;