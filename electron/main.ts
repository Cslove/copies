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
  // 获取屏幕尺寸，设置为屏幕的 80%
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.3),
    height: Math.floor(height * 0.8),
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  if (app.isPackaged) {
    // 生产环境：加载打包后的 HTML 文件
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    // 开发环境：加载 Vite 开发服务器
    mainWindow.loadURL('http://localhost:5173')
    // 打开开发者工具
    mainWindow.webContents.openDevTools()
  }

  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  // 初始化数据库
  storageManager.init()

  createWindow()

  // 初始化剪贴板管理器
  clipboardManager.startWatching()

  // 注册全局快捷键，传递 mainWindow 用于显示/隐藏面板
  hotkeyManager.registerGlobalShortcuts(mainWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  clipboardManager.stopWatching()
  storageManager.close()
})

// IPC 事件处理
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
    // 粘贴成功后隐藏面板
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide()
    }
    return true
  }
  return false
})

// 监听剪贴板变化事件
clipboardManager.onClipboardChanged((content: string) => {
  if (mainWindow) {
    mainWindow.webContents.send('clipboard:changed', { content })
  }
})

export { mainWindow }
