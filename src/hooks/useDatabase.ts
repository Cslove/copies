import { useState, useCallback } from 'react'
import type { ClipboardItem, ClipboardStats, Category } from '@/types/index'
import * as ipc from '@/utils/ipc'
import { handleError, getErrorMessage } from '@/utils/errorHandler'

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
      setError(null)
      try {
        const id = await ipc.saveItem(content)
        await loadItems()
        return id
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to save item'))
        handleError(err, 'Error saving item')
        return null
      }
    },
    [loadItems]
  )

  const deleteItem = useCallback(async (id: number): Promise<boolean> => {
    setError(null)
    try {
      const success = await ipc.deleteItem(id)
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id))
      }
      return success
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete item'))
      handleError(err, 'Error deleting item')
      return false
    }
  }, [])

  const updateItem = useCallback(
    async (id: number, updates: Partial<ClipboardItem>): Promise<boolean> => {
      setError(null)
      try {
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
        setError(getErrorMessage(err, 'Failed to update item'))
        handleError(err, 'Error updating item')
        return false
      }
    },
    []
  )

  const searchItems = useCallback(
    async (query: string): Promise<ClipboardItem[]> => {
      setError(null)
      try {
        const results = await ipc.searchItems(query)
        return results
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to search items'))
        handleError(err, 'Error searching items')
        return []
      }
    },
    []
  )

  const getFavorites = useCallback(async (): Promise<ClipboardItem[]> => {
    setError(null)
    try {
      const favorites = await ipc.getFavorites()
      return favorites
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to get favorites'))
      handleError(err, 'Error getting favorites')
      return []
    }
  }, [])

  const getStats = useCallback(async (): Promise<ClipboardStats | null> => {
    setError(null)
    try {
      const stats = await ipc.getStats()
      return stats
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to get stats'))
      handleError(err, 'Error getting stats')
      return null
    }
  }, [])

  const clearAllItems = useCallback(async (): Promise<boolean> => {
    setError(null)
    try {
      const success = await ipc.clearAllItems()
      if (success) {
        setItems([])
      }
      return success
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to clear items'))
      handleError(err, 'Error clearing items')
      return false
    }
  }, [])

  const getCategories = useCallback(async (): Promise<Category[]> => {
    setError(null)
    try {
      const cats = await ipc.getCategories()
      setCategories(cats)
      return cats
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to get categories'))
      handleError(err, 'Error getting categories')
      return []
    }
  }, [])

  const createCategory = useCallback(
    async (name: string): Promise<Category | null> => {
      setError(null)
      try {
        const newCategory = await ipc.createCategory(name)
        await getCategories()
        return newCategory
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to create category'))
        handleError(err, 'Error creating category')
        return null
      }
    },
    [getCategories]
  )

  const updateCategory = useCallback(
    async (id: number, updates: Partial<Category>): Promise<boolean> => {
      setError(null)
      try {
        const success = await ipc.updateCategory(id, updates)
        if (success) {
          await getCategories()
        }
        return success
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to update category'))
        handleError(err, 'Error updating category')
        return false
      }
    },
    [getCategories]
  )

  const deleteCategory = useCallback(
    async (id: number): Promise<boolean> => {
      setError(null)
      try {
        const success = await ipc.deleteCategory(id)
        if (success) {
          await getCategories()
          await loadItems()
        }
        return success
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to delete category'))
        handleError(err, 'Error deleting category')
        return false
      }
    },
    [getCategories, loadItems]
  )

  const getItemsByCategory = useCallback(
    async (categoryId?: number): Promise<ClipboardItem[]> => {
      setError(null)
      try {
        const items = await ipc.getItemsByCategory(categoryId)
        return items
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to get items by category'))
        handleError(err, 'Error getting items by category')
        return []
      }
    },
    []
  )

  const moveItemToCategory = useCallback(
    async (itemId: number, categoryId?: number): Promise<boolean> => {
      setError(null)
      try {
        const success = await ipc.moveItemToCategory(itemId, categoryId)
        if (success) {
          await loadItems()
        }
        return success
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to move item to category'))
        handleError(err, 'Error moving item to category')
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
