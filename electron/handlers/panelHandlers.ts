import { ipcMain, BrowserWindow } from 'electron'
import { hotkeyManager } from '../managers/hotkey'

/**
 * 注册面板控制相关的 IPC 处理器
 * @param mainWindow 主窗口实例
 */
export function registerPanelHandlers(mainWindow: BrowserWindow | null) {
  // 显示面板
  ipcMain.handle('panel:show', async () => {
    hotkeyManager.showPanel()
    return true
  })

  // 隐藏面板
  ipcMain.handle('panel:hide', async () => {
    if (mainWindow) {
      mainWindow.hide()
    }
    return true
  })
}
