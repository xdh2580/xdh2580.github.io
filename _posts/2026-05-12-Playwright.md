---
title: "Playwright相关"
categories:
  - Playwright
tags:
  - Playwright
toc: true
order: 3
---
# Playwright 自动化测试框架 完整系统学习大纲

---
## 一、Playwright 概述
### 1.1 Playwright 简介
**Playwright** 是 Microsoft 开发的一个现代化的端到端（E2E）测试框架，支持 Chromium、Firefox 和 WebKit 三大浏览器引擎。它专为现代 Web 应用程序而设计，提供了跨浏览器、跨平台、跨语言的自动化测试能力。

### 1.2 Playwright 核心特性
*   **跨浏览器支持**：Chromium、Firefox、WebKit（Safari）
*   **跨平台支持**：Windows、macOS、Linux
*   **多语言支持**：JavaScript/TypeScript、Python、Java、.NET
*   **自动等待**：智能等待元素可用
*   **网络拦截**：模拟 API 响应，修改网络请求
*   **多页上下文**：支持多标签页、多用户场景
*   **设备模拟**：模拟移动设备、地理位置、权限
*   **并行执行**：内置并行测试支持
*   **无头模式**：支持有头和无头浏览器运行
*   **代码生成**：通过录制生成测试代码
*   **跟踪查看器**：可视化测试执行过程
*   **屏幕截图和视频**：自动录制测试视频

### 1.3 Playwright 与 Selenium 对比

| 特性 | Playwright | Selenium WebDriver |
|------|-----------|-------------------|
| 架构 | 基于 CDP 协议 | 基于 W3C WebDriver 标准 |
| 执行速度 | 更快，更稳定 | 相对较慢 |
| 自动等待 | 内置智能等待 | 需要显式等待 |
| 浏览器支持 | Chromium, Firefox, WebKit | 所有浏览器 |
| 网络拦截 | 原生支持 | 需要额外工具 |
| 移动端支持 | 设备模拟 | 需要 Appium |
| 安装配置 | 一体化安装 | 需要驱动配置 |
| 社区生态 | 快速发展 | 成熟稳定 |
| 学习曲线 | 相对平缓 | 有一定学习成本 |

### 1.4 Playwright 应用场景
1.  **端到端测试**：完整的用户流程验证
2.  **组件测试**：UI 组件交互验证
3.  **API 测试**：网络请求模拟和验证
4.  **性能测试**：页面加载性能监控
5.  **视觉回归测试**：UI 截图比对
6.  **爬虫开发**：数据抓取和自动化
7.  **自动化任务**：批量操作、数据录入
8.  **监控报警**：网站可用性监控

---

## 二、快速开始
### 2.1 环境要求
*   **Node.js**：版本 14 或更高
*   **Python**：版本 3.7 或更高（Python 版本）
*   **Java**：JDK 8 或更高（Java 版本）
*   **.NET**：.NET Core 3.1 或更高（.NET 版本）
*   **操作系统**：Windows 8+，macOS 10.14+，Linux

### 2.2 安装配置
#### 2.2.1 JavaScript/TypeScript 安装

```bash
# 1. 初始化项目
npm init playwright@latest

# 2. 安装到现有项目
npm i -D @playwright/test
npm i -D playwright

# 3. 安装浏览器
npx playwright install
npx playwright install chromium firefox webkit

# 4. 检查版本
npx playwright --version
```

#### 2.2.2 Python 安装

```bash
# 1. 安装 Playwright
pip install pytest-playwright
pip install playwright

# 2. 安装浏览器
playwright install
playwright install chromium firefox webkit
```

#### 2.2.3 项目结构
```
playwright-project/
├── tests/ # 测试文件
│ ├── example.spec.js # 测试用例
│ ├── api/ # API 测试
│ ├── e2e/ # 端到端测试
│ └── fixtures/ # 测试夹具
├── pages/ # 页面对象模型
│ ├── login.page.js
│ └── dashboard.page.js
├── utils/ # 工具函数
├── playwright.config.js # 配置文件
├── package.json
└── .gitignore
```
### 2.3 第一个测试脚本

```javascript
// tests/first-test.spec.js
const { test, expect } = require('@playwright/test');

test('基本测试示例', async ({ page }) => {
  // 1. 导航到页面
  await page.goto('https://example.com');
  
  // 2. 检查页面标题
  await expect(page).toHaveTitle('Example Domain');
  
  // 3. 获取元素并断言
  const heading = page.locator('h1');
  await expect(heading).toHaveText('Example Domain');
  
  // 4. 点击链接
  const link = page.getByText('More information...');
  await link.click();
  
  // 5. 验证 URL
  await expect(page).toHaveURL(/iana/);
});

test('表单操作测试', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  
  // 输入文本
  await page.locator('.new-todo').fill('Buy milk');
  await page.locator('.new-todo').press('Enter');
  
  // 验证列表项
  await expect(page.locator('.view label')).toHaveText('Buy milk');
  
  // 复选框操作
  await page.locator('.toggle').check();
  await expect(page.locator('.todo-list li')).toHaveClass('completed');
});
```

### 2.4 运行测试

```bash
# 运行所有测试
npx playwright test

# 运行特定文件
npx playwright test tests/login.spec.js

# 运行带标签的测试
npx playwright test --grep "login"

# 在特定浏览器运行
npx playwright test --project=chromium

# 在 UI 模式下运行
npx playwright test --ui

# 调试模式
npx playwright test --debug

# 生成报告
npx playwright test --reporter=html
npx playwright show-report
```

---

## 三、核心概念
### 3.1 浏览器上下文
**浏览器上下文**是 Playwright 的核心概念，它代表了一个独立的浏览器会话，包含 cookie、缓存、本地存储等。


