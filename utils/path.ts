import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前模块的目录名 (ES 模块兼容)
export const __dirname = typeof __dirname !== 'undefined' 
  ? __dirname 
  : dirname(fileURLToPath(import.meta.url));