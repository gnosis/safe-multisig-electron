const os = require('os');
const fetch = require('node-fetch');
const { dialog, app } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const appVersion = app.getVersion();

let initialized = false;
const cmd = process.argv[1];
const platform = os.platform();

function init(mainWindow) {
  mainWindow.webContents.send('console', `App version: ${appVersion}`);

  mainWindow.webContents.send('message', {
    msg: `🖥 App version: ${appVersion}`,
    hide: true,
  });

  if (initialized || process.env.NODE_ENV === 'development') {
    return;
  }

  initialized = true;

  autoUpdater.on('error', (ev, err) => {
    let options = {
      message: err,
    };
    const response = dialog.showMessageBox(options);
    console.log(response);
  });

  autoUpdater.once('checking-for-update', (ev, err) => {
    mainWindow.webContents.send('message', {
      msg: '🔎 Checking for updates',
      hide: false,
    });
  });

  autoUpdater.once('update-available', (ev, err) => {
    mainWindow.webContents.send('message', {
      msg: '🎉 Update available. Downloading ⌛️',
      hide: false,
    });
  });

  autoUpdater.once('update-not-available', (ev, err) => {
    mainWindow.webContents.send('message', {
      msg: '👎 Update not available',
      hide: false,
    });
  });

  autoUpdater.once('update-downloaded', (ev, err) => {
    mainWindow.webContents.send('message', {
      msg: '🤘 Update downloaded.',
      hide: false,
      isLinux: false,
      action: true,
    });
  });

  if (cmd !== '--squirrel-firstrun') autoUpdater.checkForUpdates();
}

module.exports = {
  init,
};
