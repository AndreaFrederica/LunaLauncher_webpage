# Luna Launcher Website

这是 Luna Launcher 项目的官方网站,支持多国语言。

## 项目结构

```
website/
├── index.html           # 主 HTML 文件
├── styles.css           # 样式表
├── i18n.js             # 国际化 JavaScript 模块
├── locales/            # 语言文件目录
│   ├── zh-CN.json      # 简体中文
│   └── en-US.json      # 英文
└── resources/          # 图片资源
    ├── org.lunalauncher.LunaLauncher_256.png
    └── luna_home.png
```

## 功能特性

### 1. 分离的架构
- HTML、CSS 和 JavaScript 完全分离
- 更易于维护和扩展

### 2. 多国语言支持
- 支持简体中文 (zh-CN) 和英文 (en-US)
- 自动检测浏览器语言
- 用户选择的语言会保存在 localStorage 中

### 3. 响应式设计
- 支持桌面和移动设备
- 自适应不同屏幕尺寸
- 明暗主题自动切换

### 4. LunaUI 文档入口
- 官网首页包含 LunaUI 自定义面板脚本能力介绍
- 提供开发文档与 `.d.ts` 类型定义的入口链接:
  - `docs/lunaui/README.md`
  - `docs/lunaui/lunaui.d.ts`

## 如何使用

### 本地预览

由于国际化功能需要通过 HTTP 服务器加载 JSON 文件,你需要:

1. **使用 Python 启动本地服务器:**
   ```bash
   cd website
   python -m http.server 8000
   ```

2. **或使用 Node.js 的 http-server:**
   ```bash
   cd website
   npx http-server -p 8000
   ```

3. **或使用 VS Code 的 Live Server 扩展**

然后在浏览器中访问 `http://localhost:8000`

## 添加新语言

要添加新的语言支持:

1. 在 `locales/` 目录下创建新的 JSON 文件,例如 `ja-JP.json` (日文)
2. 复制现有语言文件的结构并翻译内容
3. 在 `index.html` 的语言选择器中添加新选项:
   ```html
   <option value="ja-JP">日本語</option>
   ```
4. 在 `i18n.js` 的 `supportedLangs` 数组中添加新语言代码:
   ```javascript
   const supportedLangs = ['zh-CN', 'en-US', 'ja-JP'];
   ```

## 自定义样式

所有样式都在 `styles.css` 中,使用 CSS 变量定义颜色和其他主题属性:

```css
:root {
    --bg: #0b1020;
    --surface: rgba(255, 255, 255, 0.08);
    --accent: #7c5cff;
    /* ... */
}
```

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

需要支持:
- ES6+ JavaScript 特性
- CSS Grid 和 Flexbox
- CSS Custom Properties (变量)
- Fetch API

## 技术栈

- 纯 HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- 无外部依赖

## 许可证

与 Luna Launcher 项目保持一致
