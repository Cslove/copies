import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import paperBg from '@/assets/paper.jpg'

export interface MenuItem {
  id: string | number
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

interface PopoverMenuProps {
  visible: boolean
  onClose: () => void
  items: MenuItem[]
  triggerRef?: React.RefObject<HTMLElement | null>
  className?: string
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  visible,
  onClose,
  items,
  triggerRef,
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (visible) {
      // 延迟添加事件监听器，避免点击按钮时立即触发外部点击
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [visible, onClose])

  useEffect(() => {
    if (visible && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
    }
  }, [visible, triggerRef])

  if (!visible) {
    return null
  }

  const menuContent = (
    <div
      ref={menuRef}
      className={`fixed z-50 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
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
              className="flex items-center gap-2 px-2 py-1 text-sm text-[#2c2c2c] cursor-pointer hover:bg-[#2c2c2c]/10 rounded transition-all duration-200 whitespace-nowrap"
            >
              {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return createPortal(menuContent, document.body)
}