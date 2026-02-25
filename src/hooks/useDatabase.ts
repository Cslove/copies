/**
 * 数据库操作 Hook
 * 封装所有数据库相关的操作
 */

import { useState, useEffect, useCallback } from 'react'
import type { ClipboardItem, ClipboardStats } from '../../types'
import * as ipc from '../utils/ipc'

export const useDatabase = () => {
  const [items, setItems] = useState<ClipboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * 加载剪贴板项目列表
   */
  const loadItems = useCallback(async (limit: number = 50, offset: number = 0) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ipc.getClipboardItems(limit, offset)
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

  /**
   * 保存剪贴板项目
   */
  const saveItem = useCallback(async (content: string): Promise<number | null> => {
    try {
      setError(null)
      const id = await ipc.saveItem(content)
      // 重新加载列表
      await loadItems()
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save item'
      setError(errorMessage)
      console.error('Error saving item:', err)
      return null
    }
  }, [loadItems])

  /**
   * 删除剪贴板项目
   */
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

  /**
   * 更新剪贴板项目
   */
  const updateItem = useCallback(async (id: number, updates: Partial<ClipboardItem>): Promise<boolean> => {
    try {
      setError(null)
      const success = await ipc.updateItem(id, updates)
      if (success) {
        setItems(prev =>
          prev.map(item => (item.id === id ? { ...item, ...updates, updated_at: Date.now() } : item))
        )
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item'
      setError(errorMessage)
      console.error('Error updating item:', err)
      return false
    }
  }, [])

  /**
   * 搜索剪贴板项目
   */
  const searchItems = useCallback(async (query: string, limit: number = 50): Promise<ClipboardItem[]> => {
    try {
      setError(null)
      const results = await ipc.searchItems(query, limit)
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search items'
      setError(errorMessage)
      console.error('Error searching items:', err)
      return []
    }
  }, [])

  /**
   * 获取收藏的项目
   */
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

  /**
   * 获取统计数据
   */
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

  /**
   * 清空所有项目
   */
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

  /**
   * 初始加载
   */
  useEffect(() => {
    loadItems()
  }, [loadItems])

  return {
    items,
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
  }
}