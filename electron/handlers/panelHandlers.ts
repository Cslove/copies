import { BrowserWindow } from 'electron'
import { panelManager } from '../managers/panel'

export function registerPanelHandlers(mainWindow: BrowserWindow | null) {
  panelManager.setMainWindow(mainWindow)
}
