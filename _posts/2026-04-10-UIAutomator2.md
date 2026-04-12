---
title: "UIAutomator2 安卓自动化测试"
categories:
  - APP测试
  - UIAutomator2
tags:
  - APP测试
  - 自动化测试
  - UIAutomator2
toc: true
order: 2
---
# UIAutomator2 安卓自动化测试 系统学习大纲


## 一、UIAutomator2 概述与核心概念
### 1.1 什么是 UIAutomator2？
*   **定义**：一个基于 Python 语言的 Android UI 自动化测试库，它封装了 Google 官方的 UIAutomator 框架。
*   **核心优势**：
    *   **无需源码**：无需拥有被测应用的源代码（APK即可）。
    *   **跨应用**：能够跨越多个 APP 进行操作（如从微信跳转到浏览器）。
    *   **Python 生态**：利用 Python 的简洁语法和丰富的库（如 pytest, requests）来编写测试逻辑。
    *   **强大的选择器**：提供了非常灵活的控件定位方式（text, id, xpath等）。
*   **与 Appium 的关系与区别**：
    *   Appium 是一个跨平台（iOS/Android）的通用协议框架，底层最终也是调用 UIAutomator。
    *   UIAutomator2 更轻量、执行速度更快、更贴近原生 Android 测试，且直接使用 Python 控制，减少了 Appium Server 的中间层开销。

### 1.2 核心架构与工作原理
*   **Client-Server 架构**：
    *   **PC端 (Client)**：运行 Python 脚本，发送 HTTP 指令。
    *   **手机端 (Server)**：运行 `atx-agent` 守护进程，接收指令并调用 Android SDK 的 UIAutomator API 操作手机。
*   **关键组件**：
    *   `uiautomator2` (Python库)
    *   `atx-agent` (手机端服务)
    *   `minicap/minitouch` (用于高速截图和触控)


## 二、环境搭建与工程配置
### 2.1 基础环境准备
*   **PC端**：Python 3.6+、JDK 8/11、Android SDK（确保 `adb` 在环境变量中）。
*   **手机端**：开启 USB 调试模式、允许模拟点击权限。

### 2.2 安装与初始化
```bash
# 1. 安装 Python 库
pip install -U uiautomator2

# 2. 连接手机 (adb devices 能看到设备)
adb devices

# 3. 初始化手机环境 (自动安装 atx-agent, minicap 等)
python -m uiautomator2 init
```

### 2.3 常用辅助工具
*   **weditor**：可视化的 UI 元素查看器，相当于 Appium Desktop 的 Inspector。
```bash
pip install -U weditor
python -m weditor
```
*   **uiautomatorviewer**：Android SDK 自带的老牌查看器，适合查看复杂层级。


## 三、设备连接与基础操控
### 3.1 设备连接方式
```python
import uiautomator2 as u2

# 方式1: 自动连接列表中第一台设备
d = u2.connect()

# 方式2: 通过设备序列号连接 (USB)
d = u2.connect("1234567890ABCDEF")

# 方式3: WiFi 连接 (需先用USB连接执行 `adb tcpip 5555`)
d = u2.connect("192.168.1.100:5555")
```

### 3.2 设备基本信息与状态
```python
# 获取设备信息
info = d.info
print(info)           # 包含 serial, model, brand, screen size
print(d.window_size()) # 屏幕分辨率 (width, height)
print(d.current_app()) # 当前前台应用包名和Activity

# 屏幕截图
d.screenshot("home.png")
```

### 3.3 基础按键与手势
```python
# 常用硬件按键
d.press("home")       # 主页
d.press("back")       # 返回
d.press("power")      # 电源键
d.press("volume_up")  # 音量+

# 屏幕手势
d.swipe(x1, y1, x2, y2, duration=0.5)  # 滑动
d.drag(x1, y1, x2, y2, duration=0.5)   # 拖拽

# 坐标点击 (慎用，尽量用元素定位)
d.click(x, y)
```


## 四、元素定位策略 (Selector) - 核心重点
UIAutomator2 提供了非常丰富的定位方式，核心是通过 `d(selector)` 获取 UiObject。

