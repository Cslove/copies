import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { clipboardManager } from './managers/clipboard'
import { hotkeyManager } from './managers/hotkey'
import { storageManager } from './services/database'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    // mainWindow.webContents.openDevTools()
  }

  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  // 初始化剪贴板管理器
  clipboardManager.startWatching()

  // 注册全局快捷键
  hotkeyManager.registerGlobalShortcuts()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  clipboardManager.stopWatching()
})

// IPC 事件处理
ipcMain.handle('clipboard:getItems', async (_, limit: number = 50, offset: number = 0) => {
  return await storageManager.getItems(limit, offset)
})

ipcMain.handle('clipboard:saveItem', async (_, content: string) => {
  return await storageManager.saveItem(content)
})

ipcMain.handle('clipboard:deleteItem', async (_, id: number) => {
  return await storageManager.deleteItem(id)
})

ipcMain.handle('clipboard:pasteItem', async (_, id: number) => {
  const item = await storageManager.getItemById(id)
  if (item) {
    clipboardManager.writeToClipboard(item.content)
    // 注意：在实际实现中，我们需要使用其他方式来模拟粘贴
    // 由于没有 robotjs，我们可以通知前端界面隐藏并提示用户按 Cmd+V
    // 或者使用其他自动化库
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
