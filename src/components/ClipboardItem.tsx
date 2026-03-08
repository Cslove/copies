import { useState } from 'react'
import { DeleteIcon, CopyIcon } from '@/assets/icons'
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
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)

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
    setShowCategoryMenu(false)
  }

  return (
    <div
      className={`group relative border rounded p-2.5 text-left cursor-pointer transition-colors duration-200 border-gray-100 hover:border-[#2c2c2c]`}
    >
      <div className="font-medium word-break text-base sm:text-lg text-[#2c2c2c] leading-relaxed line-clamp-2">
        {item.preview}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs sm:text-sm text-[#2c2c2c] opacity-60 leading-none">
            {new Date(item.created_at).toLocaleString()}
          </div>
          
          {onMoveToCategory && (
            <div className="relative">
              <button
                onClick={e => {
                  e.stopPropagation()
                  setShowCategoryMenu(!showCategoryMenu)
                }}
                className="text-xs sm:text-sm text-[#2c2c2c] opacity-60 hover:opacity-100 cursor-pointer hover:underline"
                title="移动到分类"
              >
                {getCategoryName(item.category_id)}
              </button>
              
              {showCategoryMenu && (
                <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-30">
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      handleMoveToCategory(undefined)
                    }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    最新
                  </div>
                  {categories
                    .filter((cat: Category) => cat.id !== 0)
                    .map((category: Category) => (
                      <div
                        key={category.id}
                        onClick={e => {
                          e.stopPropagation()
                          handleMoveToCategory(category.id)
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {category.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
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
