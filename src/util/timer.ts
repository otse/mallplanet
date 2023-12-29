// likely the worst class ive ever written - otse

function clamp(val, min, max) {
	return val > max ? max : val < min ? min : val;
}

export class timer {
	begin
	constructor(protected end = 1, base?: timer) {
		this.begin = performance.now();
		if (base)
			this.begin += base.overtime();
	}
	dif() {
		return performance.now() - this.begin;
	}
	elapsed() {
		return this.dif() / 1000;
	}
	overtime() {
		return this.dif() - (this.end * 1000);
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

export default timer;