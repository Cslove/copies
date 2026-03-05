import { ipcRenderer, IpcRendererEvent } from 'electron'

export class IpcEventManager {
  private listeners: Map<string, Array<{ listener: (...args: any[]) => void; originalCallback: (...args: any[]) => void }>> = new Map()

  on<T = any>(channel: string, callback: (...args: T[]) => void): () => void {
    const listener = (_event: IpcRendererEvent, ...args: T[]) => callback(...args)
    
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, [])
    }
    
    this.listeners.get(channel)!.push({ listener, originalCallback: callback })
    ipcRenderer.on(channel, listener)
    
    return () => this.removeListener(channel, callback)
  }

  once<T = any>(channel: string, callback: (...args: T[]) => void): () => void {
    const listener = (_event: IpcRendererEvent, ...args: T[]) => {
      callback(...args)
      this.removeListener(channel, callback)
    }
    
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, [])
    }
    
    this.listeners.get(channel)!.push({ listener, originalCallback: callback })
    ipcRenderer.once(channel, listener)
    
    return () => this.removeListener(channel, callback)
  }

  private removeListener<T = any>(channel: string, callback: (...args: T[]) => void): void {
    const channelListeners = this.listeners.get(channel)
    if (!channelListeners) return
    
    const index = channelListeners.findIndex(item => item.originalCallback === callback)
    if (index === -1) return
    
    const { listener } = channelListeners[index]
    ipcRenderer.removeListener(channel, listener)
    channelListeners.splice(index, 1)
    
    if (channelListeners.length === 0) {
      this.listeners.delete(channel)
    }
  }

  removeAllListeners(channel: string): void {
    const channelListeners = this.listeners.get(channel)
    if (!channelListeners) return
    
    channelListeners.forEach(({ listener }) => {
      ipcRenderer.removeListener(channel, listener)
    })
    
    this.listeners.delete(channel)
  }

  clear(): void {
    this.listeners.forEach((channelListeners, channel) => {
      channelListeners.forEach(({ listener }) => {
        ipcRenderer.removeListener(channel, listener)
      })
    })
    this.listeners.clear()
  }
}

export const ipcEventManager = new IpcEventManager()

export function onIpcEvent<T = any>(channel: string, callback: (...args: T[]) => void): () => void {
  return ipcEventManager.on(channel, callback)
}

export function onceIpcEvent<T = any>(channel: string, callback: (...args: T[]) => void): () => void {
  return ipcEventManager.once(channel, callback)
}
