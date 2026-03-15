import { globalShortcut, BrowserWindow, screen } from 'electron'

class HotkeyManager {
  private registeredShortcuts: string[] = []
  private mainWindow: BrowserWindow | null = null

  public registerGlobalShortcuts(mainWindow: BrowserWindow | null): void {
    this.mainWindow = mainWindow

    const showPanelShortcut = 'CommandOrControl+Alt+V'

    const success = globalShortcut.register(showPanelShortcut, () => {
      console.log('Global shortcut triggered: Cmd+Option+V')
      this.togglePanel()
    })

    if (success) {
      this.registeredShortcuts.push(showPanelShortcut)
      console.log(`Registered global shortcut: ${showPanelShortcut}`)
    } else {
      console.error(`Failed to register global shortcut: ${showPanelShortcut}`)
    }
  }

  public togglePanel(): void {
    if (!this.mainWindow) {
      console.warn('Main window not available')
      return
    }

    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide()
    }
    this.showPanel()
  }

  public showPanel(): void {
    if (!this.mainWindow) {
      console.warn('Main window not available')
      return
    }

    const cursorPosition = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(cursorPosition)
    const workArea = display.workArea

    const windowWidth = this.mainWindow.getBounds().width
    const windowHeight = this.mainWindow.getBounds().height

    let x = cursorPosition.x + 10
    let y = cursorPosition.y + 10

    if (x + windowWidth > workArea.x + workArea.width) {
      x = cursorPosition.x - windowWidth - 10
    }
    if (x < workArea.x) {
      x = workArea.x + 10
    }
    if (y + windowHeight > workArea.y + workArea.height) {
      y = cursorPosition.y - windowHeight - 10
    }
    if (y < workArea.y) {
      y = workArea.y + 10
    }

    this.mainWindow.setPosition(Math.floor(x), Math.floor(y))

    if (process.platform === 'darwin') {
      this.mainWindow.setVisibleOnAllWorkspaces(true)
      this.mainWindow.showInactive()
      setImmediate(() => {
        if (!this.mainWindow!.isDestroyed()) {
          this.mainWindow!.setVisibleOnAllWorkspaces(false)
        }
      })
    } else {
      this.mainWindow.showInactive()
    }
    this.mainWindow.webContents.send('show-panel')
  }

  public unregisterAllShortcuts(): void {
    globalShortcut.unregisterAll()
    this.registeredShortcuts = []
    this.mainWindow = null
  }

  public getRegisteredShortcuts(): string[] {
    return [...this.registeredShortcuts]
  }
}

export const hotkeyManager = new HotkeyManager()
