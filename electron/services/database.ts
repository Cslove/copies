import * as path from 'path'
import * as crypto from 'crypto'
import * as fs from 'fs'
import { app } from 'electron'

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

interface ClipboardData {
  clipboard_items: ClipboardItem[]
}

class StorageManager {
  private dataPath: string
  private data: ClipboardData
  private nextId: number

  constructor() {
    // 获取用户数据目录
    const userDataPath = app.getPath('userData')
    this.dataPath = path.join(userDataPath, 'clipboard_data.json')
    this.data = { clipboard_items: [] }
    this.nextId = 1
  }

  public init(): void {
    try {
      // 确保目录存在
      const userDataPath = app.getPath('userData')
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true })
      }

      // 如果文件存在，加载数据
      if (fs.existsSync(this.dataPath)) {
        this.loadData()
      } else {
        // 创建新文件
        this.saveData()
      }

      // 计算下一个 ID
      if (this.data.clipboard_items.length > 0) {
        const maxId = Math.max(...this.data.clipboard_items.map(item => item.id))
        this.nextId = maxId + 1
      }

      console.log('JSON storage initialized at:', this.dataPath)
    } catch (error) {
      console.error('Failed to initialize storage:', error)
      throw error
    }
  }

  private loadData(): void {
    try {
      const content = fs.readFileSync(this.dataPath, 'utf-8')
      this.data = JSON.parse(content) as ClipboardData
      
      // 验证数据结构
      if (!Array.isArray(this.data.clipboard_items)) {
        console.warn('Invalid data structure, resetting')
        this.data = { clipboard_items: [] }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = { clipboard_items: [] }
    }
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (error) {
      console.error('Error saving data:', error)
      throw error
    }
  }

  public async saveItem(content: string): Promise<number> {
    const contentHash = this.generateHash(content)
    const preview = this.generatePreview(content)
    const now = Date.now()

    try {
      // 检查是否已存在相同内容
      const existingItem = this.data.clipboard_items.find(
        item => item.content_hash === contentHash
      )

      if (existingItem) {
        // 如果已存在，更新使用次数和时间戳
        existingItem.used_count += 1
        existingItem.updated_at = now
        this.saveData()
        return existingItem.id
      }

      // 创建新项目
      const newItem: ClipboardItem = {
        id: this.nextId++,
        content,
        content_hash: contentHash,
        preview,
        is_favorite: false,
        is_pinned: false,
        created_at: now,
        updated_at: now,
        used_count: 1,
      }

      this.data.clipboard_items.unshift(newItem)
      this.saveData()
      return newItem.id
    } catch (error) {
      console.error('Error saving item:', error)
      throw error
    }
  }

  public async getItemById(id: number): Promise<ClipboardItem | null> {
    try {
      const item = this.data.clipboard_items.find(item => item.id === id)
      return item || null
    } catch (error) {
      console.error('Error getting item by id:', error)
      throw error
    }
  }

  public async getItems(limit: number = 50, offset: number = 0): Promise<ClipboardItem[]> {
    try {
      // 按照置顶状态和创建时间排序
      const sortedItems = [...this.data.clipboard_items].sort((a, b) => {
        // 置顶的排在前面
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned ? 1 : -1
        }
        // 创建时间降序
        return b.created_at - a.created_at
      })
      return sortedItems.slice(offset, offset + limit)
    } catch (error) {
      console.error('Error getting items:', error)
      throw error
    }
  }

  public async getAllItems(): Promise<ClipboardItem[]> {
    try {
      return [...this.data.clipboard_items].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned ? 1 : -1
        }
        return b.created_at - a.created_at
      })
    } catch (error) {
      console.error('Error getting all items:', error)
      throw error
    }
  }

  public async deleteItem(id: number): Promise<boolean> {
    try {
      const initialLength = this.data.clipboard_items.length
      this.data.clipboard_items = this.data.clipboard_items.filter(item => item.id !== id)
      const deleted = this.data.clipboard_items.length < initialLength
      
      if (deleted) {
        this.saveData()
      }
      
      return deleted
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }

  public async updateItem(id: number, updates: Partial<ClipboardItem>): Promise<boolean> {
    try {
      const item = this.data.clipboard_items.find(item => item.id === id)
      
      if (!item) {
        return false
      }

      // 更新字段
      if (updates.content !== undefined) {
        item.content = updates.content
      }
      if (updates.preview !== undefined) {
        item.preview = updates.preview
      }
      if (updates.is_favorite !== undefined) {
        item.is_favorite = updates.is_favorite
      }
      if (updates.is_pinned !== undefined) {
        item.is_pinned = updates.is_pinned
      }
      
      item.updated_at = Date.now()
      this.saveData()
      
      return true
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  public async clearAllItems(): Promise<boolean> {
    try {
      this.data.clipboard_items = []
      this.nextId = 1
      this.saveData()
      return true
    } catch (error) {
      console.error('Error clearing all items:', error)
      throw error
    }
  }

  public async searchItems(query: string, limit: number = 50): Promise<ClipboardItem[]> {
    try {
      const lowerQuery = query.toLowerCase()
      const items = this.data.clipboard_items
        .filter(
          item =>
            item.content.toLowerCase().includes(lowerQuery) ||
            item.preview.toLowerCase().includes(lowerQuery)
        )
        .sort((a, b) => {
          // 先按使用次数降序
          if (b.used_count !== a.used_count) {
            return b.used_count - a.used_count
          }
          // 再按创建时间降序
          return b.created_at - a.created_at
        })
        .slice(0, limit)

      return items
    } catch (error) {
      console.error('Error searching items:', error)
      throw error
    }
  }

  public async getFavorites(): Promise<ClipboardItem[]> {
    try {
      const items = this.data.clipboard_items
        .filter(item => item.is_favorite)
        .sort((a, b) => b.created_at - a.created_at)
      
      return items
    } catch (error) {
      console.error('Error getting favorites:', error)
      throw error
    }
  }

  public async getStats(): Promise<{ total: number; favorites: number; today: number }> {
    try {
      const total = this.data.clipboard_items.length

      const favorites = this.data.clipboard_items.filter(item => item.is_favorite).length

      const today = Date.now()
      const startOfDay = new Date(today).setHours(0, 0, 0, 0)
      const todayCount = this.data.clipboard_items.filter(item => item.created_at >= startOfDay).length

      return {
        total,
        favorites,
        today: todayCount,
      }
    } catch (error) {
      console.error('Error getting stats:', error)
      throw error
    }
  }

  private generateHash(content: string): string {
    // 使用 Node.js 内置的 crypto 模块生成 SHA256 哈希
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  private generatePreview(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength) + '...'
  }

  public close(): void {
    // JSON 文件存储不需要关闭连接
    console.log('Storage manager closed')
  }
}

export const storageManager = new StorageManager()
export type { ClipboardItem }