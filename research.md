# Copies - 智能剪贴板管理器研究文档

## 一、项目概述

### 1.1 产品定位

Copies 是一款 macOS 平台的智能剪贴板管理器，核心解决用户在日常工作中需要频繁切换复制不同内容的需求。

### 1.2 核心功能

| 功能     | 描述                           | 快捷键        |
| -------- | ------------------------------ | ------------- |
| 快速粘贴 | 粘贴剪贴板最新内容             | `Cmd+V`       |
| 历史面板 | 弹出历史记录面板选择内容粘贴   | `Cmd+Shift+V` |
| 内容管理 | 创建、修改、删除收藏的剪贴内容 | 面板内交互    |

---

## 二、技术栈选型

### 2.1 框架对比

| 框架         | 体积   | 性能 | 跨平台 | TypeScript 支持 | 推荐度     |
| ------------ | ------ | ---- | ------ | --------------- | ---------- |
| **Electron** | ~150MB | 良好 | 优秀   | 原生支持        | ⭐⭐⭐⭐⭐ |
| Tauri        | ~10MB  | 优秀 | 良好   | 需要 Rust       | ⭐⭐⭐⭐   |
| Neutralinojs | ~15MB  | 良好 | 优秀   | 支持            | ⭐⭐⭐     |
| Flutter      | ~80MB  | 优秀 | 良好   | 第三方支持      | ⭐⭐⭐     |

### 2.2 最终推荐: Electron + TypeScript

**选择理由：**

1. **TypeScript 原生支持**：前后端统一使用 TypeScript，无语言切换成本
2. **生态成熟**：拥有最丰富的 npm 包和社区资源
3. **跨平台优秀**：一次开发，可同时运行在 macOS、Windows、Linux
4. **开发效率高**：热重载快速，调试方便
5. **剪贴板支持好**：有成熟的第三方库处理系统剪贴板

### 2.3 技术栈明细

- **前端 (Web)**
  - UI 框架: React 19 + TypeScript
  - 状态管理: Zustand
  - 样式方案: Tailwind CSS
  - 构建工具: Vite + Electron

- **主进程 (Node.js)**
  - 框架: Electron
  - 剪贴板: clipboard 或 electron-clipboard-watcher
  - 全局快捷键: electron-global-shortcut
  - 存储: JSON 文件存储
  - 窗口管理: BrowserWindow API

---

## 三、架构设计

### 3.1 系统架构图

```
+----------------------------------------------------------------------+
|                         macOS 系统层                                  |
|  +------------+  +------------+  +------------+  +------------+       |
|  |  剪贴板     |  |  全局快捷键 |  |  菜单栏    |  |  通知中心   |       |
|  | (NSPaste)  |  | (HotKey)   |  | (NSMenu)  |  | (Notif.)  |       |
|  +-----+------+  +-----+------+  +-----+------+  +-----+------+       |
|        |               |               |               |             |
+------+-+---------------+-+---------------+-+---------------+----------+
|                         Electron IPC 桥接层                           |
|                      (IPC 通信 + Context Bridge)                      |
+------+-+---------------+-+---------------+-+-------------------------+
|                        主进程层 (Node.js)                            |
|  +--------------+  +--------------+  +--------------+                |
|  | Clipboard    |  | Hotkey       |  | Storage      |                |
|  | Manager      |  | Manager      |  | (JSON File)  |                |
|  +--------------+  +--------------+  +--------------+                |
+------+-+---------------+-+---------------+-+-------------------------+
|                        渲染进程层 (WebView)                          |
|  +--------------+  +--------------+  +--------------+                |
|  | HistoryPanel |  | EditorModal  |  | SettingsView |                |
|  | (主面板)     |  | (编辑弹窗)   |  | (设置页)     |                |
|  +--------------+  +--------------+  +--------------+                |
+----------------------------------------------------------------------+
```

### 3.2 核心模块职责

#### 3.2.1 主进程模块 (Node.js)

| 模块               | 职责                               | 核心 API                                                  |
| ------------------ | ---------------------------------- | --------------------------------------------------------- |
| `clipboardManager` | 监听系统剪贴板变化、读写剪贴板内容 | `getClipboard()`, `setClipboard(text)`, `startWatching()` |
| `hotkeyManager`    | 注册/注销全局快捷键、触发事件      | `register()`, `unregister()`, `onChange()`                |
| `storageManager`   | JSON 文件数据操作、CRUD            | `init()`, `save()`, `getAll()`, `delete()`                |
| `windowManager`    | 窗口控制（显示/隐藏/置顶）         | `show()`, `hide()`, `toggle()`, `setPosition()`           |

