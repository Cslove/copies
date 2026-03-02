interface FooterProps {
  year?: number
}

const getPlatform = (): 'mac' | 'windows' => {
  return navigator.platform.toLowerCase().includes('mac') ? 'mac' : 'windows'
}

const ShortcutKey: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <kbd className="px-2 py-0.5 text-xs font-medium border border-black/20 rounded bg-black/5">
      {children}
    </kbd>
  )
}

export const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  const platform = getPlatform()

  const closeShortcut = 'Esc'
  const openShortcut = platform === 'mac' ? '⌘⌥V' : 'Ctrl+Alt+V'

  return (
    <footer className="h-9 flex items-center justify-between px-4 text-xs border-t border-black/10">
      <p className="m-0 text-[#2c2c2c]">Copies © {year}</p>
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
