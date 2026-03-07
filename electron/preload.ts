import { contextBridge, ipcRenderer } from 'electron'
import { onIpcEvent } from './utils/ipcEventManager'
import type { ElectronAPI, UpdateInfo, UpdateProgress, UpdateError, ClipboardItem } from '../types/index'

const electronAPI: ElectronAPI = {
  // 剪贴板操作
  getClipboardItems: () => ipcRenderer.invoke('clipboard:getItems'),
  saveItem: (content: string) => ipcRenderer.invoke('clipboard:saveItem', content),
  deleteItem: (id: number) => ipcRenderer.invoke('clipboard:deleteItem', id),
  pasteItem: (id: number) => ipcRenderer.invoke('clipboard:pasteItem', id),
  updateItem: (id: number, updates: Partial<ClipboardItem>) =>
    ipcRenderer.invoke('clipboard:updateItem', id, updates),
  searchItems: (query: string) => ipcRenderer.invoke('clipboard:searchItems', query),
  getFavorites: () => ipcRenderer.invoke('clipboard:getFavorites'),
  getStats: () => ipcRenderer.invoke('clipboard:getStats'),
  clearAllItems: () => ipcRenderer.invoke('clipboard:clearAllItems'),

  // 面板控制
  showPanel: () => ipcRenderer.invoke('panel:show'),
  hidePanel: () => ipcRenderer.invoke('panel:hide'),
  onShowPanel: (callback: () => void) => onIpcEvent('show-panel', callback),
  onHidePanel: (callback: () => void) => onIpcEvent('hide-panel', callback),

  // 应用信息
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),

  // 剪贴板监听
  onClipboardChange: (callback: (item: { content: string }) => void) =>
    onIpcEvent('clipboard:changed', (item: { content: string }) => callback(item)),

  // 自动更新
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  openUpdateFolder: (folderPath?: string) => ipcRenderer.invoke('update:openFolder', folderPath),
  onUpdateChecking: (callback: () => void) => onIpcEvent('update:checking', callback),
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:available', (info: UpdateInfo) => callback(info)),
  onUpdateNotAvailable: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:not-available', (info: UpdateInfo) => callback(info)),
  onUpdateProgress: (callback: (progress: UpdateProgress) => void) => onIpcEvent('update:progress', (progress: UpdateProgress) => callback(progress)),
  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:downloaded', (info: UpdateInfo) => callback(info)),
  onUpdateError: (callback: (error: UpdateError) => void) => onIpcEvent('update:error', (error: UpdateError) => callback(error)),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type { ElectronAPI }
