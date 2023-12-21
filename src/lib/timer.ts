// a simple timer i wrote for mall planet

class timer {
	protected readonly time
	protected elapsed = 0
	constructor(public readonly end = 1) {
		this.time = performance.now();
	}
	check() {
		this.elapsed = performance.now() - this.time;
	}
	done(override: number = 0) {
		this.check();
		return (performance.now() - this.time) >= (this.end || override) * 1000
	}
	factor(override: number = 0) {
		this.check();
		return (performance.now() - this.time) / ((this.end || override) * 1000);
	}
}

export function time(end: number) {
	return new timer(end);
}

export default time;