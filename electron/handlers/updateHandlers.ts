import { BrowserWindow } from 'electron'
import { updateManager } from '../managers/update'

export function registerUpdateHandlers(_mainWindow: BrowserWindow | null) {
}

export function setupAutoUpdaterEvents(mainWindow: BrowserWindow | null) {
  updateManager.setupEvents(mainWindow)
}
