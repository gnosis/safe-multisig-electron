// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
if(require('electron-squirrel-startup')) return;
const url = require('url');
const path = require('path');
const autoUpdater = require('./auto-updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let updaterWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false,
    },
    icon: path.join(__dirname, 'safe.png'),
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // and load the index.html of the app.
  //mainWindow.loadURL('https://gnosis-safe.io/')
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );
  // Hide the menu
  mainWindow.setMenu(null);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('did-finish-load', () => {
    autoUpdater.init(mainWindow);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
