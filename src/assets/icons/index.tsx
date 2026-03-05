import React from 'react'

interface ClipboardIconProps {
  className?: string
}

export const ClipboardIcon: React.FC<ClipboardIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <circle cx="24" cy="9" r="1.5" fill="#2c2c2c" opacity="0.4" />

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

interface CloseIconProps {
  className?: string
}

export const CloseIcon: React.FC<CloseIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface CopyIconProps {
  className?: string
}

export const CopyIcon: React.FC<CopyIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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

interface DeleteIconProps {
  className?: string
}

export const DeleteIcon: React.FC<DeleteIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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

interface FavoriteIconProps {
  className?: string
  filled?: boolean
}

export const FavoriteIcon: React.FC<FavoriteIconProps> = ({ className = '', filled = false }) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <path
          d="M8 13.5L3 9.5C2.4 9 2 8.3 2 7.5C2 6.7 2.4 6 3 5.5L3.5 5C4.2 4.3 5.3 4.3 6 5L8 7L10 5C10.7 4.3 11.8 4.3 12.5 5L13 5.5C13.6 6 14 6.7 14 7.5C14 8.3 13.6 9 13 9.5L8 13.5Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M8 13.5L3 9.5C2.4 9 2 8.3 2 7.5C2 6.7 2.4 6 3 5.5L3.5 5C4.2 4.3 5.3 4.3 6 5L8 7L10 5C10.7 4.3 11.8 4.3 12.5 5L13 5.5C13.6 6 14 6.7 14 7.5C14 8.3 13.6 9 13 9.5L8 13.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

interface PinIconProps {
  className?: string
  filled?: boolean
}

export const PinIcon: React.FC<PinIconProps> = ({ className = '', filled = false }) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <>
          <path d="M8 2L9.5 5H13L10 7.5L11 11L8 9L5 11L6 7.5L3 5H6.5L8 2Z" fill="currentColor" />
          <path d="M8 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d="M8 2L9.5 5H13L10 7.5L11 11L8 9L5 11L6 7.5L3 5H6.5L8 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

interface PlusIconProps {
  className?: string
}

export const PlusIcon: React.FC<PlusIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 3V13M3 8H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
