import { contextBridge, ipcRenderer } from 'electron'
import { onIpcEvent } from './utils/ipcEventManager'
import type { ElectronAPI, UpdateInfo, UpdateProgress, UpdateError, ClipboardItem } from '../types/index'

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
  onShowPanel: (callback: () => void) => onIpcEvent('show-panel', callback),
  onHidePanel: (callback: () => void) => onIpcEvent('hide-panel', callback),

  // 剪贴板监听
  onClipboardChange: (callback: (item: { content: string }) => void) =>
    onIpcEvent('clipboard:changed', (item: { content: string }) => callback(item)),

  // 自动更新
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onUpdateChecking: (callback: () => void) => onIpcEvent('update:checking', callback),
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:available', (info: UpdateInfo) => callback(info)),
  onUpdateNotAvailable: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:not-available', (info: UpdateInfo) => callback(info)),
  onUpdateProgress: (callback: (progress: UpdateProgress) => void) => onIpcEvent('update:progress', (progress: UpdateProgress) => callback(progress)),
  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:downloaded', (info: UpdateInfo) => callback(info)),
  onUpdateError: (callback: (error: UpdateError) => void) => onIpcEvent('update:error', (error: UpdateError) => callback(error)),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type { ElectronAPI }
