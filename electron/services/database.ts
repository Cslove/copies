import Database from 'better-sqlite3'
import * as path from 'path'
import * as crypto from 'crypto'
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

class StorageManager {
  private db: Database.Database | null = null
  private dbPath: string

  constructor() {
    // 获取用户数据目录
    const userDataPath = app.getPath('userData')
    this.dbPath = path.join(userDataPath, 'clipboard.db')
  }

  public init(): void {
    try {
      // 确保目录存在
      import('fs').then(fs => {
        const userDataPath = app.getPath('userData')
        if (!fs.existsSync(userDataPath)) {
          fs.mkdirSync(userDataPath, { recursive: true })
        }
      })

      this.db = new Database(this.dbPath)
      this.createTables()
      this.createIndexes()
      console.log('SQLite database initialized at:', this.dbPath)
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }

  private createTables(): void {
    if (!this.db) return

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS clipboard_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        content_hash VARCHAR(64) NOT NULL UNIQUE,
        preview TEXT,
        is_favorite BOOLEAN DEFAULT 0,
        is_pinned BOOLEAN DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        used_count INTEGER DEFAULT 0
      )
    `)
  }

  private createIndexes(): void {
    if (!this.db) return

    // 创建索引以提高查询性能
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_created_at ON clipboard_items(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_favorite ON clipboard_items(is_favorite);
      CREATE INDEX IF NOT EXISTS idx_pinned ON clipboard_items(is_pinned);
      CREATE INDEX IF NOT EXISTS idx_content_hash ON clipboard_items(content_hash);
    `)
  }

  public async saveItem(content: string): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    const contentHash = this.generateHash(content)
    const preview = this.generatePreview(content)
    const now = Date.now()

    try {
      // 检查是否已存在相同内容
      const existingItem = this.db
        .prepare('SELECT id, used_count FROM clipboard_items WHERE content_hash = ?')
        .get(contentHash) as { id: number; used_count: number } | undefined

      if (existingItem) {
        // 如果已存在，更新使用次数和时间戳
        this.db
          .prepare(
            'UPDATE clipboard_items SET used_count = used_count + 1, updated_at = ? WHERE id = ?'
          )
          .run(now, existingItem.id)
        return existingItem.id
      }

      // 创建新项目
      const result = this.db
        .prepare(
          'INSERT INTO clipboard_items (content, content_hash, preview, created_at, updated_at, used_count) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .run(content, contentHash, preview, now, now, 1)

      return result.lastInsertRowid as number
    } catch (error) {
      console.error('Error saving item:', error)
      throw error
    }
  }

  public async getItemById(id: number): Promise<ClipboardItem | null> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const item = this.db.prepare('SELECT * FROM clipboard_items WHERE id = ?').get(id) as ClipboardItem | undefined
      return item || null
    } catch (error) {
      console.error('Error getting item by id:', error)
      throw error
    }
  }

  public async getItems(limit: number = 50, offset: number = 0): Promise<ClipboardItem[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const items = this.db
        .prepare(
          'SELECT * FROM clipboard_items ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?'
        )
        .all(limit, offset) as ClipboardItem[]

      return items
    } catch (error) {
      console.error('Error getting items:', error)
      throw error
    }
  }

  public async getAllItems(): Promise<ClipboardItem[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const items = this.db
        .prepare('SELECT * FROM clipboard_items ORDER BY is_pinned DESC, created_at DESC')
        .all() as ClipboardItem[]

      return items
    } catch (error) {
      console.error('Error getting all items:', error)
      throw error
    }
  }

  public async deleteItem(id: number): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const result = this.db.prepare('DELETE FROM clipboard_items WHERE id = ?').run(id)
      return result.changes > 0
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }

  public async updateItem(id: number, updates: Partial<ClipboardItem>): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const setClauses: string[] = []
      const values: (string | number | boolean | Date)[] = []

      if (updates.content !== undefined) {
        setClauses.push('content = ?')
        values.push(updates.content)
      }
      if (updates.preview !== undefined) {
        setClauses.push('preview = ?')
        values.push(updates.preview)
      }
      if (updates.is_favorite !== undefined) {
        setClauses.push('is_favorite = ?')
        values.push(updates.is_favorite ? 1 : 0)
      }
      if (updates.is_pinned !== undefined) {
        setClauses.push('is_pinned = ?')
        values.push(updates.is_pinned ? 1 : 0)
      }

      setClauses.push('updated_at = ?')
      values.push(Date.now())

      values.push(id)

      const query = `UPDATE clipboard_items SET ${setClauses.join(', ')} WHERE id = ?`
      const result = this.db.prepare(query).run(...values)

      return result.changes > 0
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  public async clearAllItems(): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      this.db.prepare('DELETE FROM clipboard_items').run()
      return true
    } catch (error) {
      console.error('Error clearing all items:', error)
      throw error
    }
  }

  public async searchItems(query: string, limit: number = 50): Promise<ClipboardItem[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const searchQuery = `%${query.toLowerCase()}%`
      const items = this.db
        .prepare(
          'SELECT * FROM clipboard_items WHERE LOWER(content) LIKE ? OR LOWER(preview) LIKE ? ORDER BY used_count DESC, created_at DESC LIMIT ?'
        )
        .all(searchQuery, searchQuery, limit) as ClipboardItem[]

      return items
    } catch (error) {
      console.error('Error searching items:', error)
      throw error
    }
  }

  public async getFavorites(): Promise<ClipboardItem[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const items = this.db
        .prepare('SELECT * FROM clipboard_items WHERE is_favorite = 1 ORDER BY created_at DESC')
        .all() as ClipboardItem[]

      return items
    } catch (error) {
      console.error('Error getting favorites:', error)
      throw error
    }
  }

  public async getStats(): Promise<{ total: number; favorites: number; today: number }> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const total = (this.db.prepare('SELECT COUNT(*) as count FROM clipboard_items').get() as { count: number }).count

      const favorites = (this.db.prepare('SELECT COUNT(*) as count FROM clipboard_items WHERE is_favorite = 1').get() as { count: number }).count

      const today = Date.now()
      const startOfDay = new Date(today).setHours(0, 0, 0, 0)
      const todayCount = (this.db.prepare('SELECT COUNT(*) as count FROM clipboard_items WHERE created_at >= ?').get(startOfDay) as { count: number }).count

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
    if (this.db) {
      this.db.close()
      this.db = null
      console.log('Database connection closed')
    }
  }
}

export const storageManager = new StorageManager()
export type { ClipboardItem }