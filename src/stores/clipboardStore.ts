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
  items: [],
  filteredItems: [],
  searchQuery: '',
  showFavoritesOnly: false,
  showPinnedOnly: false,
  stats: null,
  isLoading: true,
  error: null,

  setItems: items => {
    set({ items })
    get().refreshFilteredItems()
  },

  addItem: item => {
    set(state => {
      const newItems = [item, ...state.items]
      return { items: newItems }
    })
    get().refreshFilteredItems()
  },

  updateItem: (id, updates) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, ...updates, updated_at: Date.now() } : item
      ),
    }))
    get().refreshFilteredItems()
  },

  deleteItem: id => {
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    }))
    get().refreshFilteredItems()
  },

  setSearchQuery: query => {
    set({ searchQuery: query })
    get().refreshFilteredItems()
  },

  toggleFavoritesOnly: () => {
    set(state => ({ showFavoritesOnly: !state.showFavoritesOnly }))
    get().refreshFilteredItems()
  },

  togglePinnedOnly: () => {
    set(state => ({ showPinnedOnly: !state.showPinnedOnly }))
    get().refreshFilteredItems()
  },

  setStats: stats => {
    set({ stats })
  },

  setLoading: loading => {
    set({ isLoading: loading })
  },

  setError: error => {
    set({ error })
  },

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

  refreshFilteredItems: () => {
    const { items, searchQuery, showFavoritesOnly, showPinnedOnly } = get()

    let filtered = [...items]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        item =>
          item.content.toLowerCase().includes(query) || item.preview.toLowerCase().includes(query)
      )
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(item => item.is_favorite)
    }

    if (showPinnedOnly) {
      filtered = filtered.filter(item => item.is_pinned)
    }

    set({ filteredItems: filtered })
  },
}))