#### 3.2.2 渲染进程模块

| 模块                | 职责                      |
| ------------------- | ------------------------- |
| `App.tsx`           | 根组件、路由/状态初始化   |
| `HistoryPanel.tsx`  | 主面板 - 显示剪贴历史列表 |
| `ClipboardItem.tsx` | 单条剪贴内容组件          |
| `EditorModal.tsx`   | 编辑/创建内容的弹窗       |
| `useClipboard.ts`   | 剪贴板相关状态和操作 Hook |
| `useHotkey.ts`      | 快捷键事件处理 Hook       |

### 3.3 数据流设计

```
用户按下 Cmd+Shift+V
        |
        v
+-------------------------------------------------+
|  Node.js: Hotkey Manager 检测到快捷键           |
|         |                                       |
|         v                                       |
|  IPC Event: "show-history-panel"              |
|         |                                       |
|         v                                       |
|  Renderer: 接收事件 -> 显示面板                   |
|         |                                       |
|         v                                       |
|  User: 点击选择某条内容                          |
|         |                                       |
|         v                                       |
|  Renderer: 调用 ipcRenderer.invoke('paste')    |
|         |                                       |
|         v                                       |
|  Node.js: 读取 JSON 文件 -> 写入系统剪贴板 -> 模拟 Cmd+V |
|         |                                       |
|         v                                       |
|  目标应用: 收到粘贴命令                          |
+-------------------------------------------------+
```

---

## 四、源码目录结构

### 4.1 完整目录树

```
copies/
├── research.md                    # 本研究文档
├── README.md                      # 项目简介
├── SPEC.md                        # 功能规格说明
│
├── src/                           # 前端源码 (React + TypeScript)
│   ├── main.tsx                   # React 入口
│   ├── App.tsx                    # 根组件
│   ├── index.css                  # 全局样式 (Tailwind)
│   ├── components/
│   │   ├── HistoryPanel.tsx       # 主面板组件
│   │   ├── ClipboardItem.tsx      # 剪贴项组件
│   │   ├── EditorModal.tsx        # 编辑弹窗
│   │   ├── SearchBar.tsx          # 搜索栏
│   │   └── SettingsPanel.tsx      # 设置面板
│   ├── hooks/
│   │   ├── useClipboard.ts        # 剪贴板操作 Hook
│   │   ├── useHotkey.ts           # 快捷键 Hook
│   │   └── useDatabase.ts         # 数据库操作 Hook
│   ├── stores/
│   │   └── clipboardStore.ts      # Zustand 状态管理
│   ├── types/
│   │   └── index.ts               # TypeScript 类型定义
│   └── utils/
│       ├── ipc.ts                 # Electron IPC 封装
│       └── helpers.ts             # 工具函数
│
├── electron/                      # Electron 主进程源码
│   ├── main.ts                   # 主进程入口
│   ├── preload.ts                # 预加载脚本
│   ├── managers/
│   │   ├── clipboard.ts          # 剪贴板管理
│   │   ├── hotkey.ts             # 快捷键管理
│   │   ├── storage.ts            # 存储管理 (JSON File)
│   │   └── window.ts             # 窗口管理
│   └── services/
│       └── database.ts            # 数据库服务
│
├── package.json                   # Node 依赖
├── vite.config.ts                 # Vite 配置
├── electron-builder.json          # Electron 打包配置
├── tailwind.config.js             # Tailwind 配置
├── tsconfig.json                  # TypeScript 配置
├── index.html                     # HTML 入口
└── .gitignore
```

### 4.2 关键文件说明

#### 前端关键文件

| 文件                              | 作用                                               |
| --------------------------------- | -------------------------------------------------- |
| `src/hooks/useClipboard.ts`       | 封装剪贴板的读写操作，通过 Electron IPC 调用主进程 |
| `src/hooks/useHotkey.ts`          | 监听全局快捷键事件，控制面板显示/隐藏              |
| `src/stores/clipboardStore.ts`    | Zustand 全局状态，管理剪贴历史列表                 |
| `src/components/HistoryPanel.tsx` | 主面板 UI，列表展示 + 搜索 + 选择                  |

#### 主进程关键文件

| 文件                             | 作用                                      |
| -------------------------------- | ----------------------------------------- |
| `electron/main.ts`               | Electron 主进程入口，负责应用生命周期管理 |
| `electron/preload.ts`            | 预加载脚本，通过 contextBridge 暴露 API   |
| `electron/managers/clipboard.ts` | 使用 clipboard 库读写系统剪贴板           |
| `electron/managers/hotkey.ts`    | 使用 global-shortcut 注册快捷键           |
| `electron/managers/storage.ts`   | JSON 文件 CRUD 操作                       |
| `electron/services/database.ts`  | JSON 文件初始化和管理                     |

