import { useState, useEffect } from 'react'
import { ClipboardItemComponent } from './components/ClipboardItem'
import { LoadingSpinner } from './components/LoadingSpinner'
import { EmptyState } from './components/EmptyState'
import { Footer } from './components/Footer'

interface ClipboardItem {
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

declare global {
  interface Window {
    electronAPI?: {
      getClipboardItems: (limit: number, offset: number) => Promise<ClipboardItem[]>
      saveItem: (content: string) => Promise<number>
      deleteItem: (id: number) => Promise<boolean>
      pasteItem: (id: number) => Promise<boolean>
      onShowPanel: (callback: () => void) => void
      onHidePanel: (callback: () => void) => void
      hidePanel: () => void
      onClipboardChange: (callback: (item: { content: string }) => void) => void
    }
  }
}

function App() {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查是否在 Electron 环境中
    if (window.electronAPI) {
      loadClipboardItems()
    } else {
      // 开发环境下的模拟数据
      setClipboardItems([
        {
          id: 1,
          content: '这是一条测试剪贴板内容',
          content_hash: 'test1',
          preview: '这是一条测试剪...',
          is_favorite: false,
          is_pinned: false,
          created_at: Date.now(),
          updated_at: Date.now(),
          used_count: 1,
        },
        {
          id: 2,
          content: 'Hello, World!',
          content_hash: 'test2',
          preview: 'Hello, World!',
          is_favorite: false,
          is_pinned: false,
          created_at: Date.now() - 60000,
          updated_at: Date.now() - 60000,
          used_count: 1,
        },
      ])
      setIsLoading(false)
    }
  }, [])

  const loadClipboardItems = async () => {
    try {
      const items = await window.electronAPI!.getClipboardItems(50, 0)
      setClipboardItems(items)
    } catch (error) {
      console.error('Failed to load clipboard items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <header className="text-center pb-2 border-b border-purple-100">
          <h1 className="text-xl font-bold text-purple-800">Copies</h1>
        </header>

        <main>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3 max-h-125 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
              {clipboardItems.length > 0 ? (
                clipboardItems.map(item => (
                  <ClipboardItemComponent
                    key={item.id}
                    item={item}
                    onClick={(id) => {
                      // 处理点击事件
                      console.log(`Item ${id} clicked`)
                    }}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
