import mall from "./mall.js"

const { app, BrowserWindow } = require('electron')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768
	})

	win.loadFile('index.html')
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

    mall.start();
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
