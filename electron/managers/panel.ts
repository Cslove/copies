import { BrowserWindow } from 'electron'
import { hotkeyManager } from './hotkey'
import { expose, registerInstance } from '../utils/ipcProxy'

class PanelManager {
  private mainWindow: BrowserWindow | null = null

  public setMainWindow(mainWindow: BrowserWindow | null): void {
    this.mainWindow = mainWindow
  }

  @expose()
  public async showPanel(): Promise<boolean> {
    hotkeyManager.showPanel()
    return true
  }

  @expose()
  public async hidePanel(): Promise<boolean> {
    if (this.mainWindow) {
      this.mainWindow.hide()
    }
    return true
  }
}

export const panelManager = new PanelManager()
registerInstance(panelManager, 'PanelManager')
export type { PanelManager }
