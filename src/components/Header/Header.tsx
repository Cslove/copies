import React from 'react'
import { hidePanel } from '../../utils/ipc'
import { CloseIcon } from '../../assets/icons/CloseIcon'

export const Header: React.FC = () => {
  const handleClose = () => {
    hidePanel()
  }

  return (
    <header className="flex items-center justify-center relative h-9 max-h-9 border-b border-black/10">
      <span className="text-lg font-semibold text-[#2c2c2c] m-0">Copies</span>
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent p-0 m-0 cursor-pointer"
        onClick={handleClose}
        aria-label="关闭窗口"
      >
        <CloseIcon />
      </button>
    </header>
  )
}
