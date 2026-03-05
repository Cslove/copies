import { useEffect, useState, useCallback } from 'react'
import type { UpdateInfo, UpdateProgress, UpdateError } from '../../types'

interface UseAutoUpdateReturn {
  updateAvailable: boolean
  updateInfo: UpdateInfo | null
  updateProgress: UpdateProgress | null
  isDownloading: boolean
  isDownloaded: boolean
  showUpdateDialog: boolean
  checkForUpdates: () => Promise<void>
  downloadUpdate: () => Promise<void>
  installUpdate: () => Promise<void>
  closeUpdateDialog: () => void
}

/**
 * 自动更新 Hook
 * 处理应用自动更新的所有逻辑
 */
export function useAutoUpdate(): UseAutoUpdateReturn {
  const [updateAvailable, setUpdateAvailable] = useState(true)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [updateProgress, setUpdateProgress] = useState<UpdateProgress | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(true)

  // 检查更新
  const checkForUpdates = useCallback(async () => {
    try {
      await window.electronAPI?.checkForUpdates()
    } catch (error) {
      console.error('检查更新失败:', error)
    }
  }, [])

  // 下载更新
  const downloadUpdate = useCallback(async () => {
    try {
      setIsDownloading(true)
      await window.electronAPI?.downloadUpdate()
    } catch (error) {
      console.error('下载更新失败:', error)
      setIsDownloading(false)
    }
  }, [])

  // 安装更新
  const installUpdate = useCallback(async () => {
    try {
      await window.electronAPI?.installUpdate()
    } catch (error) {
      console.error('安装更新失败:', error)
    }
  }, [])

  // 关闭更新对话框
  const closeUpdateDialog = useCallback(() => {
    setShowUpdateDialog(false)
  }, [])

  useEffect(() => {
    if (!window.electronAPI) return
    // 监听更新事件
    const unsubscribeChecking = window.electronAPI.onUpdateChecking(() => {
      console.log('正在检查更新...')
    })

    const unsubscribeAvailable = window.electronAPI.onUpdateAvailable((info: UpdateInfo) => {
      console.log('发现新版本:', info)
      setUpdateAvailable(true)
      setUpdateInfo(info)
      setShowUpdateDialog(true)
    })

    const unsubscribeNotAvailable = window.electronAPI.onUpdateNotAvailable(() => {
      console.log('当前已是最新版本')
    })

    const unsubscribeProgress = window.electronAPI.onUpdateProgress((progress: UpdateProgress) => {
      console.log('下载进度:', progress)
      setUpdateProgress(progress)
      setIsDownloading(true)
    })

    const unsubscribeDownloaded = window.electronAPI.onUpdateDownloaded((info: UpdateInfo) => {
      console.log('更新下载完成:', info)
      setIsDownloading(false)
      setIsDownloaded(true)
      setUpdateInfo(info)
    })

    const unsubscribeError = window.electronAPI.onUpdateError((error: UpdateError) => {
      console.error('更新错误:', error)
      setIsDownloading(false)
    })

    // 延迟检查更新
    setTimeout(checkForUpdates, 3000)

    return () => {
      unsubscribeChecking()
      unsubscribeAvailable()
      unsubscribeNotAvailable()
      unsubscribeProgress()
      unsubscribeDownloaded()
      unsubscribeError()
    }
  }, [checkForUpdates])

  return {
    updateAvailable,
    updateInfo,
    updateProgress,
    isDownloading,
    isDownloaded,
    showUpdateDialog,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    closeUpdateDialog,
  }
}