```javascript
const { chromium } = require('playwright');

test('浏览器上下文示例', async () => {
  // 启动浏览器
  const browser = await chromium.launch();
  
  // 创建浏览器上下文
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    colorScheme: 'dark',
    permissions: ['geolocation'],
    geolocation: { latitude: 31.2304, longitude: 121.4737 },
    ignoreHTTPSErrors: true,
    offline: false
  });
  
  // 在上下文中创建页面
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  // 设置 Cookie
  await context.addCookies([
    {
      name: 'session',
      value: 'abc123',
      domain: 'example.com',
      path: '/'
    }
  ]);
  
  // 清除上下文
  await context.clearCookies();
  await context.clearPermissions();
  
  // 关闭上下文
  await context.close();
  await browser.close();
});
```

**上下文配置选项**：

| 配置项 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| viewport | Object | 视口尺寸 | `{ width: 1280, height: 720 }` |
| userAgent | string | 用户代理字符串 | `'Mozilla/5.0...'` |
| locale | string | 语言环境 | `'zh-CN'`, `'en-US'` |
| timezoneId | string | 时区 | `'Asia/Shanghai'` |
| colorScheme | string | 颜色模式 | `'light'`, `'dark'` |
| permissions | string[] | 权限列表 | `['geolocation', 'notifications']` |
| geolocation | Object | 地理位置 | `{ latitude: 31.23, longitude: 121.47 }` |
| offline | boolean | 离线模式 | `true` 或 `false` |
| httpCredentials | Object | HTTP 认证 | `{ username: 'user', password: 'pass' }` |
| recordVideo | Object | 视频录制 | `{ dir: 'videos/' }` |
| recordHar | Object | HAR 录制 | `{ path: 'network.har' }` |

### 3.2 页面对象
**页面对象**代表浏览器中的一个标签页，提供了与页面交互的方法。


```javascript
const { test, expect } = require('@playwright/test');

test('页面操作示例', async ({ page }) => {
  // 导航相关
  await page.goto('https://example.com');
  await page.goBack();
  await page.goForward();
  await page.reload();
  
  // 页面信息
  const title = await page.title();
  const url = await page.url();
  const content = await page.content();
  
  // 页面事件监听
  page.on('load', () => console.log('页面加载完成'));
  page.on('domcontentloaded', () => console.log('DOM 加载完成'));
  page.on('console', msg => console.log('控制台消息:', msg.text()));
  page.on('dialog', async dialog => {
    console.log('对话框:', dialog.message());
    await dialog.dismiss();
  });
  
  // 页面截图
  await page.screenshot({ 
    path: 'screenshot.png',
    fullPage: true 
  });
  
  // PDF 生成
  await page.pdf({ 
    path: 'page.pdf',
    format: 'A4' 
  });
  
  // 评估 JavaScript
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  });
  
  console.log('页面尺寸:', dimensions);
});
```

**页面生命周期事件**：

| 事件 | 触发时机 | 使用场景 |
|------|----------|----------|
| load | 页面加载完成 | 等待页面完全加载 |
| domcontentloaded | DOM 加载完成 | 等待 DOM 结构就绪 |
| close | 页面关闭 | 清理资源 |
| console | 控制台输出 | 捕获日志 |
| dialog | 对话框弹出 | 处理 alert/confirm |
| pageerror | 页面 JavaScript 错误 | 错误监控 |
| request | 发起请求 | 网络请求拦截 |
| response | 收到响应 | 响应处理 |
| requestfailed | 请求失败 | 错误处理 |

### 3.3 元素定位器
**定位器**是 Playwright 的核心 API，用于查找和操作页面元素。


```javascript
test('元素定位示例', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 1. CSS 选择器
  const cssElement = page.locator('h1.title');
  
  // 2. XPath
  const xpathElement = page.locator('//h1[contains(@class, "title")]');
  
  // 3. 文本选择器
  const textElement = page.getByText('Example Domain');
  const exactTextElement = page.getByText('Example Domain', { exact: true });
  
  // 4. 占位符文本
  const placeholderElement = page.getByPlaceholder('请输入内容');
  
  // 5. 标签文本
  const labelElement = page.getByLabel('用户名');
  
  // 6. 角色选择器
  const buttonElement = page.getByRole('button', { name: '提交' });
  const linkElement = page.getByRole('link', { name: '了解更多' });
  
  // 7. 测试 ID
  const testIdElement = page.getByTestId('submit-button');
  
  // 8. 组合定位器
  const complexElement = page.locator('.container')
    .locator('div')
    .filter({ hasText: '内容' })
    .first();
  
  // 9. 链式定位
  const chainedElement = page
    .locator('nav')
    .getByRole('link', { name: '首页' })
    .first();
  
  // 10. 包含其他元素
  const hasElement = page.locator('li').filter({ 
    has: page.locator('span.badge') 
  });
  
  // 11. 相对定位
  const nearElement = page.locator('input').locator('..'); // 父元素
  const childElement = page.locator('div').locator('> span'); // 直接子元素
});
```

**常用定位器方法**：

| 方法 | 描述 | 示例 |
|------|------|------|
| getByText() | 按文本内容定位 | `page.getByText('登录')` |
| getByRole() | 按 ARIA 角色定位 | `page.getByRole('button')` |
| getByLabel() | 按标签文本定位 | `page.getByLabel('用户名')` |
| getByPlaceholder() | 按占位符定位 | `page.getByPlaceholder('搜索')` |
| getByAltText() | 按替代文本定位 | `page.getByAltText('Logo')` |
| getByTitle() | 按标题属性定位 | `page.getByTitle('提示')` |
| getByTestId() | 按测试 ID 定位 | `page.getByTestId('submit')` |
| locator() | CSS/XPath 选择器 | `page.locator('.btn-primary')` |

**最佳实践建议**：
1. 优先使用 `getByRole()` 和 `getByText()`
2. 为可交互元素添加 `data-testid` 属性
3. 避免使用不稳定的 CSS 选择器
4. 使用有意义的文本进行定位
5. 结合多种定位策略提高稳定性

---

## 四、元素操作
### 4.1 基本交互

