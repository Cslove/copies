import { useState, useCallback } from 'react'
import type { ClipboardItem, ClipboardStats, Category } from '@/types/index'
import * as ipc from '@/utils/ipc'

export const useDatabase = () => {
  const [items, setItems] = useState<ClipboardItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ipc.getClipboardItems()
      setItems(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load items'
      setError(errorMessage)
      console.error('Error loading items:', err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveItem = useCallback(
    async (content: string): Promise<number | null> => {
      try {
        setError(null)
        const id = await ipc.saveItem(content)
        await loadItems()
        return id
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save item'
        setError(errorMessage)
        console.error('Error saving item:', err)
        return null
      }
    },
    [loadItems]
  )

  const deleteItem = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null)
      const success = await ipc.deleteItem(id)
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id))
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item'
      setError(errorMessage)
      console.error('Error deleting item:', err)
      return false
    }
  }, [])

  const updateItem = useCallback(
    async (id: number, updates: Partial<ClipboardItem>): Promise<boolean> => {
      try {
        setError(null)
        const success = await ipc.updateItem(id, updates)
        if (success) {
          setItems(prev =>
            prev.map(item =>
              item.id === id ? { ...item, ...updates, updated_at: Date.now() } : item
            )
          )
        }
        return success
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update item'
        setError(errorMessage)
        console.error('Error updating item:', err)
        return false
      }
    },
    []
  )

  const searchItems = useCallback(
    async (query: string): Promise<ClipboardItem[]> => {
      try {
        setError(null)
        const results = await ipc.searchItems(query)
        return results
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search items'
        setError(errorMessage)
        console.error('Error searching items:', err)
        return []
      }
    },
    []
  )

  const getFavorites = useCallback(async (): Promise<ClipboardItem[]> => {
    try {
      setError(null)
      const favorites = await ipc.getFavorites()
      return favorites
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get favorites'
      setError(errorMessage)
      console.error('Error getting favorites:', err)
      return []
    }
  }, [])

  const getStats = useCallback(async (): Promise<ClipboardStats | null> => {
    try {
      setError(null)
      const stats = await ipc.getStats()
      return stats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get stats'
      setError(errorMessage)
      console.error('Error getting stats:', err)
      return null
    }
  }, [])

  const clearAllItems = useCallback(async (): Promise<boolean> => {
    try {
      setError(null)
      const success = await ipc.clearAllItems()
      if (success) {
        setItems([])
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear items'
      setError(errorMessage)
      console.error('Error clearing items:', err)
      return false
    }
  }, [])

  const getCategories = useCallback(async (): Promise<Category[]> => {
    try {
      setError(null)
      const cats = await ipc.getCategories()
      setCategories(cats)
      return cats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get categories'
      setError(errorMessage)
      console.error('Error getting categories:', err)
      return []
    }
  }, [])

  const createCategory = useCallback(
    async (name: string): Promise<Category | null> => {
      try {
        setError(null)
        const newCategory = await ipc.createCategory(name)
        await getCategories()
        return newCategory
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create category'
        setError(errorMessage)
        console.error('Error creating category:', err)
        return null
      }
    },
    [getCategories]
  )

  const updateCategory = useCallback(
    async (id: number, updates: Partial<Category>): Promise<boolean> => {
      try {
        setError(null)
        const success = await ipc.updateCategory(id, updates)
        if (success) {
          await getCategories()
        }
        return success
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update category'
        setError(errorMessage)
        console.error('Error updating category:', err)
        return false
      }
    },
    [getCategories]
  )

  const deleteCategory = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setError(null)
        const success = await ipc.deleteCategory(id)
        if (success) {
          await getCategories()
          await loadItems()
        }
        return success
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete category'
        setError(errorMessage)
        console.error('Error deleting category:', err)
        return false
      }
    },
    [getCategories, loadItems]
  )

  const getItemsByCategory = useCallback(
    async (categoryId?: number): Promise<ClipboardItem[]> => {
      try {
        setError(null)
        const items = await ipc.getItemsByCategory(categoryId)
        return items
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get items by category'
        setError(errorMessage)
        console.error('Error getting items by category:', err)
        return []
      }
    },
    []
  )

  const moveItemToCategory = useCallback(
    async (itemId: number, categoryId?: number): Promise<boolean> => {
      try {
        setError(null)
        const success = await ipc.moveItemToCategory(itemId, categoryId)
        if (success) {
          await loadItems()
        }
        return success
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to move item to category'
        setError(errorMessage)
        console.error('Error moving item to category:', err)
        return false
      }
    },
    [loadItems]
  )

  return {
    items,
    categories,
    isLoading,
    error,
    loadItems,
    saveItem,
    deleteItem,
    updateItem,
    searchItems,
    getFavorites,
    getStats,
    clearAllItems,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getItemsByCategory,
    moveItemToCategory,
  }
}
