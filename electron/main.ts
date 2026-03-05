import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { clipboardManager } from './managers/clipboard'
import { hotkeyManager } from './managers/hotkey'
import { storageManager } from './services/database'

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
  const defaultWidth = Math.floor(width * 0.25)
  const defaultHeight = Math.floor(height * 0.5)

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
    // mainWindow.webContents.openDevTools()
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

ipcMain.handle('panel:show', async () => {
  hotkeyManager.showPanel()
  return true
})

ipcMain.handle('panel:hide', async () => {
  if (mainWindow) {
    mainWindow.hide()
  }
  return true
})

ipcMain.handle('clipboard:getItems', async (_, limit: number = 50, offset: number = 0) => {
  return await storageManager.getItems(limit, offset)
})

ipcMain.handle('clipboard:saveItem', async (_, content: string) => {
  return await storageManager.saveItem(content)
})

ipcMain.handle('clipboard:deleteItem', async (_, id: number) => {
  return await storageManager.deleteItem(id)
})

ipcMain.handle('clipboard:updateItem', async (_, id: number, updates: Record<string, unknown>) => {
  return await storageManager.updateItem(id, updates)
})

ipcMain.handle('clipboard:searchItems', async (_, query: string, limit: number = 50) => {
  return await storageManager.searchItems(query, limit)
})

ipcMain.handle('clipboard:getFavorites', async () => {
  return await storageManager.getFavorites()
})

ipcMain.handle('clipboard:getStats', async () => {
  return await storageManager.getStats()
})

ipcMain.handle('clipboard:clearAllItems', async () => {
  return await storageManager.clearAllItems()
})

ipcMain.handle('clipboard:pasteItem', async (_, id: number) => {
  const item = await storageManager.getItemById(id)
  if (item) {
    clipboardManager.writeToClipboard(item.content)
    return true
  }
  return false
})

clipboardManager.onClipboardChanged((content: string) => {
  if (mainWindow) {
    mainWindow.webContents.send('clipboard:changed', { content })
  }
})

export { mainWindow }
