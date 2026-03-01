# 从 ESLint + Prettier 迁移到 oxlint + oxfmt

## 概述

本文档详细说明如何将当前项目从 ESLint + Prettier 迁移到 oxlint + oxfmt。oxlint 是一个超快的 JavaScript/TypeScript linter，而 oxfmt 是其配套的代码格式化工具。

## 当前配置分析

### 依赖包

- `eslint`: ^9.18.0
- `@eslint/js`: ^9.18.0
- `@typescript-eslint/eslint-plugin`: ^8.56.1
- `@typescript-eslint/parser`: ^8.56.1
- `typescript-eslint`: ^8.56.1
- `eslint-config-prettier`: ^10.1.8
- `eslint-plugin-react`: ^7.37.5
- `eslint-plugin-react-hooks`: ^7.0.1
- `eslint-plugin-react-refresh`: ^0.5.2
- `prettier`: ^3.5.3

### 配置文件

- `.eslintrc` (ESLint 旧版配置)
- `eslint.config.js` (ESLint Flat Config)
- `.prettierrc` (Prettier 配置)

### 脚本命令

- `format`: `prettier --write .`
- `lint`: `eslint . --ext .js,.jsx,.ts,.tsx`

## 迁移步骤

### 步骤 1: 卸载旧的依赖包

```bash
npm uninstall eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript-eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier
```

### 步骤 2: 安装 oxlint 和 oxfmt

```bash
npm install -D oxlint oxfmt
```

### 步骤 3: 创建 oxfmt 配置文件

创建 `.oxfmt.toml` 文件，内容如下：

```toml
# 代码格式化配置
# 对应原 Prettier 配置的迁移

indent_width = 2
quote_style = "single"
line_ending = "Unix"
print_width = 100
trailing_comma = "ES5"
arrow_parentheses = "AsNeeded"
semi_colons = false
```

### 步骤 4: 创建 oxlint 配置文件

创建 `oxlint.json` 文件，内容如下：

```json
{
  "categories": {
    "correctness": "warn",
    "suspicious": "warn",
    "perf": "warn",
    "style": "warn",
    "complexity": "warn",
    "bugrisk": "error"
  },
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "ignore": ["dist", "dist-electron", "node_modules", "coverage", "build"],
  "settings": {
    "typescript": {
      "version": "5.9.3"
    }
  },
  "overrides": [
    {
      "files": ["src/**/*.{ts,tsx}"],
      "env": {
        "browser": true
      }
    },
    {
      "files": ["electron/**/*.{ts,tsx}"],
      "env": {
        "node": true
      }
    }
  ]
}
```

### 步骤 5: 更新 package.json 脚本

修改 `package.json` 中的 `scripts` 部分：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder",
    "preview": "vite preview",
    "electron:serve": "vite serve",
    "electron:build": "vite build && electron-builder --dir",
    "postinstall": "electron-builder install-app-deps",
    "format": "oxfmt .",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "typecheck": "tsc"
  }
}
```

**变更说明：**

- `format`: 从 `prettier --write .` 改为 `oxfmt .`
- `lint`: 从 `eslint . --ext .js,.jsx,.ts,.tsx` 改为 `oxlint`
- 新增 `lint:fix`: `oxlint --fix`（自动修复可修复的问题）

### 步骤 6: 删除旧配置文件

删除以下旧配置文件：

- `.eslintrc`
- `eslint.config.js`
- `.prettierrc`

```bash
rm .eslintrc eslint.config.js .prettierrc
```

### 步骤 7: 运行格式化和检查

```bash
# 格式化所有代码
npm run format

# 运行 linter
npm run lint

