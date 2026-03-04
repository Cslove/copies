import React from 'react'

interface CopyIconProps {
  className?: string
}

export const CopyIcon: React.FC<CopyIconProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 手绘风格的复制图标 - 纸张效果 */}
      {/* 后面的纸张 */}
      <path
        d="M5 2H3.5C2.7 2 2 2.7 2 3.5V10.5C2 11.3 2.7 12 3.5 12H8.5C9.3 12 10 11.3 10 10.5V9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 前面的纸张 */}
      <path
        d="M6 2H10.5C11.3 2 12 2.7 12 3.5V8.5C12 9.3 11.3 10 10.5 10H6C5.2 10 4.5 9.3 4.5 8.5V3.5C4.5 2.7 5.2 2 6 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
