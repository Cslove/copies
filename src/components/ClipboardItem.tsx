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
}

export const ClipboardItemComponent: React.FC<ClipboardItemProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item.id)}
      className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left cursor-pointer transition-colors duration-200"
    >
      <div className="text-purple-900 font-medium wrap-break-word">{item.preview}</div>
      <div className="text-xs text-purple-500 mt-2 flex justify-between items-center">
        <span>{new Date(item.created_at).toLocaleString()}</span>
        <span className="bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full text-xs">
          #{item.id}
        </span>
      </div>
    </div>
  )
}