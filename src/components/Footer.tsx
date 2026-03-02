interface FooterProps {
  year?: number
}

export const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="pt-4 text-center text-xs border-t">
      <p>Copies © {year} - 智能剪贴板管理</p>
    </footer>
  )
}