---

## 五、核心功能工作原理

### 5.1 剪贴板监听机制

1. 应用启动时启动后台定时轮询 (每 500ms)
2. 读取当前系统剪贴板内容 hash
3. 与上次记录对比:
   - 相同 -> 无操作
   - 不同 -> 新内容入队 (去重 + 长度限制)
4. 新内容存储到 JSON 文件
5. 通过 IPC 通知渲染进程更新 UI

**技术要点：**

- 使用 `clipboard` npm 包获取剪贴板文本内容
- 使用 SHA256 hash 快速比对内容是否变化
- 限制单条内容最大长度（如 10KB）防止异常
- 使用 `electron-clipboard-watcher` 自动监听剪贴板变化

### 5.2 全局快捷键原理

应用启动时:

- 注册 Cmd+Shift+V -> 显示历史面板

快捷键触发时:

1. 阻止系统默认行为 (如 Cmd+Shift+V)
2. 通过 IPC 事件通知渲染进程
3. 渲染进程收到事件 -> 显示/隐藏面板

**技术要点：**

- 使用 `electron` 的 `globalShortcut` 模块
- 需要在 `package.json` 或代码中声明快捷键权限
- 使用 macOS 的 Accessibility 权限实现全局拦截

### 5.3 面板显示与粘贴流程

**显示面板 (Cmd+Shift+V):**

1. Node.js 主进程检测到快捷键
2. 发送 IPC 事件 "show-panel" 给渲染进程
3. 渲染进程显示浮窗 (无边框、置顶、点击外部隐藏)
4. 加载历史记录列表

**选择并粘贴:**

1. 用户点击某条历史记录
2. 渲染进程调用 `ipcRenderer.invoke('paste', itemId)`
3. Node.js: 读取 JSON 文件内容 -> 写入系统剪贴板
4. Node.js: 模拟 Cmd+V 按键 (使用 `robotjs` 或 `enigo`)
5. 隐藏面板
6. 目标应用收到粘贴命令

**技术要点：**

- 使用 `robotjs` 或 `enigo` 模拟键盘输入
- macOS 可能需要 Accessibility 权限
- 窗口使用 `level: 'floating'` 实现置顶

### 5.4 数据持久化设计

```javascript
// JSON 文件结构设计

// 剪贴历史数据结构
{
  "clipboard_items": [
    {
      "id": 1,
      "content": "示例剪贴板内容",
      "content_hash": "sha256哈希值",
      "preview": "内容预览",
      "is_favorite": false,
      "is_pinned": false,
      "created_at": 1678886400000,
      "updated_at": 1678886400000,
      "used_count": 0
    }
  ]
}
```

---

## 六、关键技术点详解

### 6.1 面板窗口配置

```javascript
// electron/main.ts 窗口配置
const mainWindow = new BrowserWindow({
  width: 400,
  height: 500,
  resizable: false,
  frame: false,
  alwaysOnTop: true,
  skipTaskbar: true,
  show: false,
  center: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
  },
})
```

### 6.2 预加载脚本 API 暴露

```typescript
// electron/preload.ts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 剪贴板操作
  getClipboardItems: () => ipcRenderer.invoke('clipboard:getItems'),
  saveItem: (content: string) => ipcRenderer.invoke('clipboard:saveItem', content),
  deleteItem: (id: number) => ipcRenderer.invoke('clipboard:deleteItem', id),
  pasteItem: (id: number) => ipcRenderer.invoke('clipboard:pasteItem', id),

  // 面板控制
  onShowPanel: (callback: () => void) => ipcRenderer.on('show-panel', callback),
  onHidePanel: (callback: () => void) => ipcRenderer.on('hide-panel', callback),
  hidePanel: () => ipcRenderer.send('panel:hide'),

  // 剪贴板监听
  onClipboardChange: (callback: (item: ClipboardItem) => void) =>
    ipcRenderer.on('clipboard:changed', (_event, item) => callback(item)),
})
```

### 6.3 IPC 事件定义

