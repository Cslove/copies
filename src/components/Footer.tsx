interface FooterProps {
  year?: number
}

export const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="h-9 flex items-center justify-center text-xs border-t border-black/10">
      <p className="m-0">Copies © {year} - 智能剪贴板管理</p>
    </footer>
  )
}
