import { ipcMain, BrowserWindow } from 'electron'
import { hotkeyManager } from '../managers/hotkey'

export function registerPanelHandlers(mainWindow: BrowserWindow | null) {
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
}
