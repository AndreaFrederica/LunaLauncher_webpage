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

---

# 构建 Luna Launcher

## NextGen 构建（Meson + Pixi）— 推荐方式

新的构建系统使用 **Meson** 构建，**Pixi** 管理依赖。这是推荐的构建方式。

### 前置要求

- [Pixi](https://pixi.sh/latest/installation/)
- **Windows：** Visual Studio 2022 Build Tools（在 x64 Native Tools Command Prompt 中运行）
- **Linux：** `gcc`、`g++`、`pkg-config`、Qt 6 开发库

### 快速开始

```bash
# 克隆仓库（含子模块）
git clone --recursive https://github.com/AndreaFrederica/LunaLauncher.git
cd LunaLauncher

# 配置 + 构建 + 安装
pixi run configure
pixi run build
pixi run install
```

### 可用任务

| 命令 | 说明 |
|------|------|
| `pixi run configure` | 配置 Meson 构建目录 |
| `pixi run build` | 使用 Meson 编译 |
| `pixi run install` | 安装到 `install-{profile}/` |
| `pixi run deploy` | 部署 Qt 运行时 DLL（仅 Windows） |
| `pixi run test` | 运行构建产物 |
| `pixi run clean-all` | 清理所有构建目录 |

### 构建配置

| 配置 | 说明 |
|------|------|
| `release`（默认） | Release 构建，静态库 |
| `debug` | Debug 构建，动态库 |
| `linux-x64-gcc-release` | 从 Windows 交叉编译 Linux 版本 |

```bash
pixi run build --profile debug
```

### 离线测试构建（仅用于自动化测试）

CI/自动化测试可以构建禁用所有权验证的版本：

```powershell
# PowerShell
$env:LUNA_DISABLE_OWNERSHIP_CHECK = "1"
$env:LUNA_BUILD_DIR = "test-offline/build"
$env:LUNA_INSTALL_DIR = "test-offline/install"
pixi run build debug
```

或使用内置任务：

```bash
pixi run build-test-offline
```

> **警告：** 离线测试构建会禁用 Minecraft 所有权验证。仅用于自动化测试，不要用于正式构建。

### 隔离构建（多分支并行）

使用 `LUNA_BUILD_DIR` 和 `LUNA_INSTALL_DIR` 隔离不同分支的构建：

```bash
LUNA_BUILD_DIR=branch-a/build LUNA_INSTALL_DIR=branch-a/install pixi run build debug
```

相对路径会自动解析到项目根目录下。

---

## 旧版构建（CMake）— 已弃用

> **注意：** 基于 CMake 的构建系统已**弃用**，将在未来版本中移除。请迁移到上方的 Meson + Pixi 构建方式。

<details>
<summary>点击展开旧版 CMake 构建说明</summary>

### Windows（MSYS2）

```bash
pacboy -S toolchain:p cmake:p ninja:p qt6-base:p qt6-5compat:p qt6-svg:p qt6-imageformats:p quazip-qt6:p extra-cmake-modules:p ccache:p

cmake -Bbuild -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=install
cmake --build build
cmake --install build
```

### Windows（MSVC）

```cmd
REM 在 x64 Native Tools Command Prompt 中运行
cmake -Bbuild -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=install -DCMAKE_PREFIX_PATH=C:\Qt\6.x.x\msvc2022_64\lib\cmake
cmake --build build
cmake --install build
```

### Linux / macOS

参考 [上游 Prism Launcher 文档](https://prismlauncher.org/wiki/development/)。

</details>
