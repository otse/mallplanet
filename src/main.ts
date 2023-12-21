import glob from "./glob.js"
import mall from "./mall.js"

const { app, BrowserWindow } = require('electron')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768
	})

	glob.win = win;

	win.glob = glob;

	win.loadFile('index.html')
	win.webContents.on('dom-ready', mall.dom_ready);
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

    mall.boot();
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
