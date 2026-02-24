import { clipboard } from 'electron'
import { storageManager } from '../services/database'

class ClipboardManager {
  private watching: boolean = false
  private onChangeCallback: ((content: string) => void) | null = null
  private lastContent: string | null = null
  private watchInterval: NodeJS.Timeout | null = null

  public startWatching(): void {
    if (this.watching) return

    this.watching = true

    // 使用轮询方式监听剪贴板变化
    this.watchInterval = setInterval(() => {
      const content = this.readFromClipboard()
      if (content && content !== this.lastContent) {
        this.lastContent = content
        if (this.onChangeCallback) {
          this.onChangeCallback(content)
        }
        // 保存到数据库
        storageManager.saveItem(content)
      }
    }, 500) // 每500ms检查一次

    console.log('Clipboard watching started')
  }

  public stopWatching(): void {
    this.watching = false
    if (this.watchInterval) {
      clearInterval(this.watchInterval)
      this.watchInterval = null
    }
    console.log('Clipboard watching stopped')
  }

  public readFromClipboard(): string {
    try {
      return clipboard.readText() || ''
    } catch (error) {
      console.error('Error reading clipboard:', error)
      return ''
    }
  }

  public writeToClipboard(content: string): boolean {
    try {
      clipboard.writeText(content)
      return true
    } catch (error) {
      console.error('Error writing to clipboard:', error)
      return false
    }
  }

  public onClipboardChanged(callback: (content: string) => void): void {
    this.onChangeCallback = callback
  }
}

export const clipboardManager = new ClipboardManager()
