/**
 * IPC 调用封装工具
 * 提供类型安全的 Electron IPC 通信方法
 */

import type { ClipboardItem, ClipboardStats } from '../../types'

/**
 * 检查是否在 Electron 环境中
 */
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}

/**
 * 获取剪贴板项目列表
 */
export const getClipboardItems = async (
  limit: number = 50,
  offset: number = 0
): Promise<ClipboardItem[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.getClipboardItems(limit, offset)
}

/**
 * 保存剪贴板项目
 */
export const saveItem = async (content: string): Promise<number> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return -1
  }
  return await window.electronAPI!.saveItem(content)
}

/**
 * 删除剪贴板项目
 */
export const deleteItem = async (id: number): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.deleteItem(id)
}

/**
 * 粘贴剪贴板项目
 */
export const pasteItem = async (id: number): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.pasteItem(id)
}

/**
 * 更新剪贴板项目
 */
export const updateItem = async (id: number, updates: Partial<ClipboardItem>): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.updateItem(id, updates)
}

/**
 * 搜索剪贴板项目
 */
export const searchItems = async (query: string, limit: number = 50): Promise<ClipboardItem[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.searchItems(query, limit)
}

/**
 * 获取收藏的项目
 */
export const getFavorites = async (): Promise<ClipboardItem[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.getFavorites()
}

/**
 * 获取统计数据
 */
export const getStats = async (): Promise<ClipboardStats> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return { total: 0, favorites: 0, today: 0 }
  }
  return await window.electronAPI!.getStats()
}

/**
 * 清空所有项目
 */
export const clearAllItems = async (): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.clearAllItems()
}

/**
 * 显示面板
 */
export const showPanel = async (): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.showPanel()
}

/**
 * 隐藏面板
 */
export const hidePanel = (): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.hidePanel()
}

/**
 * 监听显示面板事件
 */
export const onShowPanel = (callback: () => void): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.onShowPanel(callback)
}

/**
 * 监听隐藏面板事件
 */
export const onHidePanel = (callback: () => void): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.onHidePanel(callback)
}

/**
 * 监听剪贴板变化事件
 */
export const onClipboardChange = (callback: (item: { content: string }) => void): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.onClipboardChange(callback)
}
