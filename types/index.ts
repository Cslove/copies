/**
 * 剪贴板项接口
 */
export interface ClipboardItem {
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

/**
 * Electron API 接口定义
 */
export interface ElectronAPI {
  // 剪贴板操作
  getClipboardItems: (limit?: number, offset?: number) => Promise<ClipboardItem[]>
  saveItem: (content: string) => Promise<number>
  deleteItem: (id: number) => Promise<boolean>
  pasteItem: (id: number) => Promise<boolean>
  updateItem: (id: number, updates: Partial<ClipboardItem>) => Promise<boolean>
  searchItems: (query: string, limit?: number) => Promise<ClipboardItem[]>
  getFavorites: () => Promise<ClipboardItem[]>
  getStats: () => Promise<{ total: number; favorites: number; today: number }>
  clearAllItems: () => Promise<boolean>

  // 面板控制
  showPanel: () => Promise<boolean>
  hidePanel: () => void
  onShowPanel: (callback: () => void) => void
  onHidePanel: (callback: () => void) => void

  // 剪贴板监听
  onClipboardChange: (callback: (item: { content: string }) => void) => void
}

/**
 * Window 全局对象扩展
 */
declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

/**
 * 统计数据接口
 */
export interface ClipboardStats {
  total: number
  favorites: number
  today: number
}

/**
 * 面板状态接口
 */
export interface PanelState {
  isVisible: boolean
  isFocused: boolean
}

/**
 * 搜索过滤器接口
 */
export interface SearchFilter {
  query: string
  showFavoritesOnly: boolean
  showPinnedOnly: boolean
}

/**
 * 应用状态接口
 */
export interface AppState {
  items: ClipboardItem[]
  filteredItems: ClipboardItem[]
  isLoading: boolean
  searchQuery: string
  showFavoritesOnly: boolean
  showPinnedOnly: boolean
  stats: ClipboardStats
  error: string | null
}
