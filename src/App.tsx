import { useEffect, useCallback } from 'react'
import { ClipboardItemComponent } from './components/ClipboardItem'
import { LoadingSpinner } from './components/LoadingSpinner'
import { EmptyState } from './components/EmptyState'
import { Footer } from './components/Footer'
import { useDatabase } from './hooks/useDatabase'
import { useClipboard } from './hooks/useClipboard'
import { useHotkey } from './hooks/useHotkey'
import { useClipboardStore } from './stores/clipboardStore'
import { mockData } from './utils/mockData'

function App() {
  const {
    items,
    filteredItems,
    isLoading,
    searchQuery,
    showFavoritesOnly,
    showPinnedOnly,
    setItems,
    setSearchQuery,
    toggleFavoritesOnly,
    togglePinnedOnly,
    deleteItem: storeDeleteItem,
    updateItem: storeUpdateItem,
    setLoading,
  } = useClipboardStore()

  const { loadItems, deleteItem, updateItem } = useDatabase()
  const { pasteItem } = useClipboard()
  const { onShowPanel, onHidePanel } = useHotkey()

  const fetchData = useCallback(async () => {
    const isWebEnv = !window.electronAPI

    if (isWebEnv) {
      setItems(mockData)
    } else {
      const loadedItems = await loadItems()
      setItems(loadedItems)
    }
    setLoading(false)
  }, [loadItems, setItems, setLoading])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const cleanup = onShowPanel(() => {
      fetchData()
    })
    return cleanup
  }, [onShowPanel, fetchData])

  useEffect(() => {
    const cleanup = onHidePanel(() => {})
    return cleanup
  }, [onHidePanel])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleItemClick = async (id: number) => {
    const success = await pasteItem(id)
    if (success) {
      console.log(`Item ${id} pasted successfully`)
    } else {
      console.error(`Failed to paste item ${id}`)
    }
  }

  const handleDeleteItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await deleteItem(id)
    if (success) {
      storeDeleteItem(id)
    }
  }

  const handleToggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const item = items.find(item => item.id === id)
    if (item) {
      const success = await updateItem(id, { is_favorite: !item.is_favorite })
      if (success) {
        storeUpdateItem(id, { is_favorite: !item.is_favorite })
      }
    }
  }

  const handleTogglePin = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const item = items.find(item => item.id === id)
    if (item) {
      const success = await updateItem(id, { is_pinned: !item.is_pinned })
      if (success) {
        storeUpdateItem(id, { is_pinned: !item.is_pinned })
      }
    }
  }

  const displayItems = searchQuery || showFavoritesOnly || showPinnedOnly ? filteredItems : items

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* 头部 */}
        <header className="flex items-center justify-between pb-2 border-b border-purple-100">
          <h1 className="text-xl font-bold text-purple-800">Copies</h1>
          <div className="flex space-x-2">
            <button
              onClick={toggleFavoritesOnly}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                showFavoritesOnly
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              ⭐ 收藏
            </button>
            <button
              onClick={togglePinnedOnly}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                showPinnedOnly
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              📌 置顶
            </button>
          </div>
        </header>

        {/* 搜索栏 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索剪贴板内容..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* 主内容区域 */}
        <main>
          {window.electronAPI && isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3 max-h-125 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
              {displayItems.length > 0 ? (
                displayItems.map(item => (
                  <ClipboardItemComponent
                    key={item.id}
                    item={item}
                    onClick={handleItemClick}
                    onDelete={handleDeleteItem}
                    onToggleFavorite={handleToggleFavorite}
                    onTogglePin={handleTogglePin}
                  />
                ))
              ) : (
                <EmptyState
                  message={
                    searchQuery
                      ? '未找到匹配的内容'
                      : showFavoritesOnly
                        ? '暂无收藏内容'
                        : showPinnedOnly
                          ? '暂无置顶内容'
                          : '暂无剪贴板历史'
                  }
                />
              )}
            </div>
          )}
        </main>

        {/* 页脚 */}
        <Footer />
      </div>
    </div>
  )
}

export default App
