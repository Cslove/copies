import { globalShortcut, BrowserWindow } from 'electron'

class HotkeyManager {
  private registeredShortcuts: string[] = []
  private mainWindow: BrowserWindow | null = null

  public registerGlobalShortcuts(mainWindow: BrowserWindow | null): void {
    this.mainWindow = mainWindow

    // 注册显示历史面板的快捷键 (Cmd+Shift+V)
    const showPanelShortcut = 'CommandOrControl+Shift+V'

    const success = globalShortcut.register(showPanelShortcut, () => {
      console.log('Global shortcut triggered: Cmd+Shift+V')
      this.togglePanel()
    })

    if (success) {
      this.registeredShortcuts.push(showPanelShortcut)
      console.log(`Registered global shortcut: ${showPanelShortcut}`)
    } else {
      console.error(`Failed to register global shortcut: ${showPanelShortcut}`)
    }

    // 注册隐藏面板的快捷键 (Esc)
    const hidePanelShortcut = 'Escape'
    const hideSuccess = globalShortcut.register(hidePanelShortcut, () => {
      console.log('Global shortcut triggered: Escape')
      this.hidePanelInternal()
    })

    if (hideSuccess) {
      this.registeredShortcuts.push(hidePanelShortcut)
      console.log(`Registered global shortcut: ${hidePanelShortcut}`)
    } else {
      console.error(`Failed to register global shortcut: ${hidePanelShortcut}`)
    }
  }

  private togglePanel(): void {
    if (!this.mainWindow) {
      console.warn('Main window not available')
      return
    }

    if (this.mainWindow.isVisible()) {
      this.hidePanelInternal()
    } else {
      this.showPanelInternal()
    }
  }

  private showPanelInternal(): void {
    if (!this.mainWindow) {
      console.warn('Main window not available')
      return
    }

    this.mainWindow.show()
    this.mainWindow.center()
    this.mainWindow.focus()
    console.log('Panel shown')
  }

  private hidePanelInternal(): void {
    if (!this.mainWindow) {
      console.warn('Main window not available')
      return
    }

    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide()
      console.log('Panel hidden')
    }
  }

  public unregisterAllShortcuts(): void {
    globalShortcut.unregisterAll()
    this.registeredShortcuts = []
    this.mainWindow = null
    console.log('Unregistered all global shortcuts')
  }

  public getRegisteredShortcuts(): string[] {
    return [...this.registeredShortcuts]
  }
}

export const hotkeyManager = new HotkeyManager()
