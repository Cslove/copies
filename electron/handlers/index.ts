import { BrowserWindow, app, ipcMain } from 'electron'
import { registerClipboardHandlers } from './clipboardHandlers'
import { registerPanelHandlers } from './panelHandlers'
import { registerUpdateHandlers, setupAutoUpdaterEvents } from './updateHandlers'

export function registerAllHandlers(mainWindow: BrowserWindow | null) {
  registerClipboardHandlers(mainWindow)
  registerPanelHandlers(mainWindow)
  registerUpdateHandlers(mainWindow)
  registerAppHandlers()
}

function registerAppHandlers() {
  ipcMain.handle('app:getVersion', () => {
    return app.getVersion()
  })
}

export function setupAllEventListeners(mainWindow: BrowserWindow | null) {
  setupAutoUpdaterEvents(mainWindow)
}

export { registerClipboardHandlers, registerPanelHandlers, registerUpdateHandlers, setupAutoUpdaterEvents }
