// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
let toastInstance = undefined;
const iFrame = document.getElementById('iframe');

// add the transport to the iframe window global object
iFrame.contentWindow.TransportNodeHid = window.TransportNodeHid;
iFrame.contentWindow.isDesktop = window.isDesktop;


window.quitAndInstall = function() {
  electron.remote.autoUpdater.quitAndInstall();
};

ipcRenderer.on('console', (event, consoleMsg) => {
  console.log(consoleMsg);
});

ipcRenderer.on('message', (event, data) => {
  showMessage(data.msg, data.hide, data.action);
});

function showMessage(
  message,
  hide = true,
  action = undefined,
) {
  if (hide) {
    toastInstance = mdtoast(message, {
      duration: 5000,
    });
  } else
    toastInstance = mdtoast(message, {
      interaction: true,
      interactionTimeout: null,
      actionText:
        action ? 'RESTART' : 'DISMISS',
      action: function() {
        action
          ? window.quitAndInstall()
          : this.hide();
      },
    });
}

function downloadApp(url) {
  electron.shell.openExternal(url);
  toastInstance.hide();
  return;
}

function resizeIFrameToFitContent(iFrame) {
  iFrame.width = window.innerWidth;
  iFrame.height = window.innerHeight;
}

window.addEventListener('resize', () => resizeIFrameToFitContent(iFrame));

window.addEventListener('DOMContentLoaded', function(e) {
  resizeIFrameToFitContent(iFrame);

  // or, to resize all iframes:
  var iframes = document.querySelectorAll('iframe');
  for (var i = 0; i < iframes.length; i++) {
    resizeIFrameToFitContent(iframes[i]);
  }
});
