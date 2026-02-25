import * as crypto from 'crypto'

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

class StorageManager {
  private items: Map<number, ClipboardItem> = new Map()
  private nextId: number = 1

  constructor() {
    console.log('Memory-based storage manager initialized')
  }

  public async saveItem(content: string): Promise<number> {
    const contentHash = this.generateHash(content)
    const preview = this.generatePreview(content)
    const now = Date.now()

    // 检查是否已存在相同内容
    for (const [id, item] of this.items.entries()) {
      if (item.content_hash === contentHash) {
        // 如果已存在，更新使用次数和时间戳
        const updatedItem = {
          ...item,
          used_count: item.used_count + 1,
          updated_at: now,
        }
        this.items.set(id, updatedItem)
        return id
      }
    }

    // 创建新项目
    const newItem: ClipboardItem = {
      id: this.nextId,
      content,
      content_hash: contentHash,
      preview,
      is_favorite: false,
      is_pinned: false,
      created_at: now,
      updated_at: now,
      used_count: 1,
    }
    console.log('Saving new item with content', newItem)
    this.items.set(this.nextId, newItem)
    const savedId = this.nextId
    this.nextId++

    return savedId
  }

  public async getItemById(id: number): Promise<ClipboardItem | null> {
    return this.items.get(id) || null
  }

  public async getItems(limit: number = 50, offset: number = 0): Promise<ClipboardItem[]> {
    const allItems = Array.from(this.items.values()).sort((a, b) => b.created_at - a.created_at) // 按创建时间倒序排列

    return allItems.slice(offset, offset + limit)
  }

  public async getAllItems(): Promise<ClipboardItem[]> {
    return Array.from(this.items.values()).sort((a, b) => b.created_at - a.created_at)
  }

  public async deleteItem(id: number): Promise<boolean> {
    return this.items.delete(id)
  }

  public async updateItem(id: number, updates: Partial<ClipboardItem>): Promise<boolean> {
    const item = this.items.get(id)
    if (!item) return false

    const updatedItem = {
      ...item,
      ...updates,
      updated_at: Date.now(),
    } as ClipboardItem

    this.items.set(id, updatedItem)
    return true
  }

  public async clearAllItems(): Promise<boolean> {
    this.items.clear()
    return true
  }

  public async searchItems(query: string, limit: number = 50): Promise<ClipboardItem[]> {
    const searchQuery = query.toLowerCase()
    const matchingItems = Array.from(this.items.values())
      .filter(
        item =>
          item.content.toLowerCase().includes(searchQuery) ||
          item.preview.toLowerCase().includes(searchQuery)
      )
      .sort((a, b) => b.used_count - a.used_count || b.created_at - a.created_at)

    return matchingItems.slice(0, limit)
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
}

export const storageManager = new StorageManager()