### 4.1 基础属性定位
```python
# 1. 通过文本 (最常用)
d(text="登录").click()

# 2. 通过 Resource ID (推荐，稳定性高)
d(resourceId="com.app:id/tv_title").click()

# 3. 通过 Class Name
d(className="android.widget.Button").click()

# 4. 通过 Description (Content-Description)
d(description="更多选项").click()

# 5. 通过包名
d(packageName="com.tencent.mm")
```

### 4.2 组合与层级定位
```python
# 1. 多属性组合 (AND 关系)
d(text="确定", className="android.widget.Button", resourceId="ok_btn").click()

# 2. 层级关系 - Child / Sibling
# 寻找 ListView 下的第3个子元素
d(className="ListView").child(index=2).click()
# 寻找包含 "价格" 文本的父元素下的 "购买" 按钮
d(textContains="价格").sibling(text="购买").click()

# 3. 相对位置定位
d(text="张三").left(className="CheckBox").click()   # 张三左边的勾选框
d(text="李四").right(text="删除").click()           # 李四右边的删除按钮
```

### 4.3 XPath 定位 (处理复杂层级)
```python
# 使用 XPath (需熟悉 XML 结构，灵活但稍慢)
d.xpath('//*[@text="我的"]').click()
d.xpath('//android.widget.ListView/android.widget.TextView[2]').click()
```

### 4.4 集合操作 (批量处理)
```python
# 获取所有匹配的元素 (返回列表)
buttons = d(text="确定").all()
print(len(buttons))
buttons[0].click()

# 遍历元素
for view in d(className="TextView").all():
    print(view.info['text'])
```


## 五、元素交互与操作
### 5.1 核心交互方法
```python
ele = d(text="输入框")

# 点击与长按
ele.click()                   # 单击
ele.long_click(duration=1.0)  # 长按1秒
ele.double_click()            # 双击

# 输入与清除
ele.set_text("Hello World")   # 清空并输入
ele.clear_text()              # 清空

# 获取元素属性
text = ele.info['text']       # 获取文本
bounds = ele.info['bounds']   # 获取坐标 {left, top, right, bottom}
enabled = ele.info['enabled'] # 是否可用
checked = ele.info['checked'] # 选中状态
```

### 5.2 特殊控件操作
```python
# 滑动控件 (SeekBar/Slider)
d(className="android.widget.SeekBar").swipe("right", scale=0.5) # 向右滑动一半

# 复选框/开关 (CheckBox/ToggleButton)
checkbox = d(className="CheckBox")
if checkbox.info['checked']: 
    checkbox.click() # 取消勾选

# 文本框滚动 (ScrollView)
scroll_view = d(scrollable=True)
scroll_view.scroll.vert.forward(steps=10) # 向下滚动
scroll_view.scroll.horiz.toEnd()          # 横向滚动到底
```


## 六、等待机制与存在判断
UI 自动化必须处理"等待"，避免因网络或动画加载导致的失败。

### 6.1 显式等待 (推荐)
```python
# 等待元素出现 (最多10秒)，返回元素对象
ele = d(text="加载中...").wait(timeout=10.0)
if ele.exists: 
    ele.click()

# 等待元素消失 (常用于等待 Loading 结束)
d(text="Loading").wait_gone(timeout=20.0)

# 带条件的等待 (轮询检查)
def is_login_success():
    return d(text="首页").exists
d.wait_until(is_login_success, timeout=15)
```

### 6.2 隐式等待 (全局设置)
```python
# 设置全局等待超时 (作用于所有定位操作)
d.implicitly_wait(10.0) 

# 设置查找超时 (针对当前元素)
d(text="确定").timeout = 5.0
```

### 6.3 存在性判断
```python
if d(text="同意").exists:
    d(text="同意").click()
else:
    print("协议按钮不存在")
```


## 七、应用管理与多应用协同
### 7.1 应用生命周期
```python
# 启动应用 (冷启动/热启动)
d.app_start("com.android.settings", stop=True) # stop=True 先杀掉旧进程

# 停止应用
d.app_stop("com.android.settings")

# 清理应用数据 (重置状态)
d.app_clear("com.android.settings")

# 获取当前应用信息
current = d.current_app()
print(current.packageName, current.activity)
```

