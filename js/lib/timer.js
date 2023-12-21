// a simple timer i wrote for mall planet
class timer {
    end;
    begin;
    constructor(end = 1) {
        this.end = end;
        this.end *= 1000;
        this.begin = performance.now();
    }
    dif() {
        return performance.now() - this.begin;
    }
    elapsed() {
        return this.dif() / 1000;
    }
    factor() {
        return this.dif() / this.end;
    }
    done() {
        return this.dif() >= this.end;
    }
}
export function time(end) {
    return new timer(end);
}
export default time;
