"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob = {};

var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var createWindow = function () {
	var win = new BrowserWindow({
		width: 1024,
		height: 768,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.webContents.openDevTools();
	glob.win = win;
	console.log(' app ', !!app);
	console.log(' BrowserWindow ', !!BrowserWindow);
	win.glob = glob;
	win.loadFile('index.html');
};
app.whenReady().then(function () {
	createWindow();
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0)
			createWindow();
	});
	//mallprocess.boot();
});
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin')
		app.quit();
});
