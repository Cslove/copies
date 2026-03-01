import type { ClipboardItem } from '../../types'

/**
 * Mock 数据，用于 Web 环境下的开发和测试
 * 在非 Electron 环境中，这些数据会自动加载以展示 UI 效果
 */
export const mockData: ClipboardItem[] = [
  {
    id: 1,
    content:
      '这是一段示例文本，用于展示剪贴板历史记录功能。你可以复制任意文本，它们都会出现在这里。',
    content_hash: 'mock-hash-1',
    preview:
      '这是一段示例文本，用于展示剪贴板历史记录功能。你可以复制任意文本，它们都会出现在这里。',
    is_favorite: true,
    is_pinned: true,
    created_at: Date.now() - 3600000,
    updated_at: Date.now() - 3600000,
    used_count: 5,
  },
  {
    id: 2,
    content: 'https://github.com/electron/electron',
    content_hash: 'mock-hash-2',
    preview: 'https://github.com/electron/electron',
    is_favorite: true,
    is_pinned: false,
    created_at: Date.now() - 7200000,
    updated_at: Date.now() - 7200000,
    used_count: 3,
  },
  {
    id: 3,
    content: 'const greeting = "Hello, World!";\nconsole.log(greeting);',
    content_hash: 'mock-hash-3',
    preview: 'const greeting = "Hello, World!";\\nconsole.log(greeting);',
    is_favorite: false,
    is_pinned: false,
    created_at: Date.now() - 10800000,
    updated_at: Date.now() - 10800000,
    used_count: 2,
  },
  {
    id: 4,
    content: '待办事项：\n1. 完成项目文档\n2. 代码审查\n3. 准备演示文稿',
    content_hash: 'mock-hash-4',
    preview: '待办事项：\\n1. 完成项目文档\\n2. 代码审查\\n3. 准备演示文稿',
    is_favorite: false,
    is_pinned: false,
    created_at: Date.now() - 14400000,
    updated_at: Date.now() - 14400000,
    used_count: 1,
  },
  {
    id: 5,
    content: 'Copies 是一款智能剪贴板管理器，帮助你高效管理复制的历史记录。',
    content_hash: 'mock-hash-5',
    preview: 'Copies 是一款智能剪贴板管理器，帮助你高效管理复制的历史记录。',
    is_favorite: false,
    is_pinned: false,
    created_at: Date.now() - 18000000,
    updated_at: Date.now() - 18000000,
    used_count: 8,
  },
]
