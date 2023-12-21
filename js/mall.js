"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob_js_1 = require("./glob.js");
var renderer_js_1 = require("./renderer.js");
var mall;
(function (mall) {
    var constant = 1;
    function boot() {
        console.log(' mall start ');
        renderer_js_1.default.boot();
    }
    mall.boot = boot;
    function dom_ready() {
        console.log(' mall dom ready ');
    }
    mall.dom_ready = dom_ready;
    function ready(word) {
        console.log(' making mall ready ');
        renderer_js_1.default.ready(word);
    }
})(mall || (mall = {}));
glob_js_1.default.mall = mall;
exports.default = mall;
//# sourceMappingURL=mall.js.map