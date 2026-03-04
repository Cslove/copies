import React from 'react'

interface PinIconProps {
  className?: string
  filled?: boolean
}

export const PinIcon: React.FC<PinIconProps> = ({ className = '', filled = false }) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {filled ? (
        <>
          <path
            d="M8 2L9.5 5H13L10 7.5L11 11L8 9L5 11L6 7.5L3 5H6.5L8 2Z"
            fill="currentColor"
          />
          <path
            d="M8 9V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
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
          <path
            d="M8 9V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}