# 如果有可修复的问题，自动修复
npm run lint:fix
```

### 步骤 8: 验证迁移

确保以下方面正常工作：

1. 代码格式化符合预期
2. Linter 检查没有报错
3. 项目能正常构建和运行
4. TypeScript 类型检查正常（`npm run typecheck`）

## 配置映射说明

### Prettier → oxfmt 映射

| Prettier 配置          | oxfmt 配置                       | 说明                     |
| ---------------------- | -------------------------------- | ------------------------ |
| `semi: false`          | `semi_colons = false`            | 不使用分号               |
| `tabWidth: 2`          | `indent_width = 2`               | 缩进 2 空格              |
| `singleQuote: true`    | `quote_style = "single"`         | 单引号                   |
| `printWidth: 100`      | `print_width = 100`              | 行宽 100                 |
| `trailingComma: "es5"` | `trailing_comma = "ES5"`         | ES5 尾随逗号             |
| `arrowParens: "avoid"` | `arrow_parentheses = "AsNeeded"` | 箭头函数参数单时不加括号 |

### ESLint → oxlint 规则映射

| ESLint 规则                                         | oxlint 分类 | 说明                      |
| --------------------------------------------------- | ----------- | ------------------------- |
| `indent`                                            | style       | 缩进检查                  |
| `linebreak-style`                                   | style       | 换行符风格                |
| `quotes`                                            | style       | 引号风格                  |
| `semi`                                              | style       | 分号使用                  |
| `@typescript-eslint/no-unused-vars`                 | suspicious  | 未使用变量                |
| `@typescript-eslint/no-explicit-any`                | complexity  | any 类型使用              |
| `@typescript-eslint/explicit-module-boundary-types` | -           | oxlint 不强制要求，已移除 |

## 注意事项

### 1. 规则差异

oxlint 和 ESLint 在某些规则上可能存在差异，迁移后需要：

- 运行 `npm run lint` 检查是否有新的警告
- 根据实际需求调整 `oxlint.json` 中的规则级别（error/warn/off）

### 2. React 相关规则

oxlint 内置了对 React 的支持，无需额外配置插件。原配置中的：

- `react/jsx-uses-react`
- `react/jsx-uses-vars`
- `react-hooks` 相关规则
- `react-refresh` 相关规则

这些规则在 oxlint 中会自动应用或被覆盖。

### 3. TypeScript 支持

oxlint 原生支持 TypeScript，无需额外配置 parser。确保 `oxlint.json` 中的 `settings.typescript.version` 与项目实际使用的 TypeScript 版本一致。

### 4. Git 钩子集成

如果项目使用了 Husky 或其他 Git 钩子工具，需要更新钩子配置：

```bash
# .husky/pre-commit (示例)
npm run format
npm run lint
```

### 5. CI/CD 配置

更新 CI/CD 配置文件（如 GitHub Actions、GitLab CI 等）中的 lint 和 format 命令：

```yaml
# 示例
- name: Lint and Format
  run: |
    npm run format
    npm run lint
```

## 性能提升

迁移到 oxlint 和 oxfmt 后，预期可以获得以下性能提升：

- **Lint 速度**: oxlint 比 ESLint 快 50-100 倍
- **格式化速度**: oxfmt 与 Prettier 相当或更快
- **依赖体积**: 减少约 30-40 个依赖包

## 回滚方案

如果迁移后遇到问题，可以按以下步骤回滚：

```bash
# 1. 恢复旧依赖
npm install -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript-eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier

# 2. 删除新依赖
npm uninstall oxlint oxfmt

# 3. 恢复旧配置文件
git checkout .eslintrc eslint.config.js .prettierrc

# 4. 恢复 package.json 脚本
git checkout package.json

# 5. 删除新配置文件
rm oxfmt.json .oxfmt.toml
```

## 参考资料

- [oxlint 官方文档](https://oxlint.com/)
- [oxfmt 官方文档](https://oxfmt.com/)
- [oxlint 规则列表](https://oxlint.com/rules)
- [oxfmt 配置选项](https://oxfmt.com/config)

## 总结

通过以上步骤，你将成功完成从 ESLint + Prettier 到 oxlint + oxfmt 的迁移。新工具链将提供更快的执行速度和更简洁的配置，同时保持代码质量和格式化的一致性。

迁移完成后，建议：

1. 在团队中推广新工具的使用
2. 更新项目文档和开发指南
3. 收集团队反馈，持续优化配置
