import React, { useEffect, useState, useCallback, useRef } from 'react'
import { PlusIcon, CloseIcon, PinIcon, UnpinIcon } from '@/assets/icons'
import type { Category } from '@/types/index'
import { useDatabase } from '@/hooks/useDatabase'

export interface TabItem {
  key: string
  label: string
  closable?: boolean
  isPinned?: boolean
}

interface TabsProps {
  onCategoryChange: (categoryId: number | undefined) => void
  onRefreshData?: () => Promise<void>
  extra?: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  onCategoryChange,
  onRefreshData,
  extra,
  className = '',
}) => {
  const { getCategories, createCategory, updateCategory, deleteCategory } = useDatabase()
  const [categories, setCategories] = useState<Category[]>([])
  const [tabs, setTabs] = useState<TabItem[]>([])
  const [activeTab, setActiveTab] = useState('0')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const loadCategories = useCallback(async () => {
    const cats = await getCategories()
    setCategories(cats)
    updateTabsFromCategories(cats)
  }, [getCategories])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    if (isAddingCategory && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAddingCategory])

  const updateTabsFromCategories = (cats: Category[]) => {
    const newTabs: TabItem[] = cats.map(cat => ({
      key: cat.id.toString(),
      label: cat.name,
      closable: cat.id !== 0,
      isPinned: cat.is_pinned,
    }))
    setTabs(newTabs)
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    const categoryId = parseInt(key)
    onCategoryChange(categoryId === 0 ? undefined : categoryId)
  }

  const handleAddTab = () => {
    setIsAddingCategory(true)
    setNewCategoryName('')
  }

  const handleConfirmAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategory = await createCategory(newCategoryName.trim())
      if (newCategory) {
        await loadCategories()
        setActiveTab(newCategory.id.toString())
        onCategoryChange(newCategory.id)
      }
    }
    setIsAddingCategory(false)
    setNewCategoryName('')
  }

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false)
    setNewCategoryName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirmAddCategory()
    } else if (e.key === 'Escape') {
      handleCancelAddCategory()
    }
  }

  const handleDeleteTab = async (key: string) => {
    const categoryId = parseInt(key)
    if (categoryId === 0) {
      return
    }

    const confirmed = confirm('确定要删除这个分类吗？该分类下的所有数据也会被删除。')
    if (confirmed) {
      const success = await deleteCategory(categoryId)
      if (success) {
        await loadCategories()
        setActiveTab('0')
        onCategoryChange(undefined)
        if (onRefreshData) {
          await onRefreshData()
        }
      }
    }
  }

  const handlePinCategory = async (categoryId: number) => {
    const success = await updateCategory(categoryId, { is_pinned: true })
    if (success) {
      await loadCategories()
    }
  }

  const handleUnpinCategory = async (categoryId: number) => {
    const success = await updateCategory(categoryId, { is_pinned: false })
    if (success) {
      await loadCategories()
    }
  }

  const getCategoryById = (key: string): Category | undefined => {
    const categoryId = parseInt(key)
    return categories.find(cat => cat.id === categoryId)
  }

  return (
    <div className={`mt-2 mx-4 shrink-0 border-b border-[#2c2c2c] ${className}`}>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const category = getCategoryById(tab.key)
            const isPinned = tab.isPinned || category?.is_pinned
            const isDefaultCategory = tab.key === '0'

            return (
              <div
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`
                  group flex items-center gap-1 px-2 py-1 rounded-t border border-b-0 cursor-pointer
                  transition-all duration-200 select-none whitespace-nowrap
                  ${
                    activeTab === tab.key
                      ? 'bg-transparent border-[#2c2c2c] font-medium'
                      : 'bg-transparent border-gray-100 hover:border-[#2c2c2c]'
                  }
                `}
              >
                {isPinned && <PinIcon className="w-3 h-3" filled={true} />}
                <span className="text-sm sm:text-base">{tab.label}</span>
                {tab.closable && !isDefaultCategory && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteTab(tab.key)
                    }}
                    className="ml-0.5 cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-gray-300/50 rounded p-0.5 transition-all duration-200"
                    aria-label="关闭标签"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                )}
                {!isDefaultCategory && category && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      if (category.is_pinned) {
                        handleUnpinCategory(category.id)
                      } else {
                        handlePinCategory(category.id)
                      }
                    }}
                    className="ml-0.5 cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-gray-300/50 rounded p-0.5 transition-all duration-200"
                    aria-label={category.is_pinned ? '取消置顶' : '置顶'}
                  >
                    {category.is_pinned ? (
                      <PinIcon className="w-3 h-3" filled={true} />
                    ) : (
                      <UnpinIcon className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            )
          })}

          {/* 新增按钮或输入框 */}
          {isAddingCategory ? (
            <div className="flex items-center px-2 py-1 rounded-t border border-b-0 bg-transparent border-[#2c2c2c] shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleCancelAddCategory}
                placeholder="输入分类名"
                className="w-32 text-sm sm:text-base bg-transparent border-none outline-none text-[#2c2c2c] placeholder:text-[#2c2c2c]/50"
                autoFocus
              />
            </div>
          ) : (
            <div
              onClick={handleAddTab}
              className="flex items-center gap-1 px-2 py-1 rounded-t border border-b-0 cursor-pointer transition-all duration-200 select-none whitespace-nowrap bg-transparent border-[#2c2c2c] shrink-0"
            >
              <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
        </div>

        {extra && <div className="flex items-center ml-2 shrink-0">{extra}</div>}
      </div>
    </div>
  )
}