```javascript
test('基本交互操作', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  // 1. 点击操作
  await page.locator('button').click();
  await page.locator('button').dblclick();
  await page.locator('button').click({ button: 'right' }); // 右键点击
  await page.locator('button').click({ modifiers: ['Control'] }); // Ctrl+点击
  
  // 2. 输入文本
  await page.locator('input[name="username"]').fill('testuser');
  await page.locator('textarea').fill('多行文本内容');
  
  // 3. 输入单个字符
  await page.locator('input').press('A');
  await page.locator('input').press('Shift+A');
  await page.locator('input').press('Control+C');
  
  // 4. 键盘操作
  await page.locator('input').press('Enter');
  await page.locator('input').press('Tab');
  await page.locator('input').press('ArrowDown');
  
  // 5. 鼠标移动
  await page.locator('button').hover();
  await page.locator('menu').hover({ force: true });
  
  // 6. 拖放操作
  const source = page.locator('#draggable');
  const target = page.locator('#droppable');
  await source.dragTo(target);
  
  // 7. 聚焦和失焦
  await page.locator('input').focus();
  await page.locator('input').blur();
  
  // 8. 清空输入
  await page.locator('input').clear();
  
  // 9. 文件上传
  await page.locator('input[type="file"]').setInputFiles([
    'file1.txt',
    'file2.jpg'
  ]);
  
  // 10. 选择下拉选项
  await page.locator('select').selectOption({ value: 'option1' });
  await page.locator('select').selectOption({ label: '选项一' });
  await page.locator('select').selectOption(['opt1', 'opt2']);
  
  // 11. 复选框和单选按钮
  await page.locator('input[type="checkbox"]').check();
  await page.locator('input[type="checkbox"]').uncheck();
  await page.locator('input[type="radio"]').check();
});
```

### 4.2 表单处理

```javascript
test('表单处理示例', async ({ page }) => {
  await page.goto('https://example.com/register');
  
  // 填写表单
  const formData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    gender: 'male',
    interests: ['coding', 'reading'],
    agree: true
  };
  
  // 文本输入
  await page.locator('#username').fill(formData.username);
  await page.locator('#email').fill(formData.email);
  await page.locator('#password').fill(formData.password);
  await page.locator('#confirmPassword').fill(formData.confirmPassword);
  
  // 单选按钮
  await page.locator(`input[name="gender"][value="${formData.gender}"]`).check();
  
  // 复选框
  for (const interest of formData.interests) {
    await page.locator(`input[name="interests"][value="${interest}"]`).check();
  }
  
  // 协议同意
  if (formData.agree) {
    await page.locator('#agree').check();
  }
  
  // 下拉选择
  await page.locator('select[name="country"]').selectOption('CN');
  await page.locator('select[name="province"]').selectOption({ index: 1 });
  
  // 日期选择
  await page.locator('input[type="date"]').fill('2024-01-15');
  
  // 颜色选择
  await page.locator('input[type="color"]').fill('#ff0000');
  
  // 范围滑块
  await page.locator('input[type="range"]').fill('75');
  
  // 提交表单
  await page.locator('button[type="submit"]').click();
  
  // 验证表单提交
  await expect(page).toHaveURL(/success/);
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 4.3 等待策略

```javascript
test('等待策略示例', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 1. 自动等待（Playwright 默认）
  // Playwright 在执行操作前会自动等待元素可用
  
  // 2. 显式等待元素状态
  await page.locator('button').waitFor({ state: 'visible' });
  await page.locator('button').waitFor({ state: 'hidden' });
  await page.locator('button').waitFor({ state: 'attached' });
  await page.locator('button').waitFor({ state: 'detached' });
  
  // 3. 超时配置
  await page.locator('button').click({ timeout: 10000 }); // 10秒超时
  
  // 4. 等待页面导航
  await Promise.all([
    page.waitForURL('**/dashboard'),
    page.locator('button').click()
  ]);
  
  // 5. 等待网络请求
  const [response] = await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/data') && 
      response.status() === 200
    ),
    page.locator('button').click()
  ]);
  
  // 6. 等待网络空闲
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
  
  // 7. 等待函数条件
  await page.waitForFunction(
    () => document.querySelector('.progress').textContent === '100%',
    { timeout: 30000 }
  );
  
  // 8. 等待超时
  await page.waitForTimeout(2000); // 不推荐，仅在必要时使用
  
  // 9. 等待选择器
  await page.waitForSelector('.modal', { 
    state: 'visible',
    timeout: 5000 
  });
  
  // 10. 自定义等待条件
  const maxRetries = 5;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await page.locator('.loaded').waitFor({ state: 'visible', timeout: 1000 });
      break;
    } catch {
      retries++;
      await page.waitForTimeout(1000);
    }
  }
});
```

**等待状态说明**：

| 状态 | 描述 | 使用场景 |
|------|------|----------|
| visible | 元素可见 | 等待元素显示在页面上 |
| hidden | 元素隐藏 | 等待元素隐藏或移除 |
| attached | 元素附加到 DOM | 等待元素添加到 DOM |
| detached | 元素从 DOM 分离 | 等待元素从 DOM 移除 |
| enabled | 元素可交互 | 等待元素启用状态 |
| disabled | 元素不可交互 | 等待元素禁用状态 |

### 4.4 断言验证

```javascript
const { test, expect } = require('@playwright/test');

