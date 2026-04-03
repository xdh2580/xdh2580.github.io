---
title: "进阶-pytest配置文件"
categories:
  - pytest
tags:
  - pytest
toc: true
---
# pytest配置文件全面解析

**pytest 配置文件是 pytest 测试框架的核心配置机制，它让您能精细控制测试行为。如下是从基础到高级的全面解析。**

## 一、配置文件类型和优先级
pytest 支持多种配置文件格式，按查找顺序和优先级如下：
* **1.1 配置文件查找顺序**

    ```
    1. pytest.ini
    2. pyproject.toml
    3. tox.ini
    4. setup.cfg
    ```
    查找路径：从当前目录向上查找，直到找到第一个配置文件。

* **1.2 推荐使用优先级**

    ```bash
    # 现代项目（推荐）
    pyproject.toml ✅

    # 传统项目
    pytest.ini ✅

    # 兼容性项目
    tox.ini ⚠️

    # 已弃用
    setup.cfg ❌
    ```

## 二、配置文件详解
* **2.1 pytest.ini（最传统）**

    ```ini
    [pytest]
    # 1. 测试发现配置
    testpaths = tests integration_tests
    python_files = test_*.py *_test.py check_*.py
    python_classes = Test* Check*
    python_functions = test_* check_*

    # 2. 命令行选项
    addopts = 
        -v                     # 详细输出
        --tb=short             # 简短错误回溯
        --strict-markers       # 严格标记
        --disable-warnings     # 禁用警告
        --maxfail=2            # 失败2个测试后停止
        -x                     # 第一个失败后停止
        --cov                  # 覆盖率报告
        --cov-report=html      # HTML覆盖率报告
        -p no:warnings         # 插件配置

    # 3. 标记（markers）注册
    markers =
        slow: 标记为慢速测试
        fast: 快速测试
        smoke: 冒烟测试
        integration: 集成测试
        unit: 单元测试
        serial: 必须串行执行
        windows: 仅Windows平台
        linux: 仅Linux平台
        database: 需要数据库
        api: API测试
        param(id1, id2): 带参数的标记

    # 4. 过滤器配置
    filterwarnings =
        error                     # 将警告转为错误
        ignore::UserWarning       # 忽略特定警告
        ignore:.*U.*mode.*:DeprecationWarning
        always::ResourceWarning

    # 5. 日志配置
    log_cli = true
    log_cli_level = INFO
    log_cli_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
    log_cli_date_format = %Y-%m-%d %H:%M:%S
    log_file = logs/pytest.log
    log_file_level = DEBUG
    log_file_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
    log_file_date_format = %Y-%m-%d %H:%M:%S

    # 6. 测试结果输出
    junit_suite_name = Pytest Test Suite
    junit_logging = all
    junit_duration_report = call
    junit_family = xunit2

    # 7. 插件配置
    required_plugins = pytest-cov pytest-html pytest-xdist
    asyncio_mode = auto

    # 8. 缓存配置
    cache_dir = .pytest_cache

    # 9. 自定义配置
    my_custom_setting = value
    timeout = 30.0
    ```
* **2.2 pyproject.toml（现代标准）**

    ```toml
    # pyproject.toml
    [tool.pytest.ini_options]
    # 1. 测试发现
    testpaths = ["tests", "integration_tests"]
    python_files = ["test_*.py", "*_test.py", "check_*.py"]
    python_classes = ["Test*", "Check*"]
    python_functions = ["test_*", "check_*"]

    # 2. 命令行选项
    addopts = [
        "-v",
        "--tb=short",
        "--strict-markers",
        "--disable-warnings",
        "--maxfail=2",
        "-x",
        "--cov",
        "--cov-report=html",
        "-p", "no:warnings"
    ]

    # 3. 标记注册
    markers = [
        "slow: marks tests as slow (deselect with '-m \"not slow\"')",
        "fast: marks tests as fast",
        "smoke: smoke tests",
        "integration: integration tests",
        "unit: unit tests",
        "serial: tests that must be run serially",
        "windows: windows only tests",
        "linux: linux only tests",
        "database: tests that require database access",
        "api: API tests"
    ]

    # 4. 过滤器
    filterwarnings = [
        "error",
        "ignore::UserWarning",
        "ignore:.*U.*mode.*:DeprecationWarning",
        "always::ResourceWarning"
    ]

    # 5. 日志配置
    log_cli = true
    log_cli_level = "INFO"
    log_cli_format = "%(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)"
    log_cli_date_format = "%Y-%m-%d %H:%M:%S"
    log_file = "logs/pytest.log"
    log_file_level = "DEBUG"

    # 6. JUnit报告
    junit_suite_name = "Pytest Test Suite"
    junit_logging = "all"
    junit_duration_report = "call"
    junit_family = "xunit2"

    # 7. 插件配置
    asyncio_mode = "auto"
    timeout = 30.0

    # 8. 自定义配置
    my_custom_setting = "value"

    # 9. 覆盖率配置（pytest-cov）
    [tool.coverage.run]
    source = ["src"]
    omit = ["*/tests/*", "*/migrations/*"]

    [tool.coverage.report]
    exclude_lines = [
        "pragma: no cover",
        "def __repr__",
        "if self.debug:",
        "if 0:",
        "if __name__ == .__main__.:"
    ]

    [tool.coverage.html]
    directory = "htmlcov"
    title = "Test Coverage Report"

    # 10. 插件特定配置
    [tool.pytest-xdist]
    addopts = "-n auto"  # 自动检测CPU核心数
    ```

