import React, { useRef, useEffect, useMemo } from 'react'

interface EditableContentProps {
  content: string
  onSave: (newContent: string) => void
  onCancel: () => void
}

export const EditableContent: React.FC<EditableContentProps> = ({ content, onSave, onCancel }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const calculatedRows = useMemo(() => {
    const lineCount = content.split('\n').length
    return Math.max(lineCount, 3)
  }, [content])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(content.length, content.length)
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [content])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSave(e.currentTarget.value)
    } else if (e.key === 'Escape') {
      onCancel()
      e.stopPropagation()
    }
  }

  return (
    <textarea
      ref={textareaRef}
      defaultValue={content}
      onKeyDown={handleKeyDown}
      className="w-full min-h-20 p-0 text-base sm:text-lg text-[#2c2c2c] leading-relaxed 
                 bg-transparent border-none rounded-none
                 focus:outline-none resize-y font-medium
                 transition-all duration-200"
      placeholder="编辑内容..."
      rows={calculatedRows}
    />
  )
}
