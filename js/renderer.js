"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer;
(function (renderer) {
    var ad_hoc = 0;
    function boot() {
        console.log('THREE'); //, THREE);
    }
    renderer.boot = boot;
    function ready(word) {
        console.log(' making renderer ready ');
        if (THREE)
            console.log('THREE is imported');
    }
    renderer.ready = ready;
})(renderer || (renderer = {}));
exports.default = renderer;
//# sourceMappingURL=renderer.js.map