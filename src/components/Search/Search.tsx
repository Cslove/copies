import React from 'react'
import { CloseIcon } from '../../assets/icons/CloseIcon'

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
        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:border-transparent"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 border-none bg-transparent p-0 cursor-pointer"
          aria-label="清除搜索"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