| 事件名                 | 方向             | 载荷                | 说明           |
| ---------------------- | ---------------- | ------------------- | -------------- |
| `clipboard:changed`    | Main -> Renderer | `{ content, hash }` | 剪贴板内容变化 |
| `show-panel`           | Main -> Renderer | `{}`                | 显示历史面板   |
| `hide-panel`           | Main -> Renderer | `{}`                | 隐藏历史面板   |
| `clipboard:getItems`   | Renderer -> Main | `limit, offset`     | 获取历史列表   |
| `clipboard:saveItem`   | Renderer -> Main | `content: string`   | 保存新内容     |
| `clipboard:deleteItem` | Renderer -> Main | `id`                | 删除内容       |
| `clipboard:pasteItem`  | Renderer -> Main | `id`                | 选中并粘贴     |

### 6.4 渲染进程 API 类型定义

```typescript
// src/types/index.ts
export interface ClipboardItem {
  id: number
  content: string
  contentHash: string
  preview: string
  isFavorite: boolean
  isPinned: boolean
  createdAt: number
  updatedAt: number
  usedCount: number
}

export interface ElectronAPI {
  getClipboardItems: (limit: number, offset: number) => Promise<ClipboardItem[]>
  saveItem: (content: string) => Promise<number>
  deleteItem: (id: number) => Promise<boolean>
  pasteItem: (id: number) => Promise<boolean>
  onShowPanel: (callback: () => void) => void
  onHidePanel: (callback: () => void) => void
  hidePanel: () => void
  onClipboardChange: (callback: (item: ClipboardItem) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
```

---

## 七、macOS 特有考虑

### 7.1 菜单栏集成

- 在 NSMenu 中添加应用图标
- 用户点击图标可快速访问设置或退出

### 7.2 Accessibility 权限

- 模拟键盘输入需要用户授权 Accessibility 权限
- 应用首次运行时需要引导用户授权

### 7.3 启动方式

- 推荐使用 LSUIElement = true 以菜单栏应用方式运行（无 Dock 图标）
- 后台启动，开机自启（可选）

---

## 八、实现步骤

### 阶段一：项目初始化 (Day 1)

**任务：**

1. 安装 Electron 脚手架工具
2. 配置开发环境（Node.js 18+）
3. 初始化项目：`npm create electron-vite@latest copies -- --template react-ts`，确保所有核心依赖都使用最新版本
4. 验证空项目能正常运行

**验证标准：**

- `npm run dev` 能启动应用
- macOS 菜单栏出现应用图标

### 阶段二：主进程基础架构 (Day 2)

**任务：**

1. 配置 package.json 依赖（electron, fs-extra, clipboard, robotjs）
2. 实现 `electron/services/database.ts` - JSON 文件初始化和基础 CRUD
3. 实现 `electron/managers/clipboard.ts` - 剪贴板读写功能
4. 实现 `electron/managers/hotkey.ts` - 快捷键注册
5. 实现 `electron/preload.ts` - API 暴露

**验证标准：**

- Node.js 测试能读写系统剪贴板
- JSON 文件能正常创建和读写
- 快捷键能正确触发事件

### 阶段三：前后端联调 (Day 3)

**任务：**

1. 配置 Electron 窗口属性
2. 前端安装 Zustand, Tailwind CSS
3. 实现 `src/utils/ipc.ts` 封装 IPC 调用
4. 实现前端基础组件结构
5. 实现 Main -> Renderer IPC 事件传递

**验证标准：**

- 渲染进程能接收主进程发送的事件
- 面板能正常显示和隐藏
- 快捷键能触发面板显示

### 阶段四：剪贴板监听功能 (Day 4)

**任务：**

1. 实现剪贴板轮询监听
2. 实现内容去重和存储到 JSON 文件
3. 实现渲染进程列表展示
4. 实现新增、编辑、删除功能

**验证标准：**

- 复制内容能自动进入历史列表
- 列表能正确展示所有历史项
- CRUD 操作正常

### 阶段五：粘贴功能实现 (Day 5)

**任务：**

1. 实现选中项目后写入剪贴板
2. 实现模拟键盘粘贴
3. 实现面板自动隐藏
4. 优化用户体验（动画、过渡）

**验证标准：**

- 点击历史项能粘贴到目标应用
- 面板正确隐藏
- 粘贴成功率 >95%

### 阶段六：UI/UX 优化 (Day 6)

**任务：**

1. 美化面板样式（Tailwind CSS）
2. 添加搜索功能
3. 添加收藏/置顶功能
4. 添加右键菜单

**验证标准：**

- 面板美观易用
- 搜索响应 <100ms
- 所有交互符合预期

### 阶段七：打包发布 (Day 7)

**任务：**

1. 配置应用图标
2. 配置 LSUIElement（菜单栏模式）
3. 打包测试
4. 生成 .dmg 安装包

**验证标准：**

- 应用能正常安装运行
- 无 Dock 图标（菜单栏模式）
- 功能完整可用

--- End of content ---
