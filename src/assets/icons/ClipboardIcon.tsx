import React from 'react'

interface ClipboardIconProps {
  className?: string
}

export const ClipboardIcon: React.FC<ClipboardIconProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 剪贴板主体 - 手绘风格 */}
      <path
        d="M12 6H10C7.79086 6 6 7.79086 6 10V40C6 42.2091 7.79086 44 10 44H38C40.2091 44 42 42.2091 42 40V10C42 7.79086 40.2091 6 38 6H36"
        stroke="#2c2c2c"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      
      {/* 剪贴板顶部夹子 */}
      <path
        d="M16 6H32C33.1046 6 34 6.89543 34 8V10C34 11.1046 33.1046 12 32 12H16C14.8954 12 14 11.1046 14 10V8C14 6.89543 14.8954 6 16 6Z"
        stroke="#2c2c2c"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      
      {/* 夹子上的小孔 */}
      <circle
        cx="24"
        cy="9"
        r="1.5"
        fill="#2c2c2c"
        opacity="0.4"
      />
      
      {/* 纸张线条 - 模拟手写记录 */}
      <line
        x1="18"
        y1="20"
        x2="30"
        y2="20"
        stroke="#2c2c2c"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="18"
        y1="26"
        x2="34"
        y2="26"
        stroke="#2c2c2c"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="18"
        y1="32"
        x2="28"
        y2="32"
        stroke="#2c2c2c"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  )
}
