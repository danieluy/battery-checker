// require('dotenv').load();
const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

let mainWindow;
const mainMenu = require('./main/main-menu');

function createWindow() {
  // if (process.env.NODE_ENV !== 'development')
  //   app.setLoginItemSettings({ // WIN and MAC only
  //     openAtLogin: true
  //   });
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'media/icons/png/64x64.png')
  });
  mainWindow.loadFile('index.html');

  mainWindow.setMenu(null);
  const menuTemplate = mainMenu({ mainWindow, app, dialog }).template;
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
