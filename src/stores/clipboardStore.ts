/**
 * 剪贴板 Store
 * 使用 Zustand 管理全局状态
 */

import { create } from 'zustand'
import type { ClipboardItem, ClipboardStats } from '../../types'

interface ClipboardState {
  // 数据
  items: ClipboardItem[]
  filteredItems: ClipboardItem[]
  searchQuery: string
  showFavoritesOnly: boolean
  showPinnedOnly: boolean
  stats: ClipboardStats | null
  isLoading: boolean
  error: string | null

  // 操作
  setItems: (items: ClipboardItem[]) => void
  addItem: (item: ClipboardItem) => void
  updateItem: (id: number, updates: Partial<ClipboardItem>) => void
  deleteItem: (id: number) => void
  setSearchQuery: (query: string) => void
  toggleFavoritesOnly: () => void
  togglePinnedOnly: () => void
  setStats: (stats: ClipboardStats) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAll: () => void

  // 辅助方法
  refreshFilteredItems: () => void
}

export const useClipboardStore = create<ClipboardState>((set, get) => ({
  // 初始状态
  items: [],
  filteredItems: [],
  searchQuery: '',
  showFavoritesOnly: false,
  showPinnedOnly: false,
  stats: null,
  isLoading: true,
  error: null,

  // 设置项目列表
  setItems: (items) => {
    set({ items })
    get().refreshFilteredItems()
  },

  // 添加新项目
  addItem: (item) => {
    set((state) => {
      const newItems = [item, ...state.items]
      return { items: newItems }
    })
    get().refreshFilteredItems()
  },

  // 更新项目
  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates, updated_at: Date.now() } : item
      ),
    }))
    get().refreshFilteredItems()
  },

  // 删除项目
  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
    get().refreshFilteredItems()
  },

  // 设置搜索查询
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().refreshFilteredItems()
  },

  // 切换只显示收藏
  toggleFavoritesOnly: () => {
    set((state) => ({ showFavoritesOnly: !state.showFavoritesOnly }))
    get().refreshFilteredItems()
  },

  // 切换只显示置顶
  togglePinnedOnly: () => {
    set((state) => ({ showPinnedOnly: !state.showPinnedOnly }))
    get().refreshFilteredItems()
  },

  // 设置统计数据
  setStats: (stats) => {
    set({ stats })
  },

  // 设置加载状态
  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  // 设置错误
  setError: (error) => {
    set({ error })
  },

  // 清空所有数据
  clearAll: () => {
    set({
      items: [],
      filteredItems: [],
      searchQuery: '',
      showFavoritesOnly: false,
      showPinnedOnly: false,
      stats: null,
      error: null,
    })
  },

  // 刷新过滤后的项目列表
  refreshFilteredItems: () => {
    const { items, searchQuery, showFavoritesOnly, showPinnedOnly } = get()

    let filtered = [...items]

    // 应用搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.content.toLowerCase().includes(query) ||
          item.preview.toLowerCase().includes(query)
      )
    }

    // 应用收藏过滤
    if (showFavoritesOnly) {
      filtered = filtered.filter((item) => item.is_favorite)
    }

    // 应用置顶过滤
    if (showPinnedOnly) {
      filtered = filtered.filter((item) => item.is_pinned)
    }

    set({ filteredItems: filtered })
  },
}))