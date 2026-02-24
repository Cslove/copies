import { globalShortcut } from 'electron'

class HotkeyManager {
  private registeredShortcuts: string[] = []

  public registerGlobalShortcuts(): void {
    // 注册显示历史面板的快捷键 (Cmd+Shift+V)
    const showPanelShortcut = 'CommandOrControl+Shift+V'

    const success = globalShortcut.register(showPanelShortcut, () => {
      console.log('Global shortcut triggered: Cmd+Shift+V')
      // 注意：这里不能直接访问 mainWindow，因为会产生循环依赖
      // 我们将通过 IPC 发送消息到渲染进程
      // 在实际应用中，这将在主进程中处理
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
      // 在实际应用中，这将在主进程中处理
    })

    if (hideSuccess) {
      this.registeredShortcuts.push(hidePanelShortcut)
      console.log(`Registered global shortcut: ${hidePanelShortcut}`)
    } else {
      console.error(`Failed to register global shortcut: ${hidePanelShortcut}`)
    }
  }

  public unregisterAllShortcuts(): void {
    globalShortcut.unregisterAll()
    this.registeredShortcuts = []
    console.log('Unregistered all global shortcuts')
  }

  public getRegisteredShortcuts(): string[] {
    return [...this.registeredShortcuts]
  }
}

export const hotkeyManager = new HotkeyManager()