* **2.3 tox.ini（兼容tox）**

    ```ini
    [tox]
    envlist = py38, py39, py310
    skipsdist = true

    [testenv]
    deps =
        pytest
        pytest-cov
    commands = pytest {posargs}

    [pytest]
    # 所有pytest配置可以放在这里
    testpaths = tests
    python_files = test_*.py
    addopts = -v
    ```

## 三、核心配置项详解
### 3.1 测试发现配置
```ini
[pytest]
# 测试目录（多个用空格分隔）
testpaths = tests integration_tests e2e

# 测试文件模式
python_files = 
    test_*.py      # 前缀模式
    *_test.py      # 后缀模式
    check_*.py     # 自定义模式
    spec_*.py      # BDD风格
    *test.py       # 包含test

# 测试类模式
python_classes = 
    Test*          # 以Test开头
    *Test          # 以Test结尾
    Check*         # 自定义
    Spec*          # BDD风格

# 测试函数/方法模式
python_functions = 
    test_*         # 前缀模式
    *test          # 后缀模式
    check_*        # 自定义
    should_*       # BDD风格
    it_*           # BDD风格
```

### 3.2 标记系统（Markers）
```ini
[pytest]
markers =
    # 基本分类
    unit: 单元测试
    integration: 集成测试
    e2e: 端到端测试
    smoke: 冒烟测试
    
    # 性能相关
    slow: 运行缓慢的测试 (>1秒)
    fast: 快速测试 (<0.1秒)
    
    # 环境相关
    windows: 仅Windows平台
    linux: 仅Linux平台
    macos: 仅macOS平台
    docker: 需要Docker
    database: 需要数据库
    network: 需要网络
    
    # 功能相关
    api: API测试
    ui: 用户界面测试
    security: 安全测试
    performance: 性能测试
    
    # 执行控制
    serial: 必须串行执行
    parallel: 可以并行执行
    flaky: 不稳定测试
    
    # 自定义参数
    param(name: 参数名, value: 参数值): 带参数的标记
```

使用示例：
```python
import pytest

@pytest.mark.slow
@pytest.mark.database
@pytest.mark.flaky(reruns=3)
def test_complex_operation():
    pass

@pytest.mark.param(name="user_type", value="admin")
def test_admin_access():
    pass
```

### 3.3 警告过滤
```ini
[pytest]
filterwarnings =
    # 1. 错误级别
    error                      # 所有警告转为错误
    error::DeprecationWarning  # 特定警告转为错误
    
    # 2. 忽略警告
    ignore                     # 忽略所有警告
    ignore::UserWarning        # 忽略特定类型
    ignore:.*deprecated.*      # 忽略匹配消息
    ignore:DeprecationWarning:.*:django.*  # 忽略特定模块
    
    # 3. 特定动作
    always::UserWarning        # 总是显示
    once::FutureWarning        # 只显示一次
    module::ImportWarning      # 每个模块显示一次
    
    # 4. 复杂模式
    ignore:.*U.*mode.*:DeprecationWarning
    error:.*deprecated.*:DeprecationWarning
```

### 3.4 日志配置
```ini
[pytest]
# 控制台日志
log_cli = true                          # 启用控制台日志
log_cli_level = INFO                    # 日志级别
log_cli_format = %(asctime)s [%(levelname)8s] %(message)s
log_cli_date_format = %Y-%m-%d %H:%M:%S

# 文件日志
log_file = logs/pytest.log              # 日志文件路径
log_file_level = DEBUG                  # 文件日志级别
log_file_format = %(asctime)s [%(levelname)8s] %(name)s: %(message)s
log_file_date_format = %Y-%m-%d %H:%M:%S

# 自动日志捕获
log_auto_indent = true                  # 自动缩进
log_format = %(levelname)8s %(name)s:%(lineno)d %(message)s
log_date_format = %Y-%m-%d %H:%M:%S
```

