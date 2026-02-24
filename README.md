# 悬浮笔记

一个可本地部署、始终置顶的桌面笔记应用，输入即自动保存到本机。支持开机启动（Windows / macOS）。

## 功能
- 窗口永远置顶，随时记录
- 自动保存到本地文件（位于系统用户数据目录）
- 支持勾选“开机启动”（设置会随笔记一起保存）
- 毛玻璃半透明 UI 与圆角面板
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
