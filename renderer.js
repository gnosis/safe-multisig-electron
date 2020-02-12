// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const electron = require('electron')
//const snackbar = require('node-snackbar')
const ipcRenderer = electron.ipcRenderer
let lastMsgId = 0
const iFrame = document.getElementById('iframe')

window.quitAndInstall = function () {
  electron.remote.autoUpdater.quitAndInstall()
}

ipcRenderer.on('console', (event, consoleMsg) => {
  console.log(consoleMsg)
})

ipcRenderer.on('message', (event, data) => {
  showMessage(data.msg, data.hide, data.replaceAll)
})

function showMessage(message, hide = true, replaceAll = false) {
    mdtoast(message, {
        interaction: true,
        duration:10000,
    });
}

function resizeIFrameToFitContent( iFrame ) {
    iFrame.width  = window.innerWidth;
    iFrame.height = window.innerHeight;
}

window.addEventListener("resize", () => resizeIFrameToFitContent( iFrame ))

window.addEventListener('DOMContentLoaded', function(e) {

    resizeIFrameToFitContent( iFrame );

    // or, to resize all iframes:
    var iframes = document.querySelectorAll("iframe");
    for( var i = 0; i < iframes.length; i++) {
        resizeIFrameToFitContent( iframes[i] );
    }
})
