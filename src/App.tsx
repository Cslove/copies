import { useEffect, useCallback } from 'react'
import { ClipboardItemComponent } from './components/ClipboardItem'
import { LoadingSpinner } from './components/LoadingSpinner'
import { EmptyState } from './components/EmptyState'
import { Footer } from './components/Footer'
import { Header } from './components/Header/Header'
import { Paper } from './components/Paper/Paper'
import { Search } from './components/Search/Search'
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
    <Paper className="w-full max-w-md">
      {/* 头部 */}
      <Header />

      {/* 搜索栏 */}
      <Search value={searchQuery} onChange={setSearchQuery} />

      {/* 主内容区域 */}
      <main className="flex-1 overflow-hidden min-h-0">
        {window.electronAPI && isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="h-full overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="space-y-3 pb-4">
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
          </div>
        )}
      </main>

      {/* 页脚 */}
      <Footer />
    </Paper>
  )
}

export default App
