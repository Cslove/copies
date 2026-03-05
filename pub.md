# Electron 应用 GitHub Actions 打包构建部署完整流程

## 概述

本文档详细介绍了如何在 GitHub 上实现 Electron 应用的自动化打包、构建和发布流程，最终在 GitHub Release 页面提供最新版本的应用下载。

## 前置条件

### 1. 项目基础配置确认

当前项目已经具备以下基础配置：

- **构建工具**：Vite + Electron Builder
- **构建命令**：`npm run build`（包含 TypeScript 编译、Vite 构建和 Electron 打包）
- **应用信息**：
  - 应用名称：Copies
  - 应用 ID：com.copies.app
  - 输出目录：dist
  - 目标平台：macOS（dmg 格式）

### 2. 必要的 GitHub 准备工作

#### 2.1 创建 GitHub Personal Access Token (PAT)

1. 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 设置 Token 名称，如 "electron-release-token"
4. 选择必要的权限：
   - `repo`（完整仓库访问权限）
   - `workflow`（工作流权限）
5. 生成后复制保存 Token

#### 2.2 在仓库中配置 Secrets

1. 进入你的 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 添加以下 Secret：
   - **Name**: `GH_TOKEN`
   - **Value**: 刚才生成的 Personal Access Token

## GitHub Actions 工作流配置

### 1. 创建工作流文件

在项目根目录创建 `.github/workflows/release.yml` 文件：

```yaml
name: Build and Release Electron App

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-and-release:
    runs-on: macos-latest
    
    steps:
      # 1. 检出代码
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      # 2. 设置 Node.js 环境
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      # 3. 安装依赖
      - name: Install dependencies
        run: npm ci
      
      # 4. 构建应用
      - name: Build Electron app
        run: npm run build
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
      
      # 5. 创建 Release
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/*.dmg
            dist/*.zip
          draft: false
          prerelease: false
          generate_release_notes: true
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

### 2. 工作流配置说明

#### 触发条件
- **标签推送**：当推送以 `v` 开头的标签时（如 `v1.0.0`）自动触发
- **手动触发**：可以在 GitHub Actions 页面手动运行

#### 权限配置
```yaml
permissions:
  contents: write
```
确保工作流有权限创建 Release 和上传文件。

#### 构建步骤详解

1. **检出代码**：使用 `fetch-depth: 0` 获取完整的 Git 历史，用于生成 Release Notes

2. **设置 Node.js 环境**：
   - 使用 Node.js 20 版本
   - 启用 npm 缓存以加快构建速度

3. **安装依赖**：使用 `npm ci` 而非 `npm install`，确保依赖版本一致性

4. **构建应用**：
   - 执行 `npm run build` 命令
   - 传递 `GH_TOKEN` 环境变量，Electron Builder 需要它来签名应用

5. **创建 Release**：
   - 上传 `dist` 目录下的 `.dmg` 和 `.zip` 文件
   - 自动生成 Release Notes
   - 直接发布，不设为草稿

## 版本发布流程

### 1. 更新版本号

在 `package.json` 中更新版本号：

```json
{
  "version": "1.0.1"
}
```

### 2. 提交代码

```bash
git add package.json
git commit -m "chore: bump version to 1.0.1"
git push
```

### 3. 创建并推送标签

```bash
git tag v1.0.1
git push origin v1.0.1
```

### 4. 自动构建流程

推送标签后，GitHub Actions 会自动：

1. 检出代码
2. 安装依赖
3. 构建 Electron 应用
4. 创建 GitHub Release
5. 上传构建产物

### 5. 下载应用

构建完成后，访问 GitHub Release 页面即可下载最新版本的应用。

## 高级配置选项

### 1. 多平台构建

如果需要支持多个平台，可以修改工作流：

```yaml
jobs:
  build-and-release:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    
    steps:
      # ... 其他步骤保持不变
      
      - name: Build Electron app
        run: npm run build
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.os }}-build
          path: dist/*
```

### 2. 代码签名

#### macOS 代码签名

1. 在 Apple Developer 获取开发者证书
2. 导出证书为 `.p12` 文件
3. 在 GitHub Secrets 中添加：
   - `CERTIFICATE_MACOS`: Base64 编码的证书内容
   - `CERTIFICATE_PASSWORD`: 证书密码
   - `APPLE_ID`: Apple ID
   - `APPLE_PASSWORD`: App-specific password

4. 修改工作流添加签名步骤：

```yaml
- name: Import certificate
  run: |
    echo "${{ secrets.CERTIFICATE_MACOS }}" | base64 --decode > certificate.p12
    security create-keychain -p "" build.keychain
    security import certificate.p12 -k build.keychain -P "${{ secrets.CERTIFICATE_PASSWORD }}" -T /usr/bin/codesign
    security list-keychains -s build.keychain
    security default-keychain -s build.keychain
    security unlock-keychain -p "" build.keychain
    security set-key-partition-list -S apple-tool:,apple: -s -k "" build.keychain

- name: Build with signing
  run: npm run build
  env:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}
    CSC_KEY_PASSWORD: ${{ secrets.CERTIFICATE_PASSWORD }}
    CSC_LINK: certificate.p12
    APPLE_ID: ${{ secrets.APPLE_ID }}
    APPLE_ID_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
```

### 3. 自动化版本管理

使用 semantic-release 自动管理版本：

```yaml
- name: Release
  run: npx semantic-release
  env:
    GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

### 4. 构建缓存优化

添加缓存以加快构建速度：

```yaml
- name: Cache Electron Builder
  uses: actions/cache@v3
  with:
    path: |
      ~/.cache/electron-builder
      ~/Library/Caches/electron-builder
    key: ${{ runner.os }}-electron-builder-${{ hashFiles('**/package-lock.json') }}
