import { ipcMain, BrowserWindow } from 'electron'
import { clipboardManager } from '../managers/clipboard'
import { trayManager } from '../managers/tray'
import { storageManager } from '../services/database'

export function registerClipboardHandlers(mainWindow: BrowserWindow | null) {
  ipcMain.handle('clipboard:pasteItem', async (_, id: number) => {
    const item = await storageManager.getItemById(id)
    if (item) {
      clipboardManager.writeToClipboard(item.content)
      await storageManager.updateItem(id, { used_count: item.used_count + 1 })
      trayManager.showClipboardNotification()
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
