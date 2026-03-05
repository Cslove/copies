import { BrowserWindow } from 'electron'
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
}

/**
 * 设置所有事件监听器
 * @param mainWindow 主窗口实例
 */
export function setupAllEventListeners(mainWindow: BrowserWindow | null) {
  setupAutoUpdaterEvents(mainWindow)
}

export { registerClipboardHandlers, registerPanelHandlers, registerUpdateHandlers, setupAutoUpdaterEvents }
