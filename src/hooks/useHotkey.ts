import { useCallback, useEffect } from 'react'
import * as ipc from '@/utils/ipc'

export const useHotkey = () => {
  const showPanel = useCallback(async () => {
    try {
      await ipc.showPanel()
    } catch (err) {
      console.error('Error showing panel:', err)
    }
  }, [])

  const hidePanel = useCallback(() => {
    ipc.hidePanel()
  }, [])

  const onShowPanel = useCallback((callback: () => void) => {
    return ipc.onShowPanel(callback)
  }, [])

  const onHidePanel = useCallback((callback: () => void) => {
    return ipc.onHidePanel(callback)
  }, [])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        hidePanel()
      }
    }

    window.addEventListener('keydown', handleEscKey)

    return () => {
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [hidePanel])

  return {
    showPanel,
    hidePanel,
    onShowPanel,
    onHidePanel,
  }
}
