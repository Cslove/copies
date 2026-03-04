import React from 'react'

interface DeleteIconProps {
  className?: string
}

export const DeleteIcon: React.FC<DeleteIconProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 手绘风格的垃圾桶 - 纸张效果 */}
      <path
        d="M2.5 4H11.5M3.5 4V11C3.5 11.5 3.7 11.9 4.1 12.3C4.4 12.7 4.9 12.8 5.4 12.8H8.6C9.1 12.8 9.6 12.7 9.9 12.3C10.3 11.9 10.5 11.5 10.5 11V4M5 4V2.8C5 2.6 5.1 2.4 5.3 2.2C5.5 2 5.7 2 5.9 2H8.1C8.3 2 8.5 2 8.7 2.2C8.9 2.4 9 2.6 9 2.8V4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 垃圾桶上的纹理线条 */}
      <line
        x1="5.5"
        y1="6"
        x2="5.5"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="6"
        x2="7"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="8.5"
        y1="6"
        x2="8.5"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
