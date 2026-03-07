import { BrowserWindow, app, ipcMain } from 'electron'
import { registerClipboardHandlers } from './clipboardHandlers'
import { registerPanelHandlers } from './panelHandlers'
import { registerUpdateHandlers, setupAutoUpdaterEvents } from './updateHandlers'

/**
 * 注册所有 IPC 处理器
 * @param mainWindow 主窗口实例
 */
export function registerAllHandlers(mainWindow: BrowserWindow | null) {
  registerClipboardHandlers(mainWindow)
  registerPanelHandlers(mainWindow)
  registerUpdateHandlers(mainWindow)
  registerAppHandlers()
}

/**
 * 注册应用相关的 IPC 处理器
 */
function registerAppHandlers() {
  // 获取应用版本
  ipcMain.handle('app:getVersion', () => {
    return app.getVersion()
  })
}

/**
 * 设置所有事件监听器
 * @param mainWindow 主窗口实例
 */
export function setupAllEventListeners(mainWindow: BrowserWindow | null) {
  setupAutoUpdaterEvents(mainWindow)
}

export { registerClipboardHandlers, registerPanelHandlers, registerUpdateHandlers, setupAutoUpdaterEvents }
