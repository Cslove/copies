import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  cloneElement,
  isValidElement,
} from 'react'
import { createPortal } from 'react-dom'
import paperBg from '@/assets/paper.jpg'

export interface MenuItem {
  id: string | number
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

interface PopoverMenuContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  registerMenuRef: (ref: HTMLDivElement | null) => void
}

const PopoverMenuContext = createContext<PopoverMenuContextValue | undefined>(undefined)

const usePopoverMenuContext = () => {
  const context = useContext(PopoverMenuContext)
  if (!context) {
    throw new Error('PopoverMenu components must be used within a PopoverMenu')
  }
  return context
}

// 全局状态，确保同一时间只有一个 PopoverMenu 打开
let activePopoverMenuInstance: { close: () => void } | null = null

interface PopoverMenuProps {
  children: React.ReactNode
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const open = () => {
    // 关闭其他已打开的 PopoverMenu
    if (activePopoverMenuInstance && activePopoverMenuInstance.close !== close) {
      activePopoverMenuInstance.close()
    }
    setIsOpen(true)
    activePopoverMenuInstance = { close }
  }

  const close = () => {
    setIsOpen(false)
    if (activePopoverMenuInstance?.close === close) {
      activePopoverMenuInstance = null
    }
  }

  const toggle = () => setIsOpen(prev => !prev)

  const registerMenuRef = (ref: HTMLDivElement | null) => {
    menuRef.current = ref
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        close()
      }
    }

    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, close])

  const contextValue: PopoverMenuContextValue = {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    registerMenuRef,
  }

  const childrenArray = React.Children.toArray(children)
  const trigger = childrenArray.find(
    child => isValidElement(child) && child.type === PopoverMenuTrigger
  )
  const content = childrenArray.find(
    child => isValidElement(child) && child.type === PopoverMenuContent
  )

  return (
    <PopoverMenuContext.Provider value={contextValue}>
      {trigger}
      {content && isOpen && createPortal(content, document.body)}
    </PopoverMenuContext.Provider>
  )
}

interface PopoverMenuTriggerProps {
  children: React.ReactElement<any>
}

export const PopoverMenuTrigger: React.FC<PopoverMenuTriggerProps> = ({ children }) => {
  const { triggerRef, toggle } = usePopoverMenuContext()

  return cloneElement(children, {
    ref: (element: HTMLElement | null) => {
      if (element) {
        ;(triggerRef as React.MutableRefObject<HTMLElement | null>).current = element
      }
    },
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      toggle()
      const childProps = children.props as any
      if (childProps?.onClick) {
        childProps.onClick(e)
      }
    },
  })
}

interface PopoverMenuContentProps {
  items: MenuItem[]
  className?: string
}

export const PopoverMenuContent: React.FC<PopoverMenuContentProps> = ({
  items,
  className = '',
}) => {
  const { close, triggerRef, registerMenuRef } = usePopoverMenuContext()
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  useEffect(() => {
    registerMenuRef(menuRef.current)
  }, [registerMenuRef])

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const menuWidth = 120 // 预估菜单宽度
      const menuHeight = items.length * 36 + 16 // 预估菜单高度（每项约36px + padding）
      
      // 获取窗口尺寸
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      // 计算初始位置
      let top = rect.bottom + 4
      let left = rect.left
      
      // 检查右边界
      if (left + menuWidth > windowWidth) {
        left = windowWidth - menuWidth - 8
      }
      
      // 检查左边界
      if (left < 8) {
        left = 8
      }
      
      // 检查下边界
      if (top + menuHeight > windowHeight) {
        // 如果下方空间不足，尝试显示在触发器上方
        top = rect.top - menuHeight - 4
        
        // 如果上方空间也不足，则显示在触发器下方但限制高度
        if (top < 8) {
          top = Math.max(8, windowHeight - menuHeight - 8)
        }
      }
      
      // 检查上边界
      if (top < 8) {
        top = 8
      }
      
      setPosition({ top, left })
    }
  }, [triggerRef, items.length])

  return (
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
                close()
              }}
              className="flex items-center gap-2 px-2 py-1 text-sm text-[#2c2c2c] cursor-pointer hover:bg-[#2c2c2c]/10 rounded transition-all duration-200 whitespace-nowrap"
            >
              {item.icon && (
                <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
