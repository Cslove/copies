/**
 * 获取当前操作系统平台
 * @returns 'mac' 或 'windows'
 */
export const getPlatform = (): 'mac' | 'windows' => {
  return navigator.platform.toLowerCase().includes('mac') ? 'mac' : 'windows'
}
