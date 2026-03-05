import React from 'react'
import { CloseIcon } from '@/assets/icons'
import type { UpdateInfo, UpdateProgress } from '../../types'

interface UpdateDialogProps {
  show: boolean
  updateInfo: UpdateInfo | null
  updateProgress: UpdateProgress | null
  isDownloading: boolean
  isDownloaded: boolean
  onClose: () => void
  onDownload: () => void
  onInstall: () => void
}

/**
 * 更新对话框组件
 * 显示更新信息、下载进度和操作按钮
 */
export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  show,
  updateInfo,
  updateProgress,
  isDownloading,
  isDownloaded,
  onClose,
  onDownload,
  onInstall,
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2c2c2c]">
            {isDownloaded ? '更新已就绪' : '发现新版本'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="关闭对话框"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {updateInfo && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              新版本: <span className="font-semibold">{updateInfo.version}</span>
            </p>
            {updateInfo.releaseNotes && (
              <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                <p className="font-medium mb-1">更新说明:</p>
                <p className="whitespace-pre-wrap">{updateInfo.releaseNotes}</p>
              </div>
            )}
          </div>
        )}

        {isDownloading && updateProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>下载中...</span>
              <span>{Math.round(updateProgress.percent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${updateProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          {!isDownloaded && !isDownloading && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                稍后提醒
              </button>
              <button
                onClick={onDownload}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                立即更新
              </button>
            </>
          )}
          {isDownloaded && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                稍后安装
              </button>
              <button
                onClick={onInstall}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                重启并安装
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