test('断言验证示例', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 1. 可见性断言
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.hidden')).toBeHidden();
  
  // 2. 存在性断言
  await expect(page.locator('h1')).toBeAttached();
  await expect(page.locator('h1')).toHaveCount(1);
  
  // 3. 文本断言
  await expect(page.locator('h1')).toHaveText('Example Domain');
  await expect(page.locator('h1')).toContainText('Example');
  await expect(page.locator('input')).toHaveValue('默认值');
  await expect(page.locator('input')).toHaveAttribute('type', 'text');
  
  // 4. 状态断言
  await expect(page.locator('button')).toBeEnabled();
  await expect(page.locator('button:disabled')).toBeDisabled();
  await expect(page.locator('input[type="checkbox"]')).toBeChecked();
  await expect(page.locator('input[type="checkbox"]')).not.toBeChecked();
  
  // 5. CSS 断言
  await expect(page.locator('button')).toHaveCSS('color', 'rgb(255, 0, 0)');
  await expect(page.locator('div')).toHaveClass('container active');
  
  // 6. 页面级断言
  await expect(page).toHaveTitle('Example Domain');
  await expect(page).toHaveURL('https://example.com');
  await expect(page).toHaveURL(/example/);
  
  // 7. 软断言（不中断测试）
  await expect.soft(page.locator('.optional')).toBeVisible();
  
  // 8. 自定义断言
  const element = page.locator('h1');
  const text = await element.textContent();
  expect(text).toBe('Example Domain');
  
  // 9. 截图对比
  await expect(page).toHaveScreenshot('homepage.png');
  
  // 10. API 响应断言
  const response = await page.request.get('https://api.example.com/data');
  await expect(response).toBeOK();
  await expect(response.status()).toBe(200);
  await expect(response.headers()['content-type']).toContain('application/json');
  
  const json = await response.json();
  await expect(json).toHaveProperty('success', true);
});
```

**常用断言方法**：

| 断言方法 | 描述 | 示例 |
|----------|------|------|
| toBeVisible() | 元素可见 | `expect(el).toBeVisible()` |
| toBeHidden() | 元素隐藏 | `expect(el).toBeHidden()` |
| toBeEnabled() | 元素启用 | `expect(el).toBeEnabled()` |
| toBeDisabled() | 元素禁用 | `expect(el).toBeDisabled()` |
| toBeChecked() | 元素选中 | `expect(el).toBeChecked()` |
| toHaveText() | 包含文本 | `expect(el).toHaveText('文本')` |
| toContainText() | 包含文本 | `expect(el).toContainText('文本')` |
| toHaveValue() | 输入值 | `expect(el).toHaveValue('值')` |
| toHaveAttribute() | 拥有属性 | `expect(el).toHaveAttribute('type', 'text')` |
| toHaveClass() | 拥有类名 | `expect(el).toHaveClass('active')` |
| toHaveCSS() | CSS 属性 | `expect(el).toHaveCSS('color', 'red')` |
| toHaveCount() | 元素数量 | `expect(el).toHaveCount(3)` |
| toHaveTitle() | 页面标题 | `expect(page).toHaveTitle('标题')` |
| toHaveURL() | 页面 URL | `expect(page).toHaveURL('url')` |

---

## 五、网络操作
### 5.1 网络请求拦截

```javascript
test('网络请求拦截', async ({ page }) => {
  // 1. 拦截所有请求
  await page.route('**/*', route => {
    console.log('请求 URL:', route.request().url());
    route.continue();
  });
  
  // 2. 拦截特定请求
  await page.route('**/api/users', async route => {
    const response = await route.fetch();
    const json = await response.json();
    console.log('API 响应:', json);
    route.fulfill({ response });
  });
  
  // 3. 修改请求头
  await page.route('**/*', route => {
    const headers = route.request().headers();
    headers['X-Custom-Header'] = 'Playwright';
    route.continue({ headers });
  });
  
  // 4. 修改响应
  await page.route('**/api/data', async route => {
    const response = await route.fetch();
    const body = await response.text();
    const modifiedBody = body.replace('旧值', '新值');
    
    route.fulfill({
      response,
      body: modifiedBody,
      headers: { ...response.headers(), 'X-Modified': 'true' }
    });
  });
  
  // 5. 模拟 API 响应
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Mock User 1' },
        { id: 2, name: 'Mock User 2' }
      ])
    });
  });
  
  // 6. 模拟错误响应
  await page.route('**/api/error', route => {
    route.fulfill({
      status: 500,
      body: 'Internal Server Error'
    });
  });
  
  // 7. 延迟响应
  await page.route('**/api/slow', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    route.continue();
  });
  
  // 8. 拦截并记录请求
  const requests = [];
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers()
    });
  });
  
  await page.goto('https://example.com');
  console.log('捕获的请求数:', requests.length);
});
```

### 5.2 API 测试

```javascript
const { test, expect } = require('@playwright/test');

