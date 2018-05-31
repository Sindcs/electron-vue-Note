'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let workerWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const workerWinURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9090/worker.html`
  : `file://${__dirname}/worker.html`

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
// Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  workerWindow = new BrowserWindow({
    height: 680,
    width: 800,
    frame: true,
    show: true
  })
  mainWindow.loadURL(winURL)
  workerWindow.loadURL(workerWinURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

ipcMain.on('getMainHandle-request', (event, arg) => {
  event.sender.send('getMainHandle-response', {
    mainHandel: mainWindow.getNativeWindowHandle(),
    mainId: mainWindow.id,
    workerId: workerWindow.id
  })
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
