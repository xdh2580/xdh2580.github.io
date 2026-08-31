# AGENTS.md — Agent 项目协作说明

> 本文件用于向参与本项目开发的 AI Agent 说明项目信息、约定与协作要求。
> 开始任何任务前，请先通读本文件，尤其是【Agent 工作守则】部分。

## 一、项目概述

- **项目名称**：xdh2580.github.io（个人技术博客，站名 "Love Always Had A Way"）
- **托管方式**：GitHub Pages（用户页），`main` 分支直接发布
- **定位**：面向**测试工程师 / 开发初学者**的中文技术学习笔记站
- **博客作者**：xdh2580（测试工程师，全栈向学习路线：测试基础 → 接口/自动化 → 前端 → 容器/运维）
- **内容现状**：`_posts/` 下已有 30+ 篇系统性学习文章，覆盖 Docker、Nginx、Java、Python、前端（HTML/CSS/JS/Vue）、测试理论、接口测试（Postman/Jmeter）、自动化（Selenium/Playwright/UIAutomator2）、数据库（SQL）、网络（HTTP/MQTT/计算机网络）、Jenkins、算法等。

## 二、技术栈与本地运行

- **静态站点生成器**：Jekyll（Ruby）
- **主题**：Minimal Mistakes（`minimal-mistakes-jekyll`，gem-based，本地直接 fork 全量文件）
- **依赖管理**：`Gemfile` + `gemspec`（项目自带主题源码，不是 remote_theme 方式）
- **本地预览**：双击运行 `start-server.bat`（即 `bundle exec jekyll serve --livereload`），访问 `http://127.0.0.1:4000`
- **构建/配置**：核心配置在 `_config.yml`，修改后需重启 server 才生效

## 三、目录结构速览（与日常工作相关的部分）

| 目录/文件 | 作用 | 注意事项 |
| :--- | :--- | :--- |
| `_posts/` | **文章存放目录**，命名 `YYYY-MM-DD-标题.md` | 新增/修改文章的**主战场** |
| `_posts/Details/` | 专题深入文章子目录（如 pytest 配置、性能测试等） | 与主文章配套的进阶内容 |
| `_data/` | 导航、UI 文案等数据文件（`navigation.yml` 等） | 修改导航时用 |
| `_includes/` | Liquid 模板片段（`head/`、`footer/`、`sidebar-custom.html` 等） | **多数自定义功能的落点，改动需谨慎** |
| `_layouts/` | 页面布局模板 | 一般不改 |
| `_sass/` | 主题样式源码 | 自定义样式可在此或 `assets/css/main.scss` 覆盖 |
| `assets/js/` | 自定义脚本（`fluid-cursor.js` 等） | 全局效果脚本所在 |
| `assets/images/` | 文章配图 | 引用路径统一 `{{ site.url }}{{ site.baseurl }}/assets/images/...` |
| `_config.yml` | 站点全局配置 | 已开启搜索（lunr）、分页、sitemap 等 |
| `index.html` | 首页（`layout: home`） | 一般不改 |

## 四、文章写作规范（重要）

### 4.1 Front Matter 格式

新增文章**必须**带 Front Matter，示例：

```yaml
---
title: "主题相关"
categories:
  - 分类名
tags:
  - 标签1
  - 标签2
toc: true
order: 3
---
```

- `title`：一律用双引号包裹，格式为「主题相关」，如 `"Docker相关"`、`"Java相关"`
- `categories` / `tags`：列表形式，与文章内容强相关
- `toc: true`：默认开启目录
- `order`：**手动排序字段**（站点在分页基础上支持对 post 手动排序），新文章按插入位置填合适的值，避免与现有文章冲突

### 4.2 内容风格（沿用站内既有风格）

- 面向**测试工程师/初学者**，中文写作
- 一级标题使用「XXX 完整系统学习大纲」模式（如 `# Docker 容器化与微服务 完整系统学习大纲`）
- 结构强烈依赖**分级编号**：`## 一、` → `### 1.1` → `####`，编号层级要严谨
- 善用**表格**对比概念（如「容器 vs 虚拟机」）、**代码块**（标注语言）、**引用块**（`>` 写要点总结/注意事项）、**列表**（分点说明）
- 重点名词加粗 `**`，正文关键结论用「一句话」引用块收束
- 涉及命令时注明运行环境（如「Windows 用户请在 PowerShell（非 cmd）中执行」）

### 4.3 文章发布流程

1. 在 `_posts/` 下按 `YYYY-MM-DD-主题.md` 命名创建
2. 写完按下方【提交规范】commit
3. push 到 `main` 后 GitHub Pages 自动部署（无需手动构建）

## 五、站点已有的自定义功能（改动前务必先了解）

以下功能是历次迭代加入的，**修改或删除前请先告知用户并确认**，避免破坏现有体验：

- 站内**搜索**（lunr，`_config.yml` 中 `search: true`，含全文搜索）
- **鼠标滑动特效**（`assets/js/fluid-cursor.js` + `_includes/lusion-cursor.html`）
- **details 标签样式** + 展开后底部「收起」按钮
- 文章页**返回顶部**按钮
- **首页中间区域加宽**样式调整
- **分页 + post 手动排序**（`order` 字段）
- 曾实现过 pjax 音乐连续播放（`APlayer.min.js`），**因有 bug 已移除**——如无必要不要重新引入 pjax

## 六、Agent 工作守则

1. **先读后改**：修改 `_includes/`、`_layouts/`、`_sass/`、`_config.yml` 前，先把相关文件读完整再动手；不要凭模板常识直接重构。
2. **小步修改**：尽量用精准的局部编辑，不要整体重写大文件；`main.min.js` 是构建产物，不要手改。
3. **新增文件从简**：能在 `_posts/` 内解决的，不新增页面/脚本/依赖；确需新增依赖时先说明理由。
4. **保持风格一致**：新文章的 Front Matter、标题层级、表格/引用块用法，严格对齐第四节规范。
5. **不要碰无关文件**：`docs/`、`test/` 是主题自带的演示内容，除非用户明确要求，不要改动。
6. **本地可验证**：有条件时用 `start-server.bat` 起本地预览验证修改效果（尤其是布局/样式类改动）。
7. **提交规范**：
   - 提交信息**短小精悍**，沿用项目既有前缀风格：
     - 新增文章 → `post-文章主题`（如 `post-docker`）
     - 修改/新增功能 → `update-改动说明`（如 `update-打开搜索功能`）
     - 删除内容 → `delete-删除说明`（如 `delete-先移除pjax实现的音乐连续播放效果`)
     - 更新post内容 → `post-something`
   - **只有当用户明确要求时**才执行 commit / push，不要主动提交。
8. **诚实反馈**：遇到主题或 Jekyll 的边界问题，如实说明限制，不要为了"完成任务"而引入绕过式的脏代码。

## 七、作者手动补充（重要）
1. 创建新的post大纲时，注意覆盖内容要全面，由浅入深，详略得当。
2. 所有代码块要标注语言类型。
3. 可以用details标签折叠一些比较多的或者不太是重点的展开内容（具体什么内容该折叠，自行判断），当然不该折叠的内容不要乱用。
4. 完整完成一次更新后，直接commit并附上提交信息，不要push。
5. 