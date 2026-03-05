import { app, BrowserWindow, globalShortcut, screen } from 'electron'
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
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  // 设置图标路径
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'build', 'icon.icns')
    : path.join(__dirname, '../build/icon.icns')

  // 计算默认窗口尺寸
  const defaultWidth = Math.floor(width * 0.8)
  const defaultHeight = Math.floor(height * 0.8)

  mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
    minWidth: defaultWidth,
    minHeight: defaultHeight,
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
    mainWindow.webContents.openDevTools()
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

  // 注册所有 IPC 处理器
  registerAllHandlers(mainWindow)

  // 设置所有事件监听器
  setupAllEventListeners(mainWindow)

  // 应用启动后自动检查更新（仅在打包后）
  if (app.isPackaged) {
    // 延迟 5 秒后检查更新，避免启动时阻塞
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 5000)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      if (!mainWindow.isVisible()) {
        mainWindow.showInactive()
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
