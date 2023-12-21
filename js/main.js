"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob_js_1 = require("./glob.js");
var mall_js_1 = require("./mall.js");
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var createWindow = function () {
    var win = new BrowserWindow({
        width: 1024,
        height: 768
    });
    glob_js_1.default.win = win;
    win.glob = glob_js_1.default;
    win.loadFile('index.html');
    win.webContents.on('dom-ready', mall_js_1.default.dom_ready);
};
app.whenReady().then(function () {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
    mall_js_1.default.boot();
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
//# sourceMappingURL=main.js.map