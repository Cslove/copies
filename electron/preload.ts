import { contextBridge, ipcRenderer } from 'electron'
import { createProxy } from './utils/ipcProxy'
import { onIpcEvent } from './utils/ipcEventManager'
import type { ElectronAPI, UpdateInfo, UpdateProgress, UpdateError, ClipboardItem } from '../types/index'
import type { StorageManager } from './services/database'
import type { PanelManager } from './managers/panel'
import type { UpdateManager } from './managers/update'

const storageProxy = createProxy<StorageManager>('StorageManager', [
  'getItems',
  'saveItem',
  'deleteItem',
  'getItemById',
  'updateItem',
  'searchItems',
  'getFavorites',
  'getStats',
  'clearAllItems',
])

const panelProxy = createProxy<PanelManager>('PanelManager', ['showPanel', 'hidePanel'])

const updateProxy = createProxy<UpdateManager>('UpdateManager', [
  'checkForUpdates',
  'downloadUpdate',
  'installUpdate',
  'openUpdateFolder',
])

const electronAPI: ElectronAPI = {
  getClipboardItems: () => storageProxy.getItems(),
  saveItem: (content: string) => storageProxy.saveItem(content),
  deleteItem: (id: number) => storageProxy.deleteItem(id),
  pasteItem: (id: number) => ipcRenderer.invoke('clipboard:pasteItem', id),
  updateItem: (id: number, updates: Partial<ClipboardItem>) => storageProxy.updateItem(id, updates),
  searchItems: (query: string) => storageProxy.searchItems(query),
  getFavorites: () => storageProxy.getFavorites(),
  getStats: () => storageProxy.getStats(),
  clearAllItems: () => storageProxy.clearAllItems(),

  showPanel: () => panelProxy.showPanel(),
  hidePanel: () => panelProxy.hidePanel(),
  onShowPanel: (callback: () => void) => onIpcEvent('show-panel', callback),
  onHidePanel: (callback: () => void) => onIpcEvent('hide-panel', callback),

  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),

  onClipboardChange: (callback: (item: { content: string }) => void) =>
    onIpcEvent('clipboard:changed', (item: { content: string }) => callback(item)),

  checkForUpdates: () => updateProxy.checkForUpdates(),
  downloadUpdate: () => updateProxy.downloadUpdate(),
  installUpdate: () => updateProxy.installUpdate(),
  openUpdateFolder: (folderPath?: string) => updateProxy.openUpdateFolder(folderPath),
  onUpdateChecking: (callback: () => void) => onIpcEvent('update:checking', callback),
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:available', (info: UpdateInfo) => callback(info)),
  onUpdateNotAvailable: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:not-available', (info: UpdateInfo) => callback(info)),
  onUpdateProgress: (callback: (progress: UpdateProgress) => void) => onIpcEvent('update:progress', (progress: UpdateProgress) => callback(progress)),
  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => onIpcEvent('update:downloaded', (info: UpdateInfo) => callback(info)),
  onUpdateError: (callback: (error: UpdateError) => void) => onIpcEvent('update:error', (error: UpdateError) => callback(error)),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type { ElectronAPI }
