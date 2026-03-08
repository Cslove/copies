import React, { useEffect, useRef } from 'react'
import paperBg from '@/assets/paper.jpg'

export interface MenuItem {
  id: string | number
  label: string
  onClick: () => void
}

interface PopoverMenuProps {
  visible: boolean
  onClose: () => void
  items: MenuItem[]
  className?: string
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  visible,
  onClose,
  items,
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [visible, onClose])

  if (!visible) {
    return null
  }

  return (
    <div ref={menuRef} className={`absolute bottom-full left-0 mb-2 z-10 ${className}`}>
      <div
        className="relative border border-[#2c2c2c] rounded shadow-lg overflow-hidden min-w-30"
        style={{
          backgroundImage: `url(${paperBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="p-1">
          {items.map(item => (
            <div
              key={item.id}
              onClick={e => {
                e.stopPropagation()
                item.onClick()
                onClose()
              }}
              className="px-2 py-1 text-sm text-[#2c2c2c] cursor-pointer hover:bg-[#2c2c2c]/10 rounded transition-all duration-200 whitespace-nowrap"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
