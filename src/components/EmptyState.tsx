import { ClipboardIcon } from '@/assets/icons'

interface EmptyStateProps {
  message?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = '暂无剪贴板历史' }) => {
  return (
    <div className="text-center py-10">
      <ClipboardIcon className="mx-auto mb-3 w-14 h-14 sm:w-16 sm:h-16" />
      <p className="text-sm sm:text-base text-[#2c2c2c] opacity-60">{message}</p>
    </div>
  )
}
