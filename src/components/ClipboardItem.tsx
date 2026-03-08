import React from 'react'
import { DeleteIcon, CopyIcon } from '@/assets/icons'
import { PopoverMenu, PopoverMenuTrigger, PopoverMenuContent, MenuItem } from './PopoverMenu'
import type { Category } from '@/types/index'

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
  category_id?: number
}

interface ClipboardItemProps {
  item: ClipboardItem
  categories: Category[]
  onClick: (id: number) => void
  onDelete?: (id: number, e: React.MouseEvent) => void
  onToggleFavorite?: (id: number, e: React.MouseEvent) => void
  onTogglePin?: (id: number, e: React.MouseEvent) => void
  onMoveToCategory?: (itemId: number, categoryId?: number) => void
}

interface IconButtonProps {
  icon: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  title?: string
  className?: string
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, title, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-5 h-9 sm:w-6 sm:h-10 flex items-center justify-center transition-colors text-[#2c2c2c] opacity-60 hover:opacity-100 cursor-pointer ml-2 ${className}`}
      title={title}
    >
      {icon}
    </button>
  )
}
export const ClipboardItemComponent: React.FC<ClipboardItemProps> = ({
  item,
  categories,
  onClick,
  onDelete,
  onToggleFavorite: _onToggleFavorite,
  onTogglePin: _onTogglePin,
  onMoveToCategory,
}) => {

  const getCategoryName = (categoryId?: number): string => {
    if (categoryId === undefined || categoryId === 0) {
      return '最新'
    }
    const category = categories.find((cat: Category) => cat.id === categoryId)
    return category?.name || '最新'
  }

  const handleMoveToCategory = (categoryId?: number) => {
    if (onMoveToCategory) {
      onMoveToCategory(item.id, categoryId)
    }
  }

  const getCategoryMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        id: 'default',
        label: '最新',
        onClick: () => handleMoveToCategory(undefined),
      },
    ]

    categories
      .filter((cat: Category) => cat.id !== 0)
      .forEach((category: Category) => {
        items.push({
          id: category.id.toString(),
          label: category.name,
          onClick: () => handleMoveToCategory(category.id),
        })
      })

    return items
  }

  return (
    <div
      className={`group border rounded p-2.5 text-left cursor-pointer transition-colors duration-200 border-gray-100 hover:border-[#2c2c2c]`}
    >
      <div className="font-medium word-break text-base sm:text-lg text-[#2c2c2c] leading-relaxed line-clamp-2">
        {item.preview}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs sm:text-sm text-[#2c2c2c] opacity-60 leading-none">
            {new Date(item.updated_at).toLocaleString()}
          </div>

          <div className="relative">
            <PopoverMenu>
              <PopoverMenuTrigger>
                <button
                  className="text-xs sm:text-sm text-[#2c2c2c] opacity-60 hover:opacity-100 cursor-pointer hover:underline"
                  title="移动到分类"
                >
                  {getCategoryName(item.category_id)}
                </button>
              </PopoverMenuTrigger>
              <PopoverMenuContent items={getCategoryMenuItems()} />
            </PopoverMenu>
          </div>
        </div>

        <div className="flex space-x-0.5">
          <IconButton
            icon={<CopyIcon />}
            onClick={() => {
              onClick(item.id)
            }}
            title="复制"
          />

          {onDelete && (
            <IconButton icon={<DeleteIcon />} onClick={e => onDelete(item.id, e)} title="删除" />
          )}
        </div>
      </div>
    </div>
  )
}
