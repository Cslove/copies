import { useCallback } from 'react'
import * as ipc from '@/utils/ipc'

export const useClipboard = () => {
  const pasteItem = useCallback(async (id: number): Promise<boolean> => {
    try {
      const success = await ipc.pasteItem(id)
      if (success) {
        ipc.hidePanel()
      }
      return success
    } catch (err) {
      console.error('Error pasting item:', err)
      return false
    }
  }, [])

  const onClipboardChange = useCallback((callback: (item: { content: string }) => void) => {
    return ipc.onClipboardChange(callback)
  }, [])

  return {
    pasteItem,
    onClipboardChange,
  }
}
