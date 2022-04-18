const { app, BrowserWindow, ipcMain } = require('electron');
const mainJsScript = require("./mainWindow.js");
const actionDictionary = require("../util/actions/mainProcessActionDictionary.js");
const Action = require('../util/actions/Action.js');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  mainJsScript.main();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) mainJsScript.main();
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('action-signal', (event, args) => {
  actionToDo = actionDictionary[args[0]];
  actionToDo.do();
});
