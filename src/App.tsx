import { ClipboardItemComponent } from '@/components/ClipboardItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { EmptyState } from '@/components/EmptyState'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Paper } from '@/components/Paper'
import { Search } from '@/components/Search'
import { Tabs } from '@/components/Tabs'
import { useAppData } from '@/hooks/useAppData'
import { useAppHotkeys } from '@/hooks/useAppHotkeys'
import { useClipboardStore } from '@/stores/clipboardStore'

function App() {
  const {
    items,
    filteredItems,
    isLoading,
    searchQuery,
    showFavoritesOnly,
    showPinnedOnly,
    categories,
    activeCategoryId,
    setSearchQuery,
    setActiveCategory,
  } = useClipboardStore()

  const { fetchData } = useAppData()

  useAppHotkeys()

  const handleCategoryChange = (categoryId: number | undefined) => {
    setActiveCategory(categoryId)
  }

  const displayItems =
    searchQuery || showFavoritesOnly || showPinnedOnly || activeCategoryId ? filteredItems : items

  return (
    <Paper className="w-full">
      <Header />

      <Search value={searchQuery} onChange={setSearchQuery} />

      <Tabs
        onCategoryChange={handleCategoryChange}
        onRefreshData={fetchData}
        extra={<div className="text-xs text-gray-500">共 {displayItems.length} 项</div>}
      />

      <main className="flex-1 overflow-hidden min-h-0">
        {window.electronAPI && isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="h-full pt-3 relative overflow-y-auto px-4 custom-scrollbar">
            <div className="space-y-3 pb-4">
              {displayItems.length > 0 ? (
                displayItems.map(item => (
                  <ClipboardItemComponent
                    key={item.id}
                    item={item}
                    categories={categories}
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

      <Footer />
    </Paper>
  )
}

export default App