```

## 故障排查

### 1. 构建失败

**问题**：`npm run build` 失败

**解决方案**：
- 检查 `package.json` 中的构建脚本是否正确
- 确认所有依赖都已正确安装
- 查看构建日志中的具体错误信息

### 2. Release 创建失败

**问题**：无法创建 GitHub Release

**解决方案**：
- 确认 `GH_TOKEN` 有正确的权限
- 检查 `permissions` 配置是否包含 `contents: write`
- 确认标签格式正确（如 `v1.0.0`）

### 3. 文件上传失败

**问题**：构建产物未上传到 Release

**解决方案**：
- 检查 `files` 路径是否正确
- 确认构建输出目录是否为 `dist`
- 查看构建日志确认文件是否生成

### 4. 代码签名失败

**问题**：macOS 应用签名失败

**解决方案**：
- 确认证书格式正确
- 检查证书密码是否正确
- 确认开发者证书有效

## 最佳实践

### 1. 版本号管理

遵循语义化版本规范（Semantic Versioning）：
- `MAJOR.MINOR.PATCH`（如 `1.0.0`）
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 2. Release Notes

在创建标签时添加描述：

```bash
git tag -a v1.0.1 -m "Release v1.0.1

## 新增功能
- 添加搜索功能
- 支持多语言

## 修复问题
- 修复剪贴板监听问题
- 优化内存使用"
```

### 3. 测试构建

在正式发布前，先在开发分支测试构建流程：

```bash
git tag -a v1.0.1-beta.1 -m "Beta release"
git push origin v1.0.1-beta.1
```

### 4. 构建监控

设置 GitHub Actions 通知，及时了解构建状态：
- 在仓库 Settings → Notifications 中配置
- 可以设置邮件或 Slack 通知

## 项目特定配置

基于当前项目的配置，以下是一些重要说明：

### 1. 构建输出

- **输出目录**：`dist`
- **主要产物**：
  - `Copies-1.0.0.dmg`：macOS 安装包
  - `Copies-1.0.0-mac.zip`：macOS 压缩包

### 2. 应用配置

```json
{
  "appId": "com.copies.app",
  "productName": "Copies",
  "category": "public.app-category.productivity"
}
```

### 3. 构建脚本

```json
{
  "scripts": {
    "build": "tsc && vite build && electron-builder"
  }
}
```

该命令会依次执行：
1. TypeScript 编译
2. Vite 前端构建
3. Electron 应用打包

## 总结

通过以上配置，你的 Electron 应用将实现：

1. ✅ 自动化的构建和发布流程
2. ✅ 在 GitHub Release 页面提供下载
3. ✅ 支持版本管理和更新
4. ✅ 可扩展的多平台支持
5. ✅ 可选的代码签名功能

完成这些配置后，只需推送版本标签即可自动触发构建和发布流程，大大简化了发布流程。
