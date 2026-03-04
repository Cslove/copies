import { DeleteIcon } from '@/assets/icons/DeleteIcon'
// import { FavoriteIcon } from '@/assets/icons/FavoriteIcon'
// import { PinIcon } from '@/assets/icons/PinIcon'

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

interface ClipboardItemProps {
  item: ClipboardItem
  onClick: (id: number) => void
  onDelete?: (id: number, e: React.MouseEvent) => void
  onToggleFavorite?: (id: number, e: React.MouseEvent) => void
  onTogglePin?: (id: number, e: React.MouseEvent) => void
}

export const ClipboardItemComponent: React.FC<ClipboardItemProps> = ({
  item,
  onClick,
  onDelete,
  onToggleFavorite: _onToggleFavorite,
  onTogglePin: _onTogglePin,
}) => {
  return (
    <div
      onClick={() => onClick(item.id)}
      className={`group relative border rounded p-2.5 text-left cursor-pointer transition-colors duration-200 hover:border-[#2c2c2c] ${
        item.is_pinned ? 'border-gray-500' : 'border-gray-300'
      }`}
    >
      {/* 内容区域 */}
      <div className="flex items-center gap-2">
        {/* ID 标签 */}
        <span className="text-xs text-[#2c2c2c] opacity-50 whitespace-nowrap leading-none">
          #{item.id}
        </span>

        {/* 内容预览 - 最多两行，超出显示省略号 */}
        <div className="font-medium word-break flex-1 text-sm text-[#2c2c2c] leading-relaxed line-clamp-2">
          {item.preview}
        </div>
      </div>

      {/* 底部信息 - 与内容区域对齐 */}
      <div className="text-xs mt-1.5 text-[#2c2c2c] opacity-60 pl-2 leading-none">
        {new Date(item.created_at).toLocaleString()}
      </div>

      {/* 操作按钮 - 一直显示 */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        {/* 收藏按钮 - 暂时注释 */}
        {/* {onToggleFavorite && (
          <button
            onClick={e => onToggleFavorite(item.id, e)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 transition-colors text-[#2c2c2c]"
            title={item.is_favorite ? '取消收藏' : '收藏'}
          >
            <FavoriteIcon filled={item.is_favorite} />
          </button>
        )} */}

        {/* 置顶按钮 - 暂时注释 */}
        {/* {onTogglePin && (
          <button
            onClick={e => onTogglePin(item.id, e)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 transition-colors text-[#2c2c2c]"
            title={item.is_pinned ? '取消置顶' : '置顶'}
          >
            <PinIcon filled={item.is_pinned} />
          </button>
        )} */}

        {/* 删除按钮 */}
        {onDelete && (
          <button
            onClick={e => onDelete(item.id, e)}
            className="w-8 h-8 flex items-center justify-center transition-colors text-[#2c2c2c] opacity-60 hover:opacity-100 cursor-pointer"
            title="删除"
          >
            <DeleteIcon />
          </button>
        )}
      </div>
    </div>
  )
}
