import React from 'react'
import { CloseIcon } from '@/assets/icons'

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = '搜索剪贴板内容...',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="relative px-4 py-1.5 shrink-0">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2 focus:border-transparent"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 border-none bg-transparent p-0 cursor-pointer flex items-center justify-center"
          aria-label="清除搜索"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
