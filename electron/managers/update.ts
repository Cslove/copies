import { autoUpdater } from 'electron-updater'
import { expose, registerInstance } from '../utils/ipcProxy'

let downloadedFilePath: string | null = null

class UpdateManager {
  constructor() {
    autoUpdater.autoDownload = false
  }

  @expose('UpdateManager')
  public async checkForUpdates(): Promise<any> {
    try {
      return await autoUpdater.checkForUpdates()
    } catch (error) {
      console.error('检查更新失败:', error)
      throw error
    }
  }

  @expose('UpdateManager')
  public async downloadUpdate(): Promise<boolean> {
    try {
      await autoUpdater.downloadUpdate()
      return true
    } catch (error) {
      console.error('下载更新失败:', error)
      throw error
    }
  }

  @expose('UpdateManager')
  public async installUpdate(): Promise<boolean> {
    try {
      autoUpdater.quitAndInstall()
      return true
    } catch (error) {
      console.error('安装更新失败:', error)
      throw error
    }
  }

  @expose('UpdateManager')
  public async openUpdateFolder(customFolderPath?: string): Promise<boolean> {
    try {
      const { shell } = await import('electron')
      
      if (customFolderPath) {
        shell.openPath(customFolderPath)
        return true
      }
      
      if (downloadedFilePath) {
        const folderPath = downloadedFilePath.substring(0, downloadedFilePath.lastIndexOf('/'))
        shell.openPath(folderPath)
        return true
      }
      return false
    } catch (error) {
      console.error('打开更新文件夹失败:', error)
      throw error
    }
  }

  public setupEvents(mainWindow: any): void {
    autoUpdater.on('checking-for-update', () => {
      if (mainWindow) {
        mainWindow.webContents.send('update:checking')
      }
    })

    autoUpdater.on('update-available', info => {
      if (mainWindow) {
        mainWindow.webContents.send('update:available', info)
      }
    })

    autoUpdater.on('update-not-available', info => {
      if (mainWindow) {
        mainWindow.webContents.send('update:not-available', info)
      }
    })

    autoUpdater.on('download-progress', progress => {
      if (mainWindow) {
        mainWindow.webContents.send('update:progress', progress)
      }
    })

    autoUpdater.on('update-downloaded', info => {
      downloadedFilePath = (info as any).downloadedFile || null
      if (mainWindow) {
        mainWindow.webContents.send('update:downloaded', info)
      }
    })

    autoUpdater.on('error', error => {
      if (mainWindow) {
        mainWindow.webContents.send('update:error', error)
      }
    })
  }
}

export const updateManager = new UpdateManager()
registerInstance(updateManager, 'UpdateManager')
export type { UpdateManager }
