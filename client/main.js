const {app, BrowserWindow, Menu, Tray, shell} = require('electron');

let path = require('path');
fs = require('fs');
let win

let appIcon = null;

function createWindow () {

  app.server = require(__dirname + '/api/main')();

  win = new BrowserWindow({icon: 'icon.ico', width: 400, height: 450, minWidth: 400, minHeight: 450, maxWidth: 400, maxHeight: 450, frame: false});
  win.loadFile('window.html');

  win.setMenu(null);
  

  const iconPath = path.join(__dirname, 'icon.ico');


  appIcon = new Tray(iconPath);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Hide',
      click: () => {
        win.hide();
      }
    },
    {
      label: 'Show',
      click: () => {
        win.show();
      }
    },
    {
      label: 'WebListener',
      click: () => {
        shell.openExternal('https://carlosteixeira.xyz/voicify');
      }
    },
    { label: 'Exit',
      selector: 'terminate:',
    }
  ]);
  appIcon.setToolTip('Voicify Client Beta');
  appIcon.setContextMenu(contextMenu);




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