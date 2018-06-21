module.exports = ({ mainWindow, app, dialog }) =>
  ({
    template: [
      {
        label: 'File',
        submenu: [
          {
            label: 'Quit',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Toggle Developer Tools',
            click: () => {
              mainWindow.webContents.toggleDevTools();
            },
            accelerator: 'F12'
          }
        ]
      }
    ]
  });
