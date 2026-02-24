# 悬浮笔记

一个可本地部署、始终置顶的桌面笔记应用，输入即自动保存到本机。支持开机启动（Windows / macOS）。

## 功能
- 窗口永远置顶，随时记录
- 自动保存到本地文件（位于系统用户数据目录）
- 支持勾选“开机启动”（设置会随笔记一起保存）
- 苹果风格的毛玻璃半透明 UI（更柔和的圆角与高光阴影）
- 笔记输入区内嵌放大的简约罗马时钟（数字环形均匀分布），含秒针实时转动
- 轻量、无网络依赖

## 本地运行

```bash
npm install
npm start
```

## 如何测试

### 1) 基础可运行性
```bash
node --check main.js
node --check preload.js
node --check renderer.js
```

### 2) 手动功能验证
1. 启动应用：`npm start`
2. 输入任意文字，等待约 0.5 秒，底部出现“已保存 xx:xx:xx”。
3. 关闭应用再打开，确认笔记内容仍在。
4. 勾选“开机启动”，关闭并重启系统后确认应用自动拉起（Windows/macOS）。
5. 观察罗马时钟秒针是否每秒转动。

## 如何预览效果

- 最直接方式：运行 `npm start`，会看到置顶悬浮窗口。
- 如需仅预览静态界面（不启动 Electron 主进程），可直接用浏览器打开 `index.html`。

## 不安装 Node.js，能不能直接运行？

可以。常见做法是把 Electron 程序打包成可分发安装包，然后用户只下载可执行文件：

- Windows：`.exe`（安装版 NSIS 或便携版 portable）
- macOS：`.dmg`
- Linux：`AppImage`

本项目已加入 `electron-builder`：

```bash
npm install
npm run pack:win
```

打包产物会在 `release/` 目录下。你可以把这些文件上传到 GitHub Releases，其他人无需安装 Node.js，下载 exe 后可直接运行。

### 自动生成 GitHub 可下载 exe

仓库已新增 GitHub Actions 工作流：`.github/workflows/release.yml`

触发方式：
1. 提交代码并推送
2. 打标签并推送（例如 `v0.2.0`）
3. Actions 会自动构建 Windows 安装包/便携版并上传到该 tag 的 Release

示例命令：
```bash
git tag v0.2.0
git push origin v0.2.0
```

## “创建拉取请求（PR）”是什么意思？

PR（Pull Request）就是把你的代码修改提交给团队进行评审和合并的请求，通常包含：
- 改了什么（Summary）
- 为什么改（Motivation）
- 如何验证（Testing）

## 保存位置

应用会将笔记保存为 `notes.json`，路径如下：
- macOS: `~/Library/Application Support/floating-notes/notes.json`
- Windows: `%APPDATA%\\floating-notes\\notes.json`
- Linux: `~/.config/floating-notes/notes.json`

## 开发说明

- 入口：`main.js`
- 渲染页面：`index.html`
- 自动保存逻辑：`renderer.js`
