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
  getClipboardItems: (limit: number, offset: number) => Promise<ClipboardItem[]>
  saveItem: (content: string) => Promise<number>
  deleteItem: (id: number) => Promise<boolean>
  pasteItem: (id: number) => Promise<boolean>

  // 面板控制
  onShowPanel: (callback: () => void) => void
  onHidePanel: (callback: () => void) => void
  hidePanel: () => void

  // 剪贴板监听
  onClipboardChange: (callback: (item: { content: string }) => void) => void
}

const electronAPI: ElectronAPI = {
  // 剪贴板操作
  getClipboardItems: (limit: number, offset: number) =>
    ipcRenderer.invoke('clipboard:getItems', limit, offset),
  saveItem: (content: string) => ipcRenderer.invoke('clipboard:saveItem', content),
  deleteItem: (id: number) => ipcRenderer.invoke('clipboard:deleteItem', id),
  pasteItem: (id: number) => ipcRenderer.invoke('clipboard:pasteItem', id),

  // 面板控制
  onShowPanel: (callback: () => void) => ipcRenderer.on('show-panel', callback),
  onHidePanel: (callback: () => void) => ipcRenderer.on('hide-panel', callback),
  hidePanel: () => ipcRenderer.send('panel:hide'),

  // 剪贴板监听
  onClipboardChange: (callback: (item: { content: string }) => void) =>
    ipcRenderer.on('clipboard:changed', (_event, item) => callback(item)),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type { ElectronAPI, ClipboardItem }
