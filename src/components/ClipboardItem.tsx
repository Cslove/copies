import React from 'react'
import { DeleteIcon, CopyIcon, MoreIcon, PinIcon } from '@/assets/icons'
import { PopoverMenu, PopoverMenuTrigger, PopoverMenuContent, MenuItem } from './PopoverMenu'
import { useClipboardActions } from '@/hooks/useClipboardActions'
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
      className={`w-4 h-9 sm:w-6 sm:h-10 flex items-center justify-center transition-colors text-[#2c2c2c] opacity-60 hover:opacity-100 cursor-pointer ml-2 ${className}`}
      title={title}
    >
      {icon}
    </button>
  )
}
export const ClipboardItemComponent: React.FC<ClipboardItemProps> = ({ item, categories }) => {
  const { handleItemClick, handleDeleteItem, handleTogglePin, handleMoveToCategory } =
    useClipboardActions()

  const getCategoryName = (categoryId?: number): string => {
    if (categoryId === undefined || categoryId === 0) {
      return '最新'
    }
    const category = categories.find((cat: Category) => cat.id === categoryId)
    return category?.name || '最新'
  }

  const getCategoryMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        id: 'default',
        label: '最新',
        onClick: () => handleMoveToCategory(item.id, undefined),
      },
    ]

    categories
      .filter((cat: Category) => cat.id !== 0)
      .forEach((category: Category) => {
        items.push({
          id: category.id.toString(),
          label: category.name,
          onClick: () => handleMoveToCategory(item.id, category.id),
        })
      })

    return items
  }

  const getActionMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        id: 'pin',
        label: item.is_pinned ? '取消置顶' : '置顶',
        icon: <PinIcon className="w-3 h-3" filled={item.is_pinned} />,
        onClick: () => handleTogglePin(item.id),
      },
      {
        id: 'delete',
        label: '删除',
        icon: <DeleteIcon className="w-3 h-3" />,
        onClick: () => handleDeleteItem(item.id),
      },
    ]

    return items
  }

  return (
    <div
      className={`group border rounded p-2.5 text-left cursor-pointer transition-colors duration-200 border-gray-100 hover:border-[#2c2c2c]`}
    >
      <div className="flex items-start gap-2">
        {item.is_pinned && <PinIcon className="w-4 h-4 mt-1.5 shrink-0" filled={true} />}
        <div className="font-medium word-break text-base sm:text-lg text-[#2c2c2c] leading-relaxed line-clamp-2">
          {item.preview}
        </div>
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
          <IconButton icon={<CopyIcon />} onClick={() => handleItemClick(item.id)} title="复制" />

          <PopoverMenu>
            <PopoverMenuTrigger>
              <button
                className="w-5 h-9 sm:w-6 sm:h-10 flex items-center justify-center transition-colors text-[#2c2c2c] opacity-60 hover:opacity-100 cursor-pointer ml-2"
                title="更多操作"
              >
                <MoreIcon className="w-3 h-3" />
              </button>
            </PopoverMenuTrigger>
            <PopoverMenuContent items={getActionMenuItems()} />
          </PopoverMenu>
        </div>
      </div>
    </div>
  )
}
