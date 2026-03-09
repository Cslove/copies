import { useCallback } from 'react'
import * as ipc from '@/utils/ipc'
import { handleError } from '@/utils/errorHandler'

export const useClipboard = () => {
  const pasteItem = useCallback(async (id: number): Promise<boolean> => {
    try {
      const success = await ipc.pasteItem(id)
      if (success) {
        ipc.hidePanel()
      }
      return success
    } catch (err) {
      handleError(err, 'Error pasting item')
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
