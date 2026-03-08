import type { Category, ClipboardItem, ClipboardStats } from '@/types/index'

export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}

export const getClipboardItems = async (): Promise<ClipboardItem[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.getClipboardItems()
}

export const saveItem = async (content: string): Promise<number> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return -1
  }
  return await window.electronAPI!.saveItem(content)
}

export const deleteItem = async (id: number): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.deleteItem(id)
}

export const pasteItem = async (id: number): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.pasteItem(id)
}

export const updateItem = async (id: number, updates: Partial<ClipboardItem>): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.updateItem(id, updates)
}

export const searchItems = async (query: string): Promise<ClipboardItem[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.searchItems(query)
}

export const getFavorites = async (): Promise<ClipboardItem[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.getFavorites()
}

export const getStats = async (): Promise<ClipboardStats> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return { total: 0, favorites: 0, today: 0 }
  }
  return await window.electronAPI!.getStats()
}

export const clearAllItems = async (): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.clearAllItems()
}

export const getCategories = async (): Promise<Category[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.getCategories()
}

export const createCategory = async (name: string): Promise<Category> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    throw new Error('Not running in Electron environment')
  }
  return await window.electronAPI!.createCategory(name)
}

export const updateCategory = async (id: number, updates: Partial<Category>): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.updateCategory(id, updates)
}

export const deleteCategory = async (id: number): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.deleteCategory(id)
}

export const getItemsByCategory = async (categoryId?: number): Promise<ClipboardItem[]> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return []
  }
  return await window.electronAPI!.getItemsByCategory(categoryId)
}

export const moveItemToCategory = async (itemId: number, categoryId?: number): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.moveItemToCategory(itemId, categoryId)
}

export const showPanel = async (): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return false
  }
  return await window.electronAPI!.showPanel()
}

export const hidePanel = (): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.hidePanel()
}

export const onShowPanel = (callback: () => void): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.onShowPanel(callback)
}

export const onHidePanel = (callback: () => void): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.onHidePanel(callback)
}

export const onClipboardChange = (callback: (item: { content: string }) => void): void => {
  if (!isElectron()) {
    console.warn('Not running in Electron environment')
    return
  }
  window.electronAPI!.onClipboardChange(callback)
}
