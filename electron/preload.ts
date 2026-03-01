import { contextBridge, ipcRenderer } from 'electron'

interface ClipboardItem {
  id: number
  content: string
  content_hash: string
  preview: string
  is_favorite: boolean
  is_pinned: boolean
  created_at: number
  updated_at: number
  used_count: number
}

interface ElectronAPI {
  // 剪贴板操作
  getClipboardItems: (limit?: number, offset?: number) => Promise<ClipboardItem[]>
  saveItem: (content: string) => Promise<number>
  deleteItem: (id: number) => Promise<boolean>
  pasteItem: (id: number) => Promise<boolean>
  updateItem: (id: number, updates: Partial<ClipboardItem>) => Promise<boolean>
  searchItems: (query: string, limit?: number) => Promise<ClipboardItem[]>
  getFavorites: () => Promise<ClipboardItem[]>
  getStats: () => Promise<{ total: number; favorites: number; today: number }>
  clearAllItems: () => Promise<boolean>

  // 面板控制
  showPanel: () => Promise<boolean>
  hidePanel: () => void
  onShowPanel: (callback: () => void) => void
  onHidePanel: (callback: () => void) => void

  // 剪贴板监听
  onClipboardChange: (callback: (item: { content: string }) => void) => void
}

const electronAPI: ElectronAPI = {
  // 剪贴板操作
  getClipboardItems: (limit: number = 50, offset: number = 0) =>
    ipcRenderer.invoke('clipboard:getItems', limit, offset),
  saveItem: (content: string) => ipcRenderer.invoke('clipboard:saveItem', content),
  deleteItem: (id: number) => ipcRenderer.invoke('clipboard:deleteItem', id),
  pasteItem: (id: number) => ipcRenderer.invoke('clipboard:pasteItem', id),
  updateItem: (id: number, updates: Partial<ClipboardItem>) =>
    ipcRenderer.invoke('clipboard:updateItem', id, updates),
  searchItems: (query: string, limit: number = 50) =>
    ipcRenderer.invoke('clipboard:searchItems', query, limit),
  getFavorites: () => ipcRenderer.invoke('clipboard:getFavorites'),
  getStats: () => ipcRenderer.invoke('clipboard:getStats'),
  clearAllItems: () => ipcRenderer.invoke('clipboard:clearAllItems'),

  // 面板控制
  showPanel: () => ipcRenderer.invoke('panel:show'),
  hidePanel: () => ipcRenderer.invoke('panel:hide'),
  onShowPanel: (callback: () => void) => ipcRenderer.on('show-panel', callback),
  onHidePanel: (callback: () => void) => ipcRenderer.on('hide-panel', callback),

  // 剪贴板监听
  onClipboardChange: (callback: (item: { content: string }) => void) =>
    ipcRenderer.on('clipboard:changed', (_event, item) => callback(item)),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type { ElectronAPI, ClipboardItem }
