import React from 'react'
import { PlusIcon, CloseIcon } from '@/assets/icons'

export interface TabItem {
  key: string
  label: string
  closable?: boolean
}

interface TabsProps {
  activeKey: string
  items: TabItem[]
  onChange: (key: string) => void
  onAdd?: () => void
  onDelete?: (key: string) => void
  extra?: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  activeKey,
  items,
  onChange,
  onAdd,
  onDelete,
  extra,
  className = '',
}) => {
  return (
    <div className={`mt-3 mb-3 mx-4 shrink-0 border-b border-[#2c2c2c] ${className}`}>
      <div className="flex items-center gap-1">
        {/* Tab 列表 */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {items.map(tab => (
            <div
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`
                group flex items-center gap-1 px-2 py-1 rounded-t border border-b-0 cursor-pointer
                transition-all duration-200 select-none whitespace-nowrap
                ${
                  activeKey === tab.key
                    ? 'bg-transparent border-[#2c2c2c] font-medium'
                    : 'bg-transparent border-gray-100 hover:border-[#2c2c2c]'
                }
              `}
            >
              <span className="text-sm sm:text-base">{tab.label}</span>
              {tab.closable && onDelete && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onDelete(tab.key)
                  }}
                  className="ml-0.5 cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-gray-300/50 rounded p-0.5 transition-all duration-200"
                  aria-label="关闭标签"
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* 新增按钮 */}
          {onAdd && (
            <div
              onClick={onAdd}
              className="flex items-center gap-1 px-2 py-1 rounded-t border border-b-0 cursor-pointer transition-all duration-200 select-none whitespace-nowrap bg-transparent border-[#2c2c2c] shrink-0"
            >
              <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
        </div>

        {/* Extra 内容 */}
        {extra && <div className="flex items-center ml-2 shrink-0">{extra}</div>}
      </div>
    </div>
  )
}
