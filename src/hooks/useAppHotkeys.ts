import { useEffect } from 'react'
import { useHotkey } from './useHotkey'

export const useAppHotkeys = () => {
  const { onHidePanel } = useHotkey()

  useEffect(() => {
    const cleanup = onHidePanel(() => {})
    return cleanup
  }, [onHidePanel])
}
