import { useState, useEffect } from 'react'
import './App.css'

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
    <div className="app">
      <header className="app-header">
        <h1>Copies - 智能剪贴板管理器</h1>
      </header>
      <main className="app-main">
        {isLoading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="clipboard-list">
            {clipboardItems.length > 0 ? (
              clipboardItems.map(item => (
                <div key={item.id} className="clipboard-item">
                  <div className="content">{item.preview}</div>
                  <div className="timestamp">{new Date(item.created_at).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">暂无剪贴板历史</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
