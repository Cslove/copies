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
  onToggleFavorite,
  onTogglePin,
}) => {
  return (
    <div
      onClick={() => onClick(item.id)}
      className={`group relative bg-purple-50 hover:bg-purple-100 border rounded-lg p-4 text-left cursor-pointer transition-all duration-200 ${
        item.is_pinned ? 'border-purple-400 ring-2 ring-purple-200' : 'border-purple-200'
      }`}
    >
      {/* 置顶标识 */}
      {item.is_pinned && <div className="absolute top-2 right-2 text-purple-500">📌</div>}

      {/* 内容预览 */}
      <div className="text-purple-900 font-medium word-break pr-8">{item.preview}</div>

      {/* 底部信息 */}
      <div className="text-xs text-purple-500 mt-2 flex justify-between items-center">
        <span>{new Date(item.created_at).toLocaleString()}</span>
        <span className="bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full text-xs">
          #{item.id}
        </span>
      </div>

      {/* 操作按钮 - 悬停显示 */}
      <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* 收藏按钮 */}
        {onToggleFavorite && (
          <button
            onClick={e => onToggleFavorite(item.id, e)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-purple-50 transition-colors"
            title={item.is_favorite ? '取消收藏' : '收藏'}
          >
            {item.is_favorite ? '⭐' : '☆'}
          </button>
        )}

        {/* 置顶按钮 */}
        {onTogglePin && (
          <button
            onClick={e => onTogglePin(item.id, e)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-purple-50 transition-colors"
            title={item.is_pinned ? '取消置顶' : '置顶'}
          >
            {item.is_pinned ? '📌' : '📍'}
          </button>
        )}

        {/* 删除按钮 */}
        {onDelete && (
          <button
            onClick={e => onDelete(item.id, e)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-50 transition-colors"
            title="删除"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}
