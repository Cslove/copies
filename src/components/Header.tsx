import React from 'react'
import { hidePanel } from '@/utils/ipc'
import { CloseIcon } from '@/assets/icons'
import { useAutoUpdate } from '@/hooks/useAutoUpdate'
import { UpdateDialog } from './UpdateDialog'

export const Header: React.FC = () => {
  const {
    updateAvailable,
    updateInfo,
    updateProgress,
    isDownloading,
    isDownloaded,
    showUpdateDialog,
    downloadUpdate,
    installUpdate,
    closeUpdateDialog,
  } = useAutoUpdate()

  const handleClose = () => {
    hidePanel()
  }

  return (
    <>
      <header 
        className="flex items-center justify-center relative h-9 max-h-9 border-b border-black/10 select-none" 
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[#2c2c2c] m-0">Copies</span>
          {updateAvailable && !isDownloaded && (
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">新版本</span>
          )}
        </div>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent p-0 m-0 cursor-pointer flex items-center justify-center"
          onClick={handleClose}
          aria-label="关闭窗口"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </header>

      <UpdateDialog
        show={showUpdateDialog}
        updateInfo={updateInfo}
        updateProgress={updateProgress}
        isDownloading={isDownloading}
        isDownloaded={isDownloaded}
        onClose={closeUpdateDialog}
        onDownload={downloadUpdate}
        onInstall={installUpdate}
      />
    </>
  )
}
