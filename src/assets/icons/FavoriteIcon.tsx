import React from 'react'

interface FavoriteIconProps {
  className?: string
  filled?: boolean
}

export const FavoriteIcon: React.FC<FavoriteIconProps> = ({ className = '', filled = false }) => {
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
