import { ipcMain, BrowserWindow } from 'electron'
import { clipboardManager } from '../managers/clipboard'
import { storageManager } from '../services/database'

/**
 * 注册剪贴板相关的 IPC 处理器
 * @param mainWindow 主窗口实例
 */
export function registerClipboardHandlers(mainWindow: BrowserWindow | null) {
  // 获取剪贴板历史记录
  ipcMain.handle('clipboard:getItems', async (_, limit: number = 50, offset: number = 0) => {
    return await storageManager.getItems(limit, offset)
  })

  // 保存剪贴板内容
  ipcMain.handle('clipboard:saveItem', async (_, content: string) => {
    return await storageManager.saveItem(content)
  })

  // 删除剪贴板项
  ipcMain.handle('clipboard:deleteItem', async (_, id: number) => {
    return await storageManager.deleteItem(id)
  })

  // 更新剪贴板项
  ipcMain.handle('clipboard:updateItem', async (_, id: number, updates: Record<string, unknown>) => {
    return await storageManager.updateItem(id, updates)
  })

  // 搜索剪贴板项
  ipcMain.handle('clipboard:searchItems', async (_, query: string, limit: number = 50) => {
    return await storageManager.searchItems(query, limit)
  })

  // 获取收藏项
  ipcMain.handle('clipboard:getFavorites', async () => {
    return await storageManager.getFavorites()
  })

  // 获取统计信息
  ipcMain.handle('clipboard:getStats', async () => {
    return await storageManager.getStats()
  })

  // 清空所有项
  ipcMain.handle('clipboard:clearAllItems', async () => {
    return await storageManager.clearAllItems()
  })

  // 粘贴剪贴板项
  ipcMain.handle('clipboard:pasteItem', async (_, id: number) => {
    const item = await storageManager.getItemById(id)
    if (item) {
      clipboardManager.writeToClipboard(item.content)
      return true
    }
    return false
  })

  // 监听剪贴板变化并发送到渲染进程
  clipboardManager.onClipboardChanged((content: string) => {
    if (mainWindow) {
      mainWindow.webContents.send('clipboard:changed', { content })
    }
  })
}