test('API 测试示例', async ({ request }) => {
  // 1. GET 请求
  const getResponse = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  await expect(getResponse).toBeOK();
  await expect(getResponse.status()).toBe(200);
  
  const post = await getResponse.json();
  await expect(post).toHaveProperty('id', 1);
  await expect(post).toHaveProperty('title');
  
  // 2. POST 请求
  const postResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: {
      title: 'foo',
      body: 'bar',
      userId: 1
    }
  });
  
  await expect(postResponse.status()).toBe(201);
  const createdPost = await postResponse.json();
  await expect(createdPost).toHaveProperty('id');
  
  // 3. PUT 请求
  const putResponse = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
    data: {
      id: 1,
      title: '更新标题',
      body: '更新内容',
      userId: 1
    }
  });
  
  await expect(putResponse.status()).toBe(200);
  
  // 4. DELETE 请求
  const deleteResponse = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
  await expect(deleteResponse.status()).toBe(200);
  
  // 5. 自定义请求头
  const authResponse = await request.get('https://api.example.com/protected', {
    headers: {
      'Authorization': 'Bearer token123',
      'X-API-Key': 'key456'
    }
  });
  
  // 6. 表单数据
  const formResponse = await request.post('https://api.example.com/upload', {
    multipart: {
      file: {
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('文件内容')
      }
    }
  });
  
  // 7. 查询参数
  const queryResponse = await request.get('https://api.example.com/search', {
    params: {
      q: 'playwright',
      page: 1,
      limit: 20
    }
  });
  
  // 8. 超时设置
  const timeoutResponse = await request.get('https://api.example.com/slow', {
    timeout: 5000
  });
  
  // 9. 重定向处理
  const redirectResponse = await request.get('https://api.example.com/redirect', {
    maxRedirects: 5
  });
  
  // 10. 响应验证
  const response = await request.get('https://api.example.com/data');
  const headers = response.headers();
  const contentType = headers['content-type'];
  
  await expect(contentType).toContain('application/json');
  await expect(response.headers()).toHaveProperty('content-type');
  await expect(response.headers()).toHaveProperty('content-length');
  
  // 验证 JSON Schema
  const data = await response.json();
  await expect(data).toHaveProperty('data');
  await expect(data.data).toBeInstanceOf(Array);
});
```

### 5.3 性能监控

```javascript
test('性能监控示例', async ({ page }) => {
  // 1. 启用性能监控
  await page.goto('https://example.com', { 
    waitUntil: 'networkidle' 
  });
  
  // 2. 获取性能指标
  const performanceTiming = await page.evaluate(() => 
    JSON.parse(JSON.stringify(performance.timing))
  );
  
  console.log('性能指标:', {
    dns查询: performanceTiming.domainLookupEnd - performanceTiming.domainLookupStart,
    tcp连接: performanceTiming.connectEnd - performanceTiming.connectStart,
    请求响应: performanceTiming.responseEnd - performanceTiming.requestStart,
    dom加载: performanceTiming.domComplete - performanceTiming.domLoading,
    页面加载: performanceTiming.loadEventEnd - performanceTiming.navigationStart
  });
  
  // 3. 监控资源加载
  const resources = await page.evaluate(() => 
    performance.getEntriesByType('resource')
  );
  
  const slowResources = resources
    .filter(resource => resource.duration > 1000)
    .map(resource => ({
      name: resource.name,
      duration: resource.duration,
      type: resource.initiatorType
    }));
  
  console.log('慢资源:', slowResources);
  
  // 4. 监控内存使用
  const memory = await page.evaluate(() => 
    performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize
    } : null
  );
  
  // 5. 监控长任务
  await page.evaluate(() => {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.log('长任务:', entry);
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  });
  
  // 6. 网络限速测试
  const context = page.context();
  const client = await context.newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
    uploadThroughput: 750 * 1024 / 8, // 750 Kbps
    latency: 100 // 100ms
  });
  
  // 重新加载页面测试慢速网络
  await page.reload();
  
  // 7. CPU 限速
  await client.send('Emulation.setCPUThrottlingRate', { 
    rate: 4 // 4倍减速
  });
  
  // 8. 性能断言
  await expect(page).toPass(async () => {
    const timing = await page.evaluate(() => performance.timing);
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    expect(loadTime).toBeLessThan(3000); // 页面加载应小于3秒
  });
});
```

---

## 六、高级功能
### 6.1 多页上下文

```javascript
test('多页上下文示例', async ({ browser }) => {
  // 1. 创建多个浏览器上下文
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  // 2. 在每个上下文中创建页面
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  
  // 3. 模拟多用户场景
  await page1.goto('https://example.com/login');
  await page2.goto('https://example.com/login');
  
  await page1.locator('input[name="username"]').fill('user1');
  await page1.locator('input[name="password"]').fill('pass1');
  await page1.locator('button[type="submit"]').click();
  
  await page2.locator('input[name="username"]').fill('user2');
  await page2.locator('input[name="password"]').fill('pass2');
  await page2.locator('button[type="submit"]').click();
  
  // 4. 验证不同用户的会话
  await expect(page1.locator('.username')).toHaveText('user1');
  await expect(page2.locator('.username')).toHaveText('user2');
  
  // 5. 清理
  await context1.close();
  await context2.close();
});

test('多标签页操作', async ({ page, context }) => {
  await page.goto('https://example.com');
  
  // 1. 打开新标签页
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[target="_blank"]').click()
  ]);
  
  await newPage.waitForLoadState();
  console.log('新页面标题:', await newPage.title());
  
  // 2. 切换回原页面
  await page.bringToFront();
  await page.locator('button').click();
  
  // 3. 操作多个标签页
  const pages = context.pages();
  console.log('标签页数量:', pages.length);
  
  for (let i = 0; i < pages.length; i++) {
    console.log(`页面 ${i} 标题:`, await pages[i].title());
  }
  
  // 4. 关闭标签页
  await newPage.close();
});
```

### 6.2 设备模拟

```javascript
const { devices } = require('@playwright/test');

test('设备模拟测试', async ({ browser }) => {
  // 1. 使用预定义设备
  const iPhone = devices['iPhone 12'];
  const context = await browser.newContext({
    ...iPhone,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai'
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  // 2. 检查视口
  const viewport = page.viewportSize();
  console.log('设备视口:', viewport);
  console.log('用户代理:', await page.evaluate(() => navigator.userAgent));
  
  // 3. 自定义设备
  const customDevice = {
    name: 'Custom Mobile',
    userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  };
  
  const customContext = await browser.newContext(customDevice);
  const customPage = await customContext.newPage();
  
  // 4. 触摸事件模拟
  await customPage.touchscreen.tap(100, 100);
  await customPage.touchscreen.swipe(100, 100, 200, 200);
  
  // 5. 设备方向
  await page.evaluate(() => {
    window.dispatchEvent(new Event('deviceorientation'));
  });
  
  // 6. 清理
  await context.close();
  await customContext.close();
});

test('地理位置模拟', async ({ context }) => {
  // 设置地理位置
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ 
    latitude: 31.2304, 
    longitude: 121.4737 
  });
  
  const page = await context.newPage();
  await page.goto('https://maps.example.com');
  
  // 验证地理位置
  const location = await page.evaluate(() => {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    });
  });
  
  console.log('获取的地理位置:', location);
});
```

**常用设备配置**：

| 设备 | 视口宽度 | 视口高度 | 用户代理特征 |
|------|----------|----------|------------|
| iPhone 12 | 390 | 844 | Mobile Safari |
| iPhone SE | 375 | 667 | Mobile Safari |
| iPad Pro 11 | 834 | 1194 | Tablet Safari |
| Samsung Galaxy S8 | 360 | 740 | Mobile Chrome |
| Pixel 5 | 393 | 851 | Mobile Chrome |
| Desktop Chrome | 1280 | 720 | Desktop Chrome |
| Desktop Firefox | 1280 | 720 | Desktop Firefox |
| Desktop Safari | 1280 | 720 | Desktop Safari |

### 6.3 录制与跟踪

```javascript
const { test, expect } = require('@playwright/test');

