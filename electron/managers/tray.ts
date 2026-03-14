import { Tray, Menu, app, nativeImage, NativeImage } from 'electron'
import * as fs from 'fs'

class TrayManager {
  private tray: Tray | null = null

  public createTray(): void {
    if (this.tray) {
      return
    }

    try {
      let iconPath = app.isPackaged
        ? `${process.resourcesPath}/build/icon.png`
        : `${process.cwd()}/build/icon.png`

      let icon: NativeImage

      if (fs.existsSync(iconPath)) {
        icon = nativeImage.createFromPath(iconPath)
      } else {
        const icnsPath = app.isPackaged
          ? `${process.resourcesPath}/build/icon.icns`
          : `${process.cwd()}/build/icon.icns`
        
        icon = nativeImage.createFromPath(icnsPath)
      }

      if (process.platform === 'darwin') {
        const standardSize = 16
        if (icon.getSize().width > standardSize || icon.getSize().height > standardSize) {
          icon = icon.resize({ width: standardSize, height: standardSize })
        }
        
        icon.setTemplateImage(true)
      }

      this.tray = new Tray(icon)
      this.tray.setToolTip('Copies - 智能剪贴板管理器')
      this.setupTrayMenu()
    } catch (error) {
      console.error('Failed to create tray:', error)
    }
  }

  private setupTrayMenu(): void {
    if (!this.tray) {
      return
    }

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开',
        click: () => {
          console.log('Open clicked')
        },
      },
      {
        label: '设置',
        click: () => {
          console.log('Settings clicked')
        },
      },
      {
        type: 'separator',
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        },
      },
    ])

    this.tray.setContextMenu(contextMenu)
  }

  public destroyTray(): void {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
  }
}

export const trayManager = new TrayManager()
