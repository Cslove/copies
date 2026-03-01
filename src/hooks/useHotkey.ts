/**
 * 快捷键 Hook
 * 处理快捷键相关的事件
 */

import { useCallback, useEffect } from 'react'
import * as ipc from '../utils/ipc'

export const useHotkey = () => {
  /**
   * 显示面板
   */
  const showPanel = useCallback(async () => {
    try {
      await ipc.showPanel()
    } catch (err) {
      console.error('Error showing panel:', err)
    }
  }, [])

  /**
   * 隐藏面板
   */
  const hidePanel = useCallback(() => {
    ipc.hidePanel()
  }, [])

  /**
   * 监听显示面板事件
   */
  const onShowPanel = useCallback((callback: () => void) => {
    return ipc.onShowPanel(callback)
  }, [])

  /**
   * 监听隐藏面板事件
   */
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

    // 添加事件监听
    window.addEventListener('keydown', handleEscKey)

    // 清理监听
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