### 3.5 JUnit XML报告
```ini
[pytest]
# 生成JUnit XML报告
junit_suite_name = My Test Suite
junit_logging = all
junit_duration_report = call
junit_family = xunit2

# 高级配置
junit_log_passing_tests = true
junit_duration_report = total
junit_suite_name_remove_path = true
```

## 四、高级配置技巧
### 4.1 环境特定配置
```ini
[pytest]
# 基础配置
testpaths = tests
python_files = test_*.py
addopts = -v

# 通过环境变量覆盖
# 开发环境
addopts_dev = --tb=short -x --lf
# CI环境
addopts_ci = --junitxml=report.xml --cov --cov-report=xml
# 生产环境
addopts_prod = --tb=no -q

# 使用环境变量选择
import os
env = os.getenv("PYTEST_ENV", "dev")
if env == "ci":
    addopts = {addopts_ci}
elif env == "prod":
    addopts = {addopts_prod}
else:
    addopts = {addopts_dev}
```

### 4.2 动态配置
```ini
[pytest]
# 通过conftest.py动态配置
import sys
import os

# 根据Python版本配置
if sys.version_info >= (3, 10):
    addopts = --tb=short -v
else:
    addopts = -v

# 根据操作系统配置
if sys.platform == "win32":
    markers = windows: windows only
elif sys.platform == "linux":
    markers = linux: linux only
elif sys.platform == "darwin":
    markers = macos: macos only

# 根据环境变量配置
if os.getenv("CI"):
    junit_suite_name = CI Test Run
    addopts += --junitxml=junit.xml
```

### 4.3 插件集成配置
```ini
[pytest]
# pytest-cov 覆盖率
addopts = --cov=src --cov-report=term-missing --cov-report=html

# pytest-xdist 并行测试
addopts = -n auto
xfail_strict = true

# pytest-asyncio
asyncio_mode = auto

# pytest-bdd
bdd_features_base_dir = features/
bdd_strict_gherkin = false

# pytest-django
DJANGO_SETTINGS_MODULE = myproject.settings
```

## 五、配置文件组织结构
* **5.1 多环境配置示例**
    ```
    project/
    ├── pyproject.toml           # 基础配置
    ├── pytest.ini              # 本地开发
    ├── pytest-ci.ini           # CI环境
    ├── conftest.py             # 共享fixtures
    ├── src/                    # 源代码
    │   └── myapp/
    └── tests/                  # 测试代码
        ├── unit/               # 单元测试
        │   ├── conftest.py     # 单元测试fixtures
        │   └── test_*.py
        ├── integration/        # 集成测试
        │   ├── conftest.py     # 集成测试fixtures
        │   └── test_*.py
        └── e2e/                # 端到端测试
            ├── conftest.py     # E2E测试fixtures
            └── test_*.py
    ```

* **5.2 分层配置示例**  
    目录 pyproject.toml：
    ```toml
    [tool.pytest.ini_options]
    testpaths = ["tests"]
    addopts = "-v"
    markers = [
        "unit: unit tests",
        "integration: integration tests",
        "e2e: end-to-end tests"
    ]
    ```
    
    tests/unit/conftest.py：  
    ```python
    # 单元测试特定配置
    import pytest

    def pytest_collection_modifyitems(config, items):
        """为单元测试自动添加标记"""
        for item in items:
            if "unit" in str(item.fspath):
                item.add_marker(pytest.mark.unit)
    ```

    tests/integration/pytest.ini：
    ```ini
    [pytest]
    # 集成测试特定配置
    addopts = --tb=short -m integration
    timeout = 60
    ```

## 六、配置验证和调试
* **6.1 验证配置文件**
    ```bash
    # 查看有效配置
    pytest --help

    # 查看已注册的标记
    pytest --markers

    # 查看收集的测试
    pytest --collect-only

    # 查看配置详情
    pytest --version
    pytest --config
    ```
* **6.2 调试配置文件**
    ```python
    # conftest.py
    def pytest_configure(config):
        """调试配置"""
        print("=== pytest_configure ===")
        print(f"Rootdir: {config.rootdir}")
        print(f"Inifile: {config.inifile}")
        print(f"Addopts: {config.option.addopts}")
        print(f"Testpaths: {config.getini('testpaths')}")
        print(f"Markers: {config.getini('markers')}")
    ```

