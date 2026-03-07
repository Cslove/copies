import React from 'react'
import { CloseIcon } from '@/assets/icons'
import { useAutoUpdate } from '@/hooks/useAutoUpdate'
import paperBg from '@/assets/paper.jpg'

export const UpdateDialog: React.FC = () => {
  const {
    updateInfo,
    updateProgress,
    isDownloading,
    isDownloaded,
    showUpdateDialog,
    downloadUpdate,
    openUpdateFolder,
    closeUpdateDialog,
  } = useAutoUpdate()

  if (!showUpdateDialog) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <div
        className="border-2 border-black shadow-lg p-4 max-w-md w-full mx-4"
        style={{
          backgroundImage: `url(${paperBg})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'overlay',
        }}
      >
        {' '}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-[#2c2c2c]">
            {isDownloaded ? '更新已就绪！' : '发现新版本！'}
          </h3>
          <button
            onClick={closeUpdateDialog}
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="关闭对话框"
          >
            <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        {updateInfo && (
          <div className="mb-4">
            <p className="text-sm sm:text-base text-gray-700 mb-2">
              新版本: <span className="font-semibold text-black">{updateInfo.version}</span>
            </p>
            {updateInfo.releaseNotes && (
              <div className="text-sm sm:text-base text-[#2c2c2c] bg-gray-50 border border-gray-300 p-3">
                <p className="font-medium mb-1">更新说明:</p>
                <div
                  className="overflow-y-auto max-h-32 **:mb-2 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:ml-2 [&_p]:leading-relaxed [&_strong]:font-semibold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mb-2 [&_code]:bg-gray-200 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-gray-200 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  dangerouslySetInnerHTML={{ __html: updateInfo.releaseNotes }}
                />
              </div>
            )}
          </div>
        )}
        {isDownloading && updateProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm sm:text-base text-gray-700 mb-1">
              <span>下载中...</span>
              <span>{Math.round(updateProgress.percent)}%</span>
            </div>
            <div className="w-full bg-gray-200 border border-gray-300 h-2">
              <div
                className="bg-black h-2 transition-all duration-300"
                style={{ width: `${updateProgress.percent}%` }}
              />
            </div>
          </div>
        )}
        <div className="flex gap-3 justify-end">
          {!isDownloaded && !isDownloading && (
            <>
              <button
                onClick={closeUpdateDialog}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base text-gray-700 hover:text-black transition-colors"
              >
                稍后提醒
              </button>
              <button
                onClick={downloadUpdate}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base bg-black text-white hover:bg-gray-800 transition-colors"
              >
                立即更新
              </button>
            </>
          )}
          {isDownloaded && (
            <>
              <button
                onClick={closeUpdateDialog}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base text-gray-700 hover:text-black transition-colors"
              >
                稍后安装
              </button>
              <button
                onClick={() => {
                  openUpdateFolder(updateInfo?.downloadedFile)
                  alert(
                    '已打开更新应用所在目录，请手动解压并将其移动到访达/应用程序目录内，替换新应用'
                  )
                }}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base bg-black text-white hover:bg-gray-800 transition-colors"
              >
                手动安装
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
