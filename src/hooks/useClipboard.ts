/**
 * 剪贴板操作 Hook
 * 处理剪贴板相关的操作和事件监听
 */

import { useCallback } from 'react'
import * as ipc from '../utils/ipc'

export const useClipboard = () => {
  /**
   * 粘贴剪贴板项目
   */
  const pasteItem = useCallback(async (id: number): Promise<boolean> => {
    try {
      const success = await ipc.pasteItem(id)
      if (success) {
        // 粘贴成功后隐藏面板
        ipc.hidePanel()
      }
      return success
    } catch (err) {
      console.error('Error pasting item:', err)
      return false
    }
  }, [])

  /**
   * 监听剪贴板变化事件
   */
  const onClipboardChange = useCallback((callback: (item: { content: string }) => void) => {
    return ipc.onClipboardChange(callback)
  }, [])

  return {
    pasteItem,
    onClipboardChange,
  }
}