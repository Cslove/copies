import { DeleteIcon, CopyIcon } from '@/assets/icons'
// import { FavoriteIcon }
// import { PinIcon }

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
      className={`w-4 h-8 flex items-center justify-center transition-colors text-[#2c2c2c] opacity-60 hover:opacity-100 cursor-pointer ml-2 ${className}`}
      title={title}
    >
      {icon}
    </button>
  )
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
      className={`group relative border rounded p-2.5 text-left cursor-pointer transition-colors duration-200 border-gray-100 hover:border-[#2c2c2c]`}
    >
      {/* 内容预览 - 最多两行，超出显示省略号 */}
      <div className="font-medium word-break text-sm text-[#2c2c2c] leading-relaxed line-clamp-2">
        {item.preview}
      </div>

      {/* 底部信息 - 时间和操作按钮在一行，center 对齐 */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#2c2c2c] opacity-60 leading-none">
          {new Date(item.created_at).toLocaleString()}
        </div>

        {/* 操作按钮 - 一直显示 */}
        <div className="flex space-x-0.5">
          {/* 收藏按钮 - 暂时注释 */}
          {/* {onToggleFavorite && (
            <IconButton
              icon={<FavoriteIcon filled={item.is_favorite} />}
              onClick={e => onToggleFavorite(item.id, e)}
              title={item.is_favorite ? '取消收藏' : '收藏'}
            />
          )} */}

          {/* 置顶按钮 - 暂时注释 */}
          {/* {onTogglePin && (
            <IconButton
              icon={<PinIcon filled={item.is_pinned} />}
              onClick={e => onTogglePin(item.id, e)}
              title={item.is_pinned ? '取消置顶' : '置顶'}
            />
          )} */}

          {/* 复制按钮 */}
          <IconButton
            icon={<CopyIcon />}
            onClick={() => {
              onClick(item.id)
            }}
            title="复制"
          />

          {/* 删除按钮 */}
          {onDelete && (
            <IconButton icon={<DeleteIcon />} onClick={e => onDelete(item.id, e)} title="删除" />
          )}
        </div>
      </div>
    </div>
  )
}
