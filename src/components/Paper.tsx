import React from 'react'
import styles from './Paper.module.css'

interface PaperProps {
  children: React.ReactNode
  className?: string
}

export const Paper: React.FC<PaperProps> = ({ children, className }) => {
  return <div className={`${styles.paper} flex flex-col ${className || ''}`}>{children}</div>
}
