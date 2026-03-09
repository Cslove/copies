import React, { useEffect, useState } from 'react'
import { getPlatform } from '@/utils/platform'
import { handleError } from '@/utils/errorHandler'

interface FooterProps {
  year?: number
}

const ShortcutKey: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <kbd className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium border border-black/20 rounded bg-black/5">
      {children}
    </kbd>
  )
}

export const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  const platform = getPlatform()
  const [appVersion, setAppVersion] = useState<string>('')

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const version = await window.electronAPI?.getAppVersion()
        setAppVersion(version || '')
      } catch (error) {
        handleError(error, '获取应用版本失败')
      }
    }
    fetchVersion()
  }, [])

  const closeShortcut = 'Esc'
  const openShortcut = platform === 'mac' ? 'Cmd+Opt+V' : 'Ctrl+Alt+V'

  return (
    <footer className="h-9 sm:h-10 flex items-center justify-between px-4 sm:px-5 text-xs sm:text-sm border-t border-black/10">
      <p className="m-0 text-[#2c2c2c]">
        Copies © {year} {appVersion && <span className="text-[#666] ml-2">v{appVersion}</span>}
      </p>
      <div className="flex items-center gap-3 text-[#666]">
        <span className="flex items-center gap-1">
          <ShortcutKey>{closeShortcut}</ShortcutKey>
          <span>关闭</span>
        </span>
        <span className="flex items-center gap-1">
          <ShortcutKey>{openShortcut}</ShortcutKey>
          <span>打开</span>
        </span>
      </div>
    </footer>
  )
}
