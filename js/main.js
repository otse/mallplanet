"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mall_js_1 = require("./mall.js");
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var createWindow = function () {
    var win = new BrowserWindow({
        width: 1024,
        height: 768
    });
    win.loadFile('index.html');
};
app.whenReady().then(function () {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
    mall_js_1.default.start();
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
//# sourceMappingURL=main.js.map