### 7.2 跨应用操作 (Session)
```python
# 启动微信并执行操作
with d.session("com.tencent.mm") as sess:
    sess(text="通讯录").click()
    sleep(1)
    
# 此时自动切回之前的应用
```


## 八、断言与测试验证
虽然 UIAutomator2 本身不带断言库，但通常结合 `pytest` 或 `unittest` 使用。
```python
import pytest

def test_login_success():
    # 操作步骤...
    d(text="用户名").set_text("admin")
    d(text="密码").set_text("123456")
    d(text="登录").click()
    
    # 验证断言
    # 1. 验证元素存在
    assert d(text="欢迎回来").exists
    
    # 2. 验证文本内容
    balance_text = d(resourceId="tv_balance").info['text']
    assert "100元" in balance_text
    
    # 3. 验证属性状态
    btn = d(text="提交")
    assert btn.info['enabled'] == True
    assert btn.info['focused'] == False
```


## 九、Toast 提示处理
Toast 是 Android 特有的短暂提示，属于系统级控件，定位较难。
```python
# 方案1：使用 XPath 定位系统 Toast
message = d.xpath('//*[@class="android.widget.Toast"]').wait(timeout=5.0)
if message:
    toast_text = message.info['text']
    assert "登录成功" in toast_text

# 方案2：利用 accessibility (较少用)
```


## 十、高级特性与拓展
### 10.1 输入法操作
```python
# 显示/隐藏软键盘
d.set_fastinput_ime(True)  # 切换至 uiautomator2 专用输入法 (速度快)
d.send_action("search")    # 发送搜索键
d.set_fastinput_ime(False) # 恢复系统输入法
```

### 10.2 Shell 命令执行
```python
# 在设备上执行 adb shell 命令
output = d.shell("ls /sdcard/").output
d.shell("am broadcast -a android.intent.action.BOOT_COMPLETED")
```

### 10.3 图像识别 (OpenCV 结合)
*   虽然 UIAutomator2 主要靠控件树，但可集成 `opencv-python` 处理验证码截图或游戏图标识别。

### 10.4 性能与稳定性监控
```python
# 监听 ANR 和 Crash
d.watcher.when("应用程序无响应").press("back")
d.watcher.when("Force Close").press("home")
d.watchers.start() # 启动监控
```


## 十一、工程化与最佳实践
### 11.1 Page Object Model (POM) 设计模式
*   **核心思想**：将页面元素和操作封装成类，业务逻辑与定位分离。
*   **目录结构**：
```text
tests/
├── pages/           # 页面对象
│   ├── login_page.py
│   └── home_page.py
├── conftest.py      # pytest 夹具
└── test_login.py    # 测试用例
```

### 11.2 结合 Pytest 运行
*   使用 `pytest` 组织用例、生成报告、参数化。
*   使用 `pytest-html` 生成 HTML 报告。
*   使用 `pytest-xdist` 实现多设备并行测试（需处理设备端口映射）。

### 11.3 异常处理与重试
```python
def safe_click(selector, retry=3):
    for i in range(retry):
        try:
            if selector.exists:
                selector.click()
                return True
            else:
                print(f"元素不存在，第{i+1}次重试")
                sleep(1)
        except Exception as e:
            print(f"点击异常: {e}")
    return False
```

### 11.4 日志与截图收集
```python
# 用例失败时自动截图
def test_case():
    try:
        # ... 测试步骤
        assert True
    except AssertionError as e:
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        d.screenshot(f"screenshots/error_{timestamp}.png")
        raise e
```


## 十二、常见问题排查 (FAQ)
*   **Error: HTTP 410 Gone / atx-agent not running**：设备上的服务挂了，重启 `adb shell` 或重新 `init`。
*   **Element not found**：检查是否加了等待，或使用 `weditor` 确认选择器是否正确。
*   **Input method not working**：确认开启了 `FastInputIME` 或系统输入法权限。
*   **Permission Denied**：检查 `WRITE_EXTERNAL_STORAGE` 等权限是否授予。