test('录制与跟踪示例', async ({ page }) => {
  // 1. 启动跟踪
  await page.context().tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
  
  await page.goto('https://example.com');
  await page.locator('button').click();
  
  // 停止跟踪并保存
  await page.context().tracing.stop({ 
    path: 'trace.zip' 
  });
  
  // 2. 视频录制
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 }
    }
  });
  
  const videoPage = await context.newPage();
  await videoPage.goto('https://example.com');
  // ... 执行测试操作
  
  await context.close();
  // 视频会自动保存到 videos/ 目录
  
  // 3. HAR 录制
  const harContext = await browser.newContext({
    recordHar: {
      path: 'network.har',
      omitContent: false
    }
  });
  
  const harPage = await harContext.newPage();
  await harPage.goto('https://example.com');
  
  await harContext.close();
  // HAR 文件保存到 network.har
});

// 4. 代码生成（录制模式）
test('代码生成示例', async ({ page }) => {
  // 启动录制
  await page.pause(); // 进入录制模式
  
  // 在浏览器中操作，Playwright 会生成代码
  // 或者使用命令行工具：
  // npx playwright codegen https://example.com
});

// 5. 查看跟踪报告
test('查看跟踪报告', async () => {
  // 生成跟踪报告
  // npx playwright show-trace trace.zip
});
```

**跟踪配置选项**：

| 选项 | 类型 | 描述 | 默认值 |
|------|------|------|--------|
| screenshots | boolean | 是否捕获截图 | false |
| snapshots | boolean | 是否捕获 DOM 快照 | false |
| sources | boolean | 是否包含页面源文件 | false |
| title | string | 跟踪标题 | 测试名称 |
| name | string | 跟踪文件名 | 自动生成 |
| path | string | 保存路径 | 必填 |

### 6.4 自定义脚本

```javascript
// utils/browser-actions.js
class BrowserActions {
  constructor(page) {
    this.page = page;
  }
  
  // 自定义点击方法
  async safeClick(selector, options = {}) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: options.timeout || 10000 });
    await element.scrollIntoViewIfNeeded();
    await element.click(options);
  }
  
  // 自定义输入方法
  async safeFill(selector, text, options = {}) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: options.timeout || 10000 });
    await element.scrollIntoViewIfNeeded();
    await element.clear();
    await element.fill(text, options);
  }
  
  // 截图方法
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/${name}_${timestamp}.png`;
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    return screenshotPath;
  }
  
  // 等待并获取文本
  async getText(selector, timeout = 10000) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return await element.textContent();
  }
  
  // 验证元素存在
  async isElementVisible(selector, timeout = 5000) {
    try {
      await this.page.locator(selector).waitFor({ 
        state: 'visible', 
        timeout 
      });
      return true;
    } catch {
      return false;
    }
  }
  
  // 切换 iframe
  async switchToFrame(selector) {
    const frame = this.page.frameLocator(selector);
    return frame;
  }
  
  // 处理对话框
  async handleDialog(action = 'accept', text) {
    this.page.once('dialog', async dialog => {
      if (text && dialog.type() === 'prompt') {
        await dialog.accept(text);
      } else if (action === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
  
  // 上传文件
  async uploadFile(selector, filePath) {
    const element = this.page.locator(selector);
    await element.setInputFiles(filePath);
  }
  
  // 鼠标悬停
  async hover(selector) {
    const element = this.page.locator(selector);
    await element.hover();
  }
  
  // 拖放操作
  async dragAndDrop(sourceSelector, targetSelector) {
    const source = this.page.locator(sourceSelector);
    const target = this.page.locator(targetSelector);
    await source.dragTo(target);
  }
}

module.exports = BrowserActions;
```

**在测试中使用**：

```javascript
const { test, expect } = require('@playwright/test');
const BrowserActions = require('../utils/browser-actions');

test('使用自定义操作', async ({ page }) => {
  const actions = new BrowserActions(page);
  
  await page.goto('https://example.com/login');
  
  // 使用自定义方法
  await actions.safeFill('#username', 'testuser');
  await actions.safeFill('#password', 'password123');
  await actions.safeClick('button[type="submit"]');
  
  // 等待导航
  await page.waitForURL('**/dashboard');
  
  // 截图
  const screenshot = await actions.takeScreenshot('dashboard');
  console.log('截图保存到:', screenshot);
  
  // 验证元素
  const isVisible = await actions.isElementVisible('.welcome-message');
  expect(isVisible).toBe(true);
  
  // 获取文本
  const welcomeText = await actions.getText('.welcome-message');
  expect(welcomeText).toContain('欢迎');
});
```

---

## 七、测试框架集成
### 7.1 测试结构

```javascript
// tests/login.spec.js
const { test, expect } = require('@playwright/test');

// 测试套件
test.describe('登录测试套件', () => {
  
  // 测试前置条件
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com/login');
  });
  
  // 测试后清理
  test.afterEach(async ({ page }) => {
    // 清理测试数据
    await page.evaluate(() => localStorage.clear());
  });
  
  // 测试用例1
  test('成功登录', async ({ page }) => {
    await page.locator('#username').fill('testuser');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    
    await expect(page).toHaveURL('**/dashboard');
    await expect(page.locator('.welcome-message')).toBeVisible();
  });
  
  // 测试用例2
  test('登录失败 - 错误密码', async ({ page }) => {
    await page.locator('#username').fill('testuser');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    
    await expect(page.locator('.error-message')).toHaveText('密码错误');
    await expect(page).toHaveURL('**/login');
  });
  
  // 测试用例3
  test('登录失败 - 空用户名', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    
    await expect(page.locator('#username:invalid')).toBeVisible();
  });
  
  // 参数化测试
  const invalidCredentials = [
    { username: '', password: 'pass', expectedError: '请输入用户名' },
    { username: 'user', password: '', expectedError: '请输入密码' },
    { username: 'user', password: 'wrong', expectedError: '密码错误' }
  ];
  
  for (const { username, password, expectedError } of invalidCredentials) {
    test(`登录验证 - ${expectedError}`, async ({ page }) => {
      await page.locator('#username').fill(username);
      await page.locator('#password').fill(password);
      await page.locator('button[type="submit"]').click();
      
      await expect(page.locator('.error-message')).toContainText(expectedError);
    });
  }
  
  // 跳过测试
  test.skip('待实现的测试', async ({ page }) => {
    // 这个测试暂时跳过
  });
  
  // 失败重试
  test('不稳定的测试', async ({ page }) => {
    test.fixme(); // 标记为需要修复
    // 测试内容
  });
});

// 测试分组
test.describe.parallel('并行测试组', () => {
  test('测试1', async ({ page }) => {
    // 可以并行执行
  });
  
  test('测试2', async ({ page }) => {
    // 可以并行执行
  });
});

// 串行测试组
test.describe.serial('串行测试组', () => {
  test('步骤1', async ({ page }) => {
    // 必须先执行
  });
  
  test('步骤2', async ({ page }) => {
    // 依赖于步骤1
  });
});
```

