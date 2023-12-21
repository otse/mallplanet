// a simple timer i wrote for mall planet

class timer {
	protected readonly begin
	constructor(protected end = 1) {
		this.end *= 1000;
		this.begin = performance.now();
	}
	dif() {
		return performance.now() - this.begin;
	}
	elapsed() {
		return this.dif() / 1000;
	}
	factor() { // 0 - 1
		return this.dif() / this.end;
	}
	done() {
		return this.dif() >= this.end
	}
}

export function time(end: number) {
	return new timer(end);
}

export default time;