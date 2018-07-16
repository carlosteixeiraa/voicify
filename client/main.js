const {app, BrowserWindow} = require('electron');

fs = require('fs');
let win

function createWindow () {

  app.server = require(__dirname + '/api/main')();

  win = new BrowserWindow({width: 400, height: 450, minWidth: 400, minHeight: 450, maxWidth: 400, maxHeight: 450, frame: false});
  win.loadFile('window.html');

  win.setMenu(null);

  win.focus();

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})
