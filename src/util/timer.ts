// a simple timer i wrote for mall planet. i can acknowledge that it is crap

function clamp(val, min, max) {
	return val > max ? max : val < min ? min : val;
}

export class timer {
	begin
	constructor(protected end = 1) {
		this.begin = performance.now();
	}
	dif() {
		return performance.now() - this.begin;
	}
	elapsed() {
		return this.dif() / 1000;
	}
	factor(override = 0) { // 0 - 1
		return this.dif() / ((override || this.end) * 1000);
	}
	factorc(override = 0) {
		return clamp(this.factor(override), 0, 1);
	}
	done(override = 0) {
		return this.dif() >= ((override || this.end) * 1000)
	}
}

export function time(end: number): timer {
	return new timer(end);
}

export default time;