### 7.2 测试夹具

```javascript
// tests/fixtures.js
const { test: baseTest, expect } = require('@playwright/test');
const LoginPage = require('../pages/login.page');
const DashboardPage = require('../pages/dashboard.page');

// 扩展测试夹具
const test = baseTest.extend({
  // 自定义页面对象
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  
  // 认证用户
  authenticatedUser: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // 执行登录
    await page.goto('https://example.com/login');
    await page.locator('#username').fill('testuser');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard');
    
    // 保存认证状态
    await context.storageState({ path: 'auth.json' });
    
    await use({ page, context });
    await context.close();
  },
  
  // 测试数据
  testData: async ({}, use) => {
    const data = {
      user: {
        username: 'testuser_' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'Password123!'
      },
      product: {
        name: '测试产品_' + Date.now(),
        price: 99.99,
        category: '电子产品'
      }
    };
    
    await use(data);
  },
  
  // API 客户端
  apiClient: async ({ request }, use) => {
    const apiClient = {
      async login(credentials) {
        return request.post('/api/login', { data: credentials });
      },
      async getUsers() {
        return request.get('/api/users');
      },
      async createProduct(product) {
        return request.post('/api/products', { data: product });
      }
    };
    
    await use(apiClient);
  },
  
  // 数据库连接
  database: async ({}, use) => {
    // 模拟数据库连接
    const db = {
      async query(sql, params) {
        console.log('执行查询:', sql, params);
        return [{ id: 1, name: '测试数据' }];
      },
      async close() {
        console.log('关闭数据库连接');
      }
    };
    
    await use(db);
    await db.close();
  }
});

module.exports = { test, expect };
```

**在测试中使用夹具**：

```javascript
// tests/with-fixtures.spec.js
const { test, expect } = require('./fixtures');

test('使用页面对象', async ({ loginPage, dashboardPage }) => {
  await loginPage.navigate();
  await loginPage.login('testuser', 'password123');
  await dashboardPage.verifyLoginSuccess();
});

test('使用认证用户', async ({ authenticatedUser }) => {
  const { page } = authenticatedUser;
  await page.goto('https://example.com/dashboard');
  await expect(page.locator('.welcome')).toBeVisible();
});

test('使用测试数据', async ({ page, testData }) => {
  await page.goto('https://example.com/register');
  await page.locator('#username').fill(testData.user.username);
  await page.locator('#email').fill(testData.user.email);
  await page.locator('#password').fill(testData.user.password);
  await page.locator('button[type="submit"]').click();
  
  await expect(page).toHaveURL('**/welcome');
});

test('使用API客户端', async ({ apiClient }) => {
  const response = await apiClient.login({
    username: 'testuser',
    password: 'password123'
  });
  
  await expect(response.status()).toBe(200);
  const data = await response.json();
  await expect(data).toHaveProperty('token');
});

test('使用数据库', async ({ database }) => {
  const result = await database.query('SELECT * FROM users WHERE id = ?', [1]);
  expect(result.length).toBeGreaterThan(0);
});
```

### 7.3 页面对象模型

```javascript
// pages/login.page.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
    this.rememberMeCheckbox = page.locator('#remember-me');
    this.forgotPasswordLink = page.locator('a.forgot-password');
  }
  
  async navigate() {
    await this.page.goto('https://example.com/login');
  }
  
  async login(username, password, rememberMe = false) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    
    await this.submitButton.click();
  }
  
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
  
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
  
  async isLoginFormVisible() {
    return await this.usernameInput.isVisible();
  }
  
  async clearForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}

module.exports = LoginPage;
```


```javascript
// pages/dashboard.page.js
class DashboardPage {
  constructor(page) {
    this.page = page;
    this.welcomeMessage = page.locator('.welcome-message');
    this.userMenu = page.locator('.user-menu');
    this.logoutButton = page.locator('button.logout');
    this.sidebar = page.locator('.sidebar');
    this.content = page.locator('.main-content');
  }
  
  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL('**/dashboard');
    await expect(this.welcomeMessage).toBeVisible();
  }
  
  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
  
  async navigateTo(section) {
    await this.sidebar.locator(`a[href*="${section}"]`).click();
  }
  
  async getUserName() {
    return await this.welcomeMessage.textContent();
  }
  
  async isDashboardLoaded() {
    return await this.content.isVisible();
  }
}

module.exports = DashboardPage;
```

**在测试中使用页面对象**：

```javascript
// tests/page-objects.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/login.page');
const DashboardPage = require('../pages/dashboard.page');

test.describe('页面对象模式测试', () => {
  let loginPage;
  let dashboardPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });
  
  test('成功登录并登出', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser', 'password123');
    await dashboardPage.verifyLoginSuccess();
    
    // 验证欢迎消息
    const welcomeText = await dashboardPage.getUserName();
    expect(welcomeText).toContain('testuser');
    
    // 登出
    await dashboardPage.logout();
    await expect(page).toHaveURL('**/login');
  });
  
  test('登录失败场景', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('wronguser', 'wrongpass');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('用户名或密码错误');
    expect(await loginPage.isLoginFormVisible()).toBe(true);
  });
  
  test('导航测试', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser', 'password123');
    
    // 导航到不同部分
    await dashboardPage.navigateTo('profile');
    await expect(page).toHaveURL('**/profile');
    
    await dashboardPage.navigateTo('settings');
    await expect(page).toHaveURL('**/settings');
  });
});
```

