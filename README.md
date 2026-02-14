# OpenClaw Skills Panel

这是一个静态看板项目（GitHub Pages），用于展示**已完成配置的 skills 一览**。

## 功能

- 技能卡片展示：名称 / 状态 / 用途 / 用法 / 备注
- 搜索（名称、用途、命令）
- 按状态筛选（enabled/configured/ready）
- 导出 `skills.json`

## 文件结构

- `index.html`：页面结构
- `styles.css`：样式
- `app.js`：渲染逻辑
- `skills.json`：技能清单数据源（重点维护）

## 维护约定（已执行）

后续每次新增或配置 skill 时，**同步更新 `skills.json`**，至少补齐：

- `name`
- `status`
- `purpose`
- `usage`
- `notes`
- `updatedAt`

## 本地预览

直接打开 `index.html` 或使用任意静态服务器。
