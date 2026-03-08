import * as crypto from 'crypto'
import * as fs from 'fs'
import { app } from 'electron'
import { expose } from '../utils/ipcProxy'
import type { ClipboardItem, Category } from '../../types/index'

interface ClipboardData {
  clipboard_items: ClipboardItem[]
  categories: Category[]
}

class StorageManager {
  private dataPath: string = ''
  private data: ClipboardData = { clipboard_items: [], categories: [] }
  private nextId: number = 1
  private nextCategoryId: number = 1

  public init(): void {
    try {
      const userDataPath = app.getPath('userData')
      this.dataPath = `${userDataPath}/clipboard_data.json`
      
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true })
      }

      if (fs.existsSync(this.dataPath)) {
        this.loadData()
      } else {
        this.saveData()
        this.initializeDefaultCategory()
      }

      if (this.data.clipboard_items.length > 0) {
        const maxId = Math.max(...this.data.clipboard_items.map(item => item.id))
        this.nextId = maxId + 1
      }

      if (this.data.categories.length > 0) {
        const maxCategoryId = Math.max(...this.data.categories.map(cat => cat.id))
        this.nextCategoryId = maxCategoryId + 1
      } else {
        this.initializeDefaultCategory()
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error)
      throw error
    }
  }

  private loadData(): void {
    try {
      const content = fs.readFileSync(this.dataPath, 'utf-8')
      this.data = JSON.parse(content) as ClipboardData

      if (!Array.isArray(this.data.clipboard_items)) {
        console.warn('Invalid data structure, resetting')
        this.data = { clipboard_items: [], categories: [] }
      }
      if (!Array.isArray(this.data.categories)) {
        this.data.categories = []
      }
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = { clipboard_items: [], categories: [] }
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

  @expose('StorageManager')
  public async saveItem(content: string): Promise<number> {
    const contentHash = this.generateHash(content)
    const preview = this.generatePreview(content)
    const now = Date.now()

    try {
      const existingItem = this.data.clipboard_items.find(item => item.content_hash === contentHash)

      if (existingItem) {
        existingItem.used_count += 1
        existingItem.updated_at = now
        this.saveData()
        return existingItem.id
      }

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

  @expose('StorageManager')
  public async getItemById(id: number): Promise<ClipboardItem | null> {
    try {
      const item = this.data.clipboard_items.find(item => item.id === id)
      return item || null
    } catch (error) {
      console.error('Error getting item by id:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async getItems(): Promise<ClipboardItem[]> {
    try {
      const sortedItems = [...this.data.clipboard_items].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned ? 1 : -1
        }
        return b.updated_at - a.updated_at
      })
      return sortedItems
    } catch (error) {
      console.error('Error getting items:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async getAllItems(): Promise<ClipboardItem[]> {
    try {
      return [...this.data.clipboard_items].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned ? 1 : -1
        }
        return b.updated_at - a.updated_at
      })
    } catch (error) {
      console.error('Error getting all items:', error)
      throw error
    }
  }

  @expose('StorageManager')
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

  @expose('StorageManager')
  public async updateItem(id: number, updates: Partial<ClipboardItem>): Promise<boolean> {
    try {
      const item = this.data.clipboard_items.find(item => item.id === id)

      if (!item) {
        return false
      }

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

  @expose('StorageManager')
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

  private initializeDefaultCategory(): void {
    const defaultCategory: Category = {
      id: 0,
      name: '最新',
      is_pinned: true,
      created_at: Date.now(),
      updated_at: Date.now(),
    }
    this.data.categories = [defaultCategory]
    this.nextCategoryId = 1
    this.saveData()
  }

  @expose('StorageManager')
  public async createCategory(name: string): Promise<Category> {
    try {
      const now = Date.now()
      const newCategory: Category = {
        id: this.nextCategoryId++,
        name,
        is_pinned: false,
        created_at: now,
        updated_at: now,
      }
      this.data.categories.push(newCategory)
      this.saveData()
      return newCategory
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async updateCategory(id: number, updates: Partial<Category>): Promise<boolean> {
    try {
      const category = this.data.categories.find(cat => cat.id === id)
      if (!category || id === 0) {
        return false
      }

      if (updates.name !== undefined) {
        category.name = updates.name
      }
      if (updates.is_pinned !== undefined) {
        category.is_pinned = updates.is_pinned
      }
      category.updated_at = Date.now()
      this.saveData()
      return true
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async deleteCategory(id: number): Promise<boolean> {
    try {
      if (id === 0) {
        return false
      }

      const deleted = this.data.categories.some(cat => cat.id === id)
      if (deleted) {
        this.data.categories = this.data.categories.filter(cat => cat.id !== id)
        this.data.clipboard_items = this.data.clipboard_items.filter(item => item.category_id !== id)
        this.saveData()
      }
      return deleted
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async getCategories(): Promise<Category[]> {
    try {
      const sorted = [...this.data.categories].sort((a, b) => {
        if (a.id === 0) return -1
        if (b.id === 0) return 1
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned ? 1 : -1
        }
        return a.created_at - b.created_at
      })
      return sorted
    } catch (error) {
      console.error('Error getting categories:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async getCategoryById(id: number): Promise<Category | null> {
    try {
      const category = this.data.categories.find(cat => cat.id === id)
      return category || null
    } catch (error) {
      console.error('Error getting category by id:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async getItemsByCategory(categoryId?: number): Promise<ClipboardItem[]> {
    try {
      let items = this.data.clipboard_items
      
      if (categoryId === undefined) {
        items = items.filter(item => !item.category_id)
      } else {
        items = items.filter(item => item.category_id === categoryId)
      }

      return items.sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned ? 1 : -1
        }
        return b.updated_at - a.updated_at
      })
    } catch (error) {
      console.error('Error getting items by category:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async moveItemToCategory(itemId: number, categoryId?: number): Promise<boolean> {
    try {
      const item = this.data.clipboard_items.find(item => item.id === itemId)
      if (!item) {
        return false
      }

      item.category_id = categoryId
      item.updated_at = Date.now()
      this.saveData()
      return true
    } catch (error) {
      console.error('Error moving item to category:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async searchItems(query: string): Promise<ClipboardItem[]> {
    try {
      const lowerQuery = query.toLowerCase()
      const items = this.data.clipboard_items
        .filter(
          item =>
            item.content.toLowerCase().includes(lowerQuery) ||
            item.preview.toLowerCase().includes(lowerQuery)
        )
        .sort((a, b) => {
          if (b.used_count !== a.used_count) {
            return b.used_count - a.used_count
          }
          return b.updated_at - a.updated_at
        })

      return items
    } catch (error) {
      console.error('Error searching items:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async getFavorites(): Promise<ClipboardItem[]> {
    try {
      const items = this.data.clipboard_items
        .filter(item => item.is_favorite)
        .sort((a, b) => b.updated_at - a.updated_at)

      return items
    } catch (error) {
      console.error('Error getting favorites:', error)
      throw error
    }
  }

  @expose('StorageManager')
  public async getStats(): Promise<{ total: number; favorites: number; today: number }> {
    try {
      const total = this.data.clipboard_items.length

      const favorites = this.data.clipboard_items.filter(item => item.is_favorite).length

      const today = Date.now()
      const startOfDay = new Date(today).setHours(0, 0, 0, 0)
      const todayCount = this.data.clipboard_items.filter(
        item => item.created_at >= startOfDay
      ).length

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
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  private generatePreview(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength) + '...'
  }

  public close(): void {
  }
}

import { registerInstance } from '../utils/ipcProxy'

export const storageManager = new StorageManager()
registerInstance(storageManager, 'StorageManager')
export type { StorageManager }