## 七、最佳实践建议
* **7.1 配置选择**
    ```yaml
    项目类型            推荐配置          说明
    --------------     -------------    ----------------
    现代Python项目     pyproject.toml     PEP 621标准，统一管理
    Django项目         pytest.ini        传统，社区习惯
    混合项目           pytest.ini        兼容性好
    库/包              pyproject.toml    与构建工具集成
    ```
* **7.2 配置文件组织**
    ```ini
    # 1. 基础配置（必须）
    [pytest]
    testpaths = tests
    addopts = -v --tb=short
    markers = 基本标记

    # 2. 环境特定（按需）
    filterwarnings = 警告过滤
    log_cli = 日志配置
    junit_* = 报告配置

    # 3. 插件集成（按需）
    asyncio_mode = asyncio配置
    cov_* = 覆盖率配置
    ```
* **7.3 版本控制**
    ```ini
    # .gitignore
    .pytest_cache/
    .coverage
    htmlcov/
    *.xml
    *.html
    logs/*.log
    !logs/.gitkeep
    ```

## 八、实用配置片段
* **8.1 开发环境配置**
    ```ini
    [pytest]
    testpaths = tests
    python_files = test_*.py
    addopts = 
        -v
        --tb=short
        -x
        --lf
        --capture=no
    markers =
        unit: 单元测试
        integration: 集成测试
        slow: 慢速测试
    filterwarnings =
        ignore::DeprecationWarning
        ignore::FutureWarning
    ```
* **8.2 CI环境配置**
    ```ini
    [pytest]
    testpaths = tests
    addopts = 
        -v
        --tb=line
        --strict-markers
        --junitxml=junit.xml
        --cov=src
        --cov-report=xml
        --cov-report=term-missing
    junit_suite_name = CI Test Suite
    ```
* **8.3 完整企业级示例**
    ```toml
    # pyproject.toml
    [build-system]
    requires = ["setuptools>=61.0"]
    build-backend = "setuptools.build_meta"

    [project]
    name = "myproject"
    version = "1.0.0"
    dependencies = []

    [tool.pytest.ini_options]
    testpaths = ["tests"]
    python_files = ["test_*.py", "*_test.py"]
    python_classes = ["Test*"]
    python_functions = ["test_*", "should_*"]
    addopts = [
        "-v",
        "--strict-markers",
        "--tb=short",
        "--durations=10",
        "--disable-warnings",
        "-p", "no:warnings"
    ]

    markers = [
        "unit: Unit tests (< 0.1s)",
        "integration: Integration tests (0.1-1s)",
        "e2e: End-to-end tests (> 1s)",
        "slow: Slow tests (> 5s, run separately)",
        "flaky(reruns=3): Flaky tests that can be retried",
        "windows: Windows-specific tests",
        "linux: Linux-specific tests",
        "macos: macOS-specific tests",
        "docker: Requires Docker",
        "database: Requires database",
        "api: API tests",
        "security: Security tests"
    ]

    filterwarnings = [
        "error",
        "ignore::DeprecationWarning",
        "ignore::PendingDeprecationWarning",
        "ignore::FutureWarning:.*:",
        "ignore:.*U.*mode.*:DeprecationWarning"
    ]

    log_cli = true
    log_cli_level = "INFO"
    log_cli_format = "%(asctime)s [%(levelname)-8s] %(name)-20s: %(message)s"
    log_cli_date_format = "%H:%M:%S"

    junit_suite_name = "MyProject Test Suite"
    junit_family = "xunit2"
    junit_logging = "system-out"

    [tool.coverage.run]
    source = ["src"]
    omit = [
        "*/tests/*",
        "*/migrations/*",
        "*/__pycache__/*",
        "setup.py"
    ]

    [tool.coverage.report]
    exclude_lines = [
        "pragma: no cover",
        "def __repr__",
        "if self.debug:",
        "if 0:",
        "if __name__ == .__main__.:",
        "raise AssertionError",
        "raise NotImplementedError"
    ]

    [tool.coverage.html]
    directory = "coverage_html"
    title = "Coverage Report"
    ```

## 九、总结

**pytest 配置文件是测试框架的控制中心，合理配置可以：**  
* 统一测试规范：确保团队使用相同的测试发现和运行规则  
* 提高测试效率：通过合理配置减少等待时间，优化输出  
* 增强测试可维护性：清晰的标记系统和配置结构  
* 集成CI/CD：生成标准化的测试报告  
* 管理测试环境：不同环境使用不同配置 
   
**核心建议：**  
* 新项目使用 pyproject.toml  
* 明确配置测试发现规则  
* 使用标记系统组织测试  
* 合理配置日志和报告  
* 为不同环境准备不同配置  
* 文档化配置项，特别是自定义标记*