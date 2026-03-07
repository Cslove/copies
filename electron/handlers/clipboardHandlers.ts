import { ipcMain, BrowserWindow } from 'electron'
import { clipboardManager } from '../managers/clipboard'
import { storageManager } from '../services/database'

export function registerClipboardHandlers(mainWindow: BrowserWindow | null) {
  ipcMain.handle('clipboard:getItems', async () => {
    return await storageManager.getItems()
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

  ipcMain.handle('clipboard:searchItems', async (_, query: string) => {
    return await storageManager.searchItems(query)
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
}
