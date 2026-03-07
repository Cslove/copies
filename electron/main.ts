import { app, BrowserWindow, globalShortcut } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { clipboardManager } from './managers/clipboard'
import { hotkeyManager } from './managers/hotkey'
import { storageManager } from './services/database'
import { registerAllHandlers, setupAllEventListeners } from './handlers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'build', 'icon.icns')
    : path.join(__dirname, '../build/icon.icns')

  const defaultWidth = 400
  const defaultHeight = 600

  mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
    minWidth: defaultWidth,
    minHeight: defaultHeight,
    maxWidth: 500,
    maxHeight: 700,
    resizable: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    show: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    mainWindow.loadURL('http://localhost:5173')
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  storageManager.init()
  createWindow()
  clipboardManager.startWatching()
  hotkeyManager.registerGlobalShortcuts(mainWindow)

  registerAllHandlers(mainWindow)

  setupAllEventListeners(mainWindow)

  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 3000)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      if (!mainWindow.isVisible()) {
        hotkeyManager.showPanel()
      }
    }
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  clipboardManager.stopWatching()
  storageManager.close()
})

export { mainWindow }
