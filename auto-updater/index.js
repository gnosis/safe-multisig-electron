const os = require('os');
const fetch = require('node-fetch');
const { autoUpdater, dialog, app } = require('electron');
const appVersion = app.getVersion();

let updateFeed = '';
let latestVersion = null;
let linuxUri = undefined;
let initialized = false;
const cmd = process.argv[1];
const platform = os.platform();

const nutsURL = 'https://safe-electron-multisig.now.sh';

if (platform === 'darwin') {
  updateFeed = `${nutsURL}/update/${platform}/${appVersion}`;
} else if (os.platform() === 'win32') {
  updateFeed = `${nutsURL}/update/win32/${appVersion}`;
} else if (os.platform() === 'linux') {
  fetch(`${nutsURL}/latest-version`)
    .then(res => res.json())
    .then(res => {
      latestVersion = res.version.substring(1);
      linuxUri = res.files.AppImage.url;
    });
}

function init(mainWindow) {
  mainWindow.webContents.send('console', `App version: ${appVersion}`);

  if (latestVersion && appVersion < latestVersion) {
    mainWindow.webContents.send('message', {
      msg: `🎉 There is an update available!`,
      hide: false,
      isLinux: true,
      action: true,
      linuxUri,
    });
    return;
  }

  mainWindow.webContents.send('message', {
    msg: `🖥 App version: ${appVersion}`,
    hide: true,
  });

  if (initialized || !updateFeed || process.env.NODE_ENV === 'development') {
    return;
  }

  initialized = true;

  autoUpdater.setFeedURL(updateFeed);

  autoUpdater.on('error', (ev, err) => {
    let options = {
      message: err,
    };
    const response = dialog.showMessageBox(options);
    console.log(response);
    //mainWindow.webContents.send('message', { msg: `😱 Error: ${err}`, hide:false })
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
