// a simple timer i wrote for mall planet
class timer {
    constructor(end = 1) {
        this.end = end;
        this.elapsed = 0;
        this.time = performance.now();
    }
    check() {
        this.elapsed = performance.now() - this.time;
    }
    done(override = 0) {
        this.check();
        return (performance.now() - this.time) >= (this.end || override) * 1000;
    }
    factor(override = 0) {
        this.check();
        return (performance.now() - this.time) / ((this.end || override) * 1000);
    }
}
export function time(end) {
    return new timer(end);
}
export default time;