---

## 八、配置与执行
### 8.1 Playwright 配置

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // 测试目录
  testDir: './tests',
  
  // 测试匹配模式
  testMatch: '**/*.spec.js',
  testIgnore: '**/node_modules/**',
  
  // 超时设置
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  
  // 并行执行
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  
  // 重试策略
  retries: process.env.CI ? 2 : 0,
  
  // 报告配置
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'results.xml' }],
    ['json', { outputFile: 'results.json' }],
    ['line']
  ],
  
  // 全局配置
  use: {
    // 基础配置
    baseURL: 'https://example.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // 截图配置
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    
    // 视频配置
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 }
    },
    
    // 跟踪配置
    trace: {
      mode: 'retain-on-failure',
      sources: true,
      snapshots: true,
      screenshots: true
    },
    
    // 上下文配置
    contextOptions: {
      reducedMotion: 'reduce',
      colorScheme: 'light'
    }
  },
  
  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'] 
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'] 
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'] 
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'] 
      },
    }
  ],
  
  // Web 服务器配置
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  
  // 全局设置
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  
  // 输出目录
  outputDir: 'test-results/',
  
  // 静默模式
  quiet: false,
  
  // 更新快照
  updateSnapshots: 'missing'
});
```

### 8.2 运行配置
**package.json 脚本配置**：

```json
{
  "name": "playwright-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "test:headed": "playwright test --headed",
    "test:parallel": "playwright test --workers=4",
    "test:serial": "playwright test --workers=1",
    "test:grep": "playwright test --grep",
    "test:update-snapshots": "playwright test --update-snapshots",
    "test:report": "playwright test --reporter=html",
    "show-report": "playwright show-report",
    "show-trace": "playwright show-trace",
    "codegen": "playwright codegen",
    "install-browsers": "playwright install",
    "lint": "eslint tests/",
    "format": "prettier --write tests/"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "playwright": "^1.40.0"
  }
}
```

**命令行参数**：

```bash
# 基本运行
npx playwright test                          # 运行所有测试
npx playwright test tests/login.spec.js      # 运行单个文件
npx playwright test tests/                   # 运行目录

# 过滤测试
npx playwright test --grep "login"           # 按标题过滤
npx playwright test --grep-invert "skip"     # 排除特定测试

# 浏览器控制
npx playwright test --project=chromium       # 指定浏览器
npx playwright test --headed                 # 有头模式
npx playwright test --browser=all            # 所有浏览器

# 并行控制
npx playwright test --workers=4              # 并行数
npx playwright test --workers=1              # 串行执行
npx playwright test --fully-parallel         # 完全并行

# 报告和输出
npx playwright test --reporter=html          # HTML 报告
npx playwright test --reporter=line          # 行报告
npx playwright test --reporter=json          # JSON 报告
npx playwright test --reporter=junit         # JUnit 报告
npx playwright test --output=test-results/   # 输出目录

# 调试和开发
npx playwright test --debug                  # 调试模式
npx playwright test --ui                     # UI 模式
npx playwright codegen https://example.com   # 代码生成
npx playwright show-report                   # 显示报告
npx playwright show-trace trace.zip          # 显示跟踪

# 配置覆盖
npx playwright test --timeout=60000          # 超时设置
npx playwright test --retries=3              # 重试次数
npx playwright test --update-snapshots       # 更新快照
npx playwright test --config=playwright.config.js  # 配置文件
```

### 8.3 环境配置

```javascript
// 环境配置文件
// config/dev.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    headless: false
  },
  retries: 2
});

// config/staging.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'https://staging.example.com',
    headless: true
  },
  retries: 1
});

// config/prod.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'https://example.com',
    headless: true
  },
  retries: 0
});
```

**使用环境变量**：

```javascript
// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: process.env.CI ? true : false,
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: process.env.CI ? 'retain-on-failure' : 'off'
  },
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,
  timeout: process.env.CI ? 60000 : 30000
});
```

**运行脚本**：

```bash
# 开发环境
BASE_URL=http://localhost:3000 npx playwright test

# 测试环境
BASE_URL=https://staging.example.com npx playwright test

# 生产环境
BASE_URL=https://example.com npx playwright test

# CI 环境
CI=true BASE_URL=https://example.com npx playwright test
```

---

## 九、CI/CD 集成
### 9.1 GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests
      run: npx playwright test
      env:
        BASE_URL: ${{ secrets.BASE_URL }}
        CI: true
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
    
    - name: Upload test traces
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-traces
        path: test-results/
        retention-days: 30
    
    - name: Upload test videos
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-videos
        path: test-results/
        retention-days: 30
```

### 9.2 Jenkins 配置

```groovy
// Jenkinsfile
pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.40.0-focal'
      args '--shm-size=2gb'
    }
  }
  
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    
    stage('Setup') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }
    
    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }
    
    stage('Test') {
      steps {
        sh '''
          npx playwright test \
            --reporter=html \
            --output=test-results
        '''
      }
    }
    
    stage('Report') {
      steps {
        publishHTML([
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Report',
          keepAll: true
        ])
        
        junit 'test-results/*.xml'
      }
    }
  }
  
  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**/*'
      archiveArtifacts artifacts: 'test-results/**/*'
    }
  }
}
```

### 9.3 Docker 配置

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY playwright.config.js ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY tests/ ./tests/
COPY pages/ ./pages/
COPY utils/ ./utils/

# 安装浏览器
RUN npx playwright install --with-deps

# 运行测试
CMD ["npx", "playwright", "test", "--reporter=html"]
```

**docker-compose.yml**：

```yaml
version: '3.8'

services:
  tests:
    build: .
    environment:
      - BASE_URL=http://web:3000
      - CI=true
    volumes:
      - ./playwright-report:/app/playwright-report
      - ./test-results:/app/test-results
    depends_on:
      - web
  
  web:
    image: nginx:alpine
    ports:
      - "3000:80"
    volumes:
      - ./dist:/usr/share/nginx/html
```

---