'use strict'

import {app, protocol, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import os from 'os'
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
// const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

let win = null;

async function createWindow() {
    // Create the browser window.
    if (os.platform() === 'darwin') {
        win = new BrowserWindow({
            width: 1200,
            height: 850,
            autoHideMenuBar: true,
            webPreferences: {
                // Use pluginOptions.nodeIntegration, leave this alone
                // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
            }
        })
    } else if (os.platform() === 'win32') {
        win = new BrowserWindow({
            width: 1400,
            height: 860,
            autoHideMenuBar: true,
            webPreferences: {
                // Use pluginOptions.nodeIntegration, leave this alone
                // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
            }
        })
    }

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        // if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    return win
}

/* Updater ======================================================*/
function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
    // autoUpdater.autoDownload = true;
    // autoUpdater.checkForUpdates();
})

app.on('ready', function()  {
    autoUpdater.checkForUpdatesAndNotify();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}