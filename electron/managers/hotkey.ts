import { globalShortcut, BrowserWindow, screen } from 'electron'

class HotkeyManager {
  private registeredShortcuts: string[] = []
  private mainWindow: BrowserWindow | null = null

  public registerGlobalShortcuts(mainWindow: BrowserWindow | null): void {
    this.mainWindow = mainWindow

    // 注册显示历史面板的快捷键 (Cmd+Option+V)
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

  private togglePanel(): void {
    if (!this.mainWindow) {
      console.warn('Main window not available')
      return
    }

    if (this.mainWindow.isVisible()) {
      return
    } else {
      this.showPanel()
    }
  }

  public showPanel(): void {
    if (!this.mainWindow) {
      console.warn('Main window not available')
      return
    }

    // 获取鼠标当前位置
    const cursorPosition = screen.getCursorScreenPoint()
    // 获取鼠标所在的屏幕
    const display = screen.getDisplayNearestPoint(cursorPosition)
    // 获取屏幕的工作区域（排除任务栏和 Dock）
    const workArea = display.workArea

    // 计算窗口位置，使其居中于鼠标所在的屏幕
    const windowWidth = this.mainWindow.getBounds().width
    const windowHeight = this.mainWindow.getBounds().height
    const x = Math.floor(workArea.x + (workArea.width - windowWidth) / 2)
    const y = Math.floor(workArea.y + (workArea.height - windowHeight) / 2)

    this.mainWindow.setPosition(Math.round(x), Math.round(y))

    if (process.platform === 'darwin') {
      // macOS 多桌面适配：临时跨越所有空间，再取消
      this.mainWindow.setVisibleOnAllWorkspaces(true)
      this.mainWindow.show()
      // 下一 tick 取消跨空间，让窗口停留在当前桌面
      setImmediate(() => {
        if (!this.mainWindow!.isDestroyed()) {
          this.mainWindow!.setVisibleOnAllWorkspaces(false)
        }
      })
    } else {
      this.mainWindow.show()
    }
    this.mainWindow.focus()
    this.mainWindow.webContents.send('show-panel')
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
