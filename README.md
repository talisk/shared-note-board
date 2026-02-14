# Shared Note Board (Static)

一个纯前端的共享 note 看板，适合部署在 GitHub Pages。

## 功能
- 三列看板：Todo / Doing / Done
- 新建、编辑、删除卡片
- 拖拽切换状态
- 搜索（标题/内容/标签）
- 一键导出 `notes.json`

## 数据存储方式
- 页面运行时读取仓库里的 `notes.json`
- 浏览器里编辑后，点击“导出 notes.json”下载最新数据
- 用下载后的 `notes.json` 覆盖仓库中的同名文件，再 commit + push

## 本地预览
直接打开 `index.html`，或：

```bash
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

## 发布到 GitHub Pages
1. 推送到 GitHub 仓库（比如 `shared-note-board`）
2. 仓库 Settings → Pages
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main` + `/root`
5. 保存后等待 1-2 分钟，访问：
   `https://<your-username>.github.io/<repo-name>/`

## 维护流程（你和我协作）
- 你在对话里给我改动需求
- 我改仓库文件（主要是 `notes.json` / UI）
- 我执行 `git add . && git commit -m "..." && git push`
- 页面自动更新
