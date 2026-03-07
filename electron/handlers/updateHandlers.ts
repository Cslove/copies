import { ipcMain, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

// 保存下载文件的路径
let downloadedFilePath: string | null = null

/**
 * 注册自动更新相关的 IPC 处理器
 * @param mainWindow 主窗口实例
 */
export function registerUpdateHandlers(_mainWindow: BrowserWindow | null) {
  // 检查更新
  ipcMain.handle('update:check', async () => {
    try {
      return await autoUpdater.checkForUpdates()
    } catch (error) {
      console.error('检查更新失败:', error)
      throw error
    }
  })

  // 下载更新
  ipcMain.handle('update:download', async () => {
    try {
      await autoUpdater.downloadUpdate()
      return true
    } catch (error) {
      console.error('下载更新失败:', error)
      throw error
    }
  })

  // 安装更新
  ipcMain.handle('update:install', async () => {
    try {
      autoUpdater.quitAndInstall()
      return true
    } catch (error) {
      console.error('安装更新失败:', error)
      throw error
    }
  })

  // 打开更新文件夹
  ipcMain.handle('update:openFolder', async (_event, customFolderPath?: string) => {
    try {
      const { shell } = await import('electron')
      
      // 如果传入了自定义路径，直接使用
      if (customFolderPath) {
        shell.openPath(customFolderPath)
        return true
      }
      
      // 否则使用从 update-downloaded 事件中保存的下载文件路径
      if (downloadedFilePath) {
        // 获取文件所在目录
        const folderPath = downloadedFilePath.substring(0, downloadedFilePath.lastIndexOf('/'))
        shell.openPath(folderPath)
        return true
      }
      return false
    } catch (error) {
      console.error('打开更新文件夹失败:', error)
      throw error
    }
  })
}

/**
 * 配置自动更新事件监听
 * @param mainWindow 主窗口实例
 */
export function setupAutoUpdaterEvents(mainWindow: BrowserWindow | null) {
  // 设置自动下载更新
  autoUpdater.autoDownload = false

  // 检查更新事件
  autoUpdater.on('checking-for-update', () => {
    if (mainWindow) {
      mainWindow.webContents.send('update:checking')
    }
  })

  // 发现可用更新
  autoUpdater.on('update-available', info => {
    if (mainWindow) {
      mainWindow.webContents.send('update:available', info)
    }
  })

  // 没有可用更新
  autoUpdater.on('update-not-available', info => {
    if (mainWindow) {
      mainWindow.webContents.send('update:not-available', info)
    }
  })

  // 下载进度
  autoUpdater.on('download-progress', progress => {
    if (mainWindow) {
      mainWindow.webContents.send('update:progress', progress)
    }
  })

  // 更新下载完成
  autoUpdater.on('update-downloaded', info => {
    // 保存下载文件路径
    downloadedFilePath = (info as any).downloadedFile || null
    if (mainWindow) {
      mainWindow.webContents.send('update:downloaded', info)
    }
  })

  // 更新错误
  autoUpdater.on('error', error => {
    if (mainWindow) {
      mainWindow.webContents.send('update:error', error)
    }
  })
}
