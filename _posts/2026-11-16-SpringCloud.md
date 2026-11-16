---
title: "SpringCloud相关"
categories:
  - 后端
tags:
  - Spring Cloud
  - 微服务
  - SpringBoot
  - Nacos
toc: true
order: 4
---
# Spring Cloud 微服务 完整系统学习大纲

> 本文面向**测试工程师**，按"微服务认知 → 技术选型 → 核心组件 → 测试策略 → 测试实战 → 发布与监控"的顺序组织，由浅入深。
> 你已有 [SpringBoot]({%post_url 2026-05-05-SpringBoot%}) 篇——Spring Cloud 不是替代它，而是把**多个 SpringBoot 应用组织成一套分布式系统**。单体变微服务后，"一个服务挂了全部能用"变成"一个服务挂了连锁反应"，**测试的重心从"功能对不对"扩展到"依赖挂了系统还能不能用"**。

## 一、微服务概述

### 1.1 从单体到微服务

```text
单体架构                         微服务架构
┌──────────────────┐        ┌────────┐ ┌────────┐ ┌────────┐
│   一个大工程       │        │ 订单服务 │ │ 用户服务 │ │ 商品服务 │
│  ┌────┐ ┌────┐  │        └───┬────┘ └───┬────┘ └───┬────┘
│  │订单│ │用户│  │   ──►       │          │          │
│  │模块│ │模块│  │        ┌────┴──────────┴──────────┴────┐
│  └────┘ └────┘  │        │  注册中心 / 配置中心 / 网关      │
│  一个数据库       │        │  独立数据库 × N                │
└──────────────────┘        └───────────────────────────────┘
```

| 维度 | 单体 | 微服务 |
| :--- | :--- | :--- |
| 部署 | 一个包 | 几十个服务独立部署 |
| 技术栈 | 统一 | 各服务可不同 |
| 故障影响 | 一处崩溃全挂 | 隔离在单个服务（设计好时） |
| 扩容 | 整体复制 | 按需对单个服务扩 |
| 数据 | 共库 | **每服务独立库**（跨库事务是难点） |
| 测试 | 一套环境 | **环境依赖复杂，链路长** |

### 1.2 微服务带来的测试挑战

| 挑战 | 表现 | 测试应对 |
| :--- | :--- | :--- |
| **依赖链长** | 订单服务依赖用户、商品、库存、支付… | 服务虚拟化 / Mock / 测试环境治理 |
| **数据一致性** | 跨服务事务没有本地回滚 | 分布式事务专项测试（见 3.7） |
| **连锁失败** | 一个服务慢 → 拖垮调用方 → 雪崩 | 熔断降级测试、混沌工程（见 4.5） |
| **环境不稳定** | 他人部署影响你的测试 | 流量隔离、灰度环境 |
| **问题定位难** | 一次请求跨 5 个服务 | 链路追踪（traceId 贯穿） |

### 1.3 技术选型对比

| 体系 | 代表组件 | 现状 | 特点 |
| :--- | :--- | :--- | :--- |
| **Spring Cloud Netflix** | Eureka / Ribbon / Hystrix / Zuul | 多数进入**维护模式**（停更） | 第一代，老项目常见 |
| **Spring Cloud 官方** | Gateway / LoadBalancer / CircuitBreaker / Config | 活跃 | 第二代，替换 Netflix |
| **Spring Cloud Alibaba** ★ | **Nacos / Sentinel / Seata / RocketMQ** | 活跃，国内主流 | 国内项目事实标准 |
| Dubbo | Dubbo + Nacos/ZooKeeper | 活跃 | RPC 框架，阿里系 |
| K8s 原生 | Service/Istio | 活跃 | 把服务治理下沉到基础设施 |

> 💡 **测试视角**：新项目基本是 **Spring Cloud Alibaba（Nacos + Sentinel + Seata）+ Gateway + OpenFeign** 这套组合，本文以它为主线，Netflix 组件做对照。

### 1.4 典型架构全景

```text
                        ┌─────────────┐
   用户/App/小程序 ──►  │   Gateway    │  统一入口、鉴权、限流
                        └──────┬──────┘
              ┌────────────┬───┴────────┬────────────┐
              ▼            ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ 订单服务  │ │ 用户服务  │ │ 商品服务  │ │ 支付服务  │
        └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
             │  OpenFeign 相互调用（LoadBalancer 负载均衡）
             ▼            ▼            ▼            ▼
          [MySQL]      [MySQL]      [MySQL]      [MySQL]

   支撑设施：
   Nacos    注册中心 + 配置中心   ← 所有服务启动时注册
   Sentinel 控制台               ← 限流/熔断规则
   Seata    分布式事务协调器
   Sleuth/Zipkin  链路追踪        ← traceId 串起整个调用链
```

## 二、核心组件详解（一）：注册与配置

### 2.1 Nacos：注册中心 + 配置中心（二合一）

```bash
# 单机部署（测试环境）
docker run -d --name nacos -p 8848:8848 -p 9848:9848 \
  -e MODE=standalone nacos/nacos-server:v2.2.3

# 控制台：http://localhost:8848/nacos  （默认 nacos/nacos）
```

**服务注册（服务端只需配置）：**

```yaml
# order-service 的 application.yml
spring:
  application:
    name: order-service            # 服务名（注册与发现的钥匙）
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: test            # 命名空间隔离（dev/test/prod）
      config:
        server-addr: localhost:8848
        file-extension: yaml
```

**服务发现的工作机制（测试要懂）：**

```text
1. 服务启动 → 向 Nacos 注册（服务名 + IP + 端口 + 元数据）
2. 每 5 秒发一次心跳
3. 15 秒没心跳 → 标记为不健康（unhealthy）
4. 30 秒没心跳 → 剔除实例（临时实例）
5. 消费者从 Nacos 拉取服务列表（并订阅变更推送）

⚠️ 测试关键点：感知延迟
   服务被 kill -9 后，调用方最长可能还有 ~30 秒
   在调用一个"已死"的实例 → 报 Connection refused
   → 这不是 Bug，是注册中心的感知延迟，但要有熔断/重试兜底
```

**测试点：**

- [ ] 服务正常停止（kill -15 / 优雅停机）→ 立即从列表摘除，无报错
- [ ] 服务被强杀（kill -9）→ 感知延迟期间调用方的表现（应熔断或重试，不应大量失败）
- [ ] 重启后自动重新注册
- [ ] 多实例：扩到 2 个实例，流量是否分流
- [ ] namespace 隔离：dev 注册的服务，test 环境是否看不到

### 2.2 配置中心：动态刷新

```yaml
# bootstrap.yml（或新版本 application.yml 的 spring.config.import）
spring:
  cloud:
    nacos:
      config:
        server-addr: localhost:8848
        file-extension: yaml
        shared-configs:            # 多服务共享配置
          - data-id: common.yaml
            refresh: true
```

```java
// 配置类
@RestController
@RefreshScope                    // ★ 没有它，配置改了也不会刷新！
public class BizController {
    @Value("${order.limit:100}")
    private int orderLimit;
}
```

**测试点（配置中心是高频事故区）：**

| 测试点 | 方法 |
| :--- | :--- |
| 配置改动是否生效 | Nacos 控制台改配置 → 不重启服务 → 验证新值生效 |
| **`@RefreshScope` 缺失** | 改了配置服务却用旧值（最常见的配置 Bug） |
| 配置优先级 | 本地 `application.yml` vs Nacos 配置，谁覆盖谁 |
| 共享配置冲突 | 同一 key 在多处配置，最终生效的是哪个 |
| Nacos 挂了 | 服务重启时能否用本地快照兜底启动 |
| 敏感配置 | 数据库密码是否明文放在配置中心（应加密） |

## 三、核心组件详解（二）：调用与治理

### 3.1 OpenFeign：声明式服务调用

```java
// 声明接口即可调用远程服务（像调本地方法一样）
@FeignClient(
    name = "stock-service",                        // 目标服务名（走注册中心）
    fallback = StockClientFallback.class           // 熔断降级实现
)
public interface StockClient {

    @GetMapping("/api/stock/{productId}")
    StockDTO getStock(@PathVariable("productId") Long productId);

    @PostMapping("/api/stock/deduct")
    Boolean deduct(@RequestBody DeductRequest request);
}

// 降级实现：目标服务挂了/熔断时走这里
@Component
public class StockClientFallback implements StockClient {
    @Override
    public StockDTO getStock(Long productId) {
        // 兜底逻辑：返回缓存值/默认值，或抛业务异常
        throw new BizException("库存服务暂不可用，请稍后重试");
    }
}
```

```yaml
# 超时配置（重要测试点）
spring:
  cloud:
    openfeign:
      client:
        config:
          default:
            connect-timeout: 2000     # 连接超时 2s
            read-timeout: 5000        # 读超时 5s
          stock-service:              # 针对单个服务覆盖
            read-timeout: 10000
```

**测试点：**

- [ ] 目标服务正常 → 调用成功
- [ ] 目标服务响应慢（> read-timeout）→ 超时触发 fallback，**调用方不能被拖死**
- [ ] 目标服务挂掉 → 走降级逻辑，返回可理解的错误（不是 500 堆栈）
- [ ] **超时级联**：A→B→C，B 的超时应大于 C 的（否则 B 先超时，C 白算）
- [ ] 重试配置：Feign 默认不重试（GET 除外按配置），POST 重试会导致重复下单 ★

### 3.2 Gateway：统一网关

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: order-route
          uri: lb://order-service            # lb:// = 从注册中心负载均衡
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=1                   # 去掉 /api 前缀再转发
        - id: user-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
            - Method=GET,POST
      default-filters:
        - name: RequestRateLimiter            # 全局限流（基于 Redis）
          args:
            redis-rate-limiter.replenish-rate: 100   # 每秒补充 100 个令牌
            redis-rate-limiter.burst-capacity: 200   # 突发容量
      globalcors:                             # 跨域配置
        cors-configurations:
          '[/**]':
            allowed-origins: "https://www.example.com"
            allowed-methods: "*"
```

**网关职责与测试点：**

| 职责 | 测试点 |
| :--- | :--- |
| 路由转发 | 各路径是否转发到正确服务；`StripPrefix` 是否正确 |
| **统一鉴权** | 不带 token 是否被拦（全局过滤器）；已登录 token 是否透传给下游 |
| **限流** | 并发超阈值是否返回 429；限流是否只针对该接口（不能误伤其他） |
| 跨域 | 预检 OPTIONS 是否通过；`allowed-origins` 是否过宽（`*` 是安全隐患） |
| 黑白名单 | IP 黑名单生效性 |
| 灰度路由 | 按请求头/权重路由到不同版本（见 6.3） |

```bash
# 限流验证（ab 或简单并发脚本）
for i in $(seq 1 300); do
  curl -s -o /dev/null -w "%{http_code}\n" http://gateway:8080/api/order/list &
done | sort | uniq -c
# 预期：大部分 200，超出配额的部分是 429
```

### 3.3 负载均衡：Ribbon / LoadBalancer

| 策略 | 说明 | 测试点 |
| :--- | :--- | :--- |
| 轮询（默认） | 依次分发 | 2 实例流量是否约 1:1 |
| 随机 | 随机选实例 | 大样本下分布是否均匀 |
| 加权轮询 | 按权重（Nacos 元数据 weight） | 权重 1:3 的实例流量是否约 1:3 |
| 最少活跃 | 选当前请求最少的 | 慢节点是否被自然避开 |

```python
# 验证负载均衡：统计请求落到哪个实例
import requests
from collections import Counter

hits = Counter()
for _ in range(200):
    r = requests.get("http://gateway:8080/api/order/instance", timeout=5)
    hits[r.json().get("instance", "unknown")] += 1

print(hits)   # 预期：两个实例各约 100 次；偏差过大需排查
```

### 3.4 熔断降级：Sentinel / CircuitBreaker（重点）

**熔断三状态：**

```text
          失败率超阈值
 CLOSED ──────────────► OPEN
 (放行)                 (直接拒绝/走降级)
   ▲                      │
   │  探测成功             │ 熔断时长结束
   │                      ▼
   └────────────────── HALF-OPEN
              (放少量探测请求)
```

**Sentinel 规则类型：**

| 规则 | 触发条件 | 典型用途 |
| :--- | :--- | :--- |
| **流控规则** | QPS 或并发线程数超阈值 | 保护自身不被打垮 |
| **熔断规则** | 慢调用比例 / 异常比例 / 异常数超阈值 | 快速失败，防雪崩 |
| **热点规则** | 某个参数值被高频访问 | 防单商品被刷 |
| **系统规则** | 整机 LOAD/CPU/RT 超限 | 兜底保护 |

```java
// 资源定义 + 降级逻辑
@SentinelResource(value = "getOrder",
                  blockHandler = "getOrderBlock",      // 被限流/熔断时
                  fallback = "getOrderFallback")       // 业务异常时
public Order getOrder(Long id) {
    return orderService.getById(id);
}

public Order getOrderBlock(Long id, BlockException ex) {
    return Order.defaultOrder();          // 降级：返回默认值
}
```

**熔断降级测试方法（实战价值最高）：**

```text
步骤：
1. 在 Sentinel 控制台对目标接口配置熔断规则
   （如：异常比例 > 50%，熔断 10 秒）
2. 让目标接口持续抛异常（可用测试开关或 mock 异常）
3. 观察三个阶段：
   ① 熔断前：请求打到真实逻辑，返回 500
   ② 熔断触发后：请求直接走降级，响应变快（RT 骤降）
   ③ 半开恢复：10 秒后放一个探测请求
      - 成功 → 熔断关闭，恢复正常
      - 失败 → 继续熔断

验证点：
□ 熔断触发后调用方收到的是降级结果（友好提示），不是 500
□ 熔断期间依赖该服务的上游服务自身还健康（没有连锁挂）
□ 恢复后功能正常
□ 熔断规则对并发场景生效（不是只在单线程下有效）
```

### 3.5 链路追踪：Sleuth + Zipkin（排障基础设施）

```text
一次请求在微服务间的完整链路：

traceId: abc123（全局唯一，贯穿始终）
├─ Gateway          spanId: a1   耗时 2ms
├─ order-service    spanId: b1   耗时 150ms
│   ├─ user-service spanId: c1   耗时 30ms
│   └─ stock-service spanId: d1  耗时 118ms  ← 慢在这里
└─ 响应

排查方法：拿一个失败请求的 traceId，在 Zipkin 查整条链路
→ 一眼看到哪个服务慢/哪个服务报错
```

**测试视角：**
- 提 Bug 时**必带 traceId**——开发和测试沟通效率提升一个量级
- 验证：跨服务调用后，各服务日志里 traceId 是否一致
- 抽样率：生产环境不是全量采样，注意"没看到不等于没发生"

## 四、微服务测试策略（重点）

### 4.1 测试金字塔在微服务下的形态

```text
        ╱  端到端 E2E  ╲        少：全链路冒烟/核心场景（慢、脆弱）
       ╱  契约/集成测试  ╲      中：服务间接口、契约、依赖真实化
      ╱   服务级接口测试   ╲    多：单服务的 API 测试（pytest + mock 依赖）
     ╱    组件/单元测试     ╲   最多：JUnit/pytest（快、稳定）
```

| 层次 | 范围 | 重点 |
| :--- | :--- | :--- |
| 单元测试 | 单个类/方法 | 业务逻辑、边界值 |
| **服务级接口测试** | 单服务的 HTTP API | 鉴权、参数、状态码、Mock 掉外部依赖 |
| **契约测试** | 服务间调用的约定 | 生产者/消费者契约不破坏（见 4.4） |
| 集成测试 | 多服务联调 | 真实链路、数据一致性 |
| E2E | 全系统 | 核心用户旅程（下单→支付→发货） |
| **韧性测试** | 故障注入 | 熔断/降级/超时是否如预期（见 4.5） |

### 4.2 服务虚拟化与 Mock

微服务测试环境最大的痛是**依赖服务不可控**。三层解法：

```text
1. 稳定的公共测试环境：依赖服务有常驻实例（最省事，但会被别人部署影响）
2. Mock 依赖：用 WireMock/MockServer 起个假的用户服务
   → 单服务测试不受他人影响
3. 流量隔离 + 灰度路由：测试流量打标后走自己的实例链路（见 6.3）
```

```java
// WireMock 示例：mock 用户服务
stubFor(get(urlEqualTo("/api/user/1"))
    .willReturn(okJson("{\"id\":1,\"name\":\"测试用户\",\"vip\":true}")));
```

### 4.3 数据一致性与分布式事务

每服务独立库后，跨服务写操作没有本地事务保护：

```text
下单流程（跨 3 个服务）：
  ① 订单服务：创建订单（状态=待支付）
  ② 库存服务：扣减库存
  ③ 支付服务：发起支付

如果 ② 成功、③ 失败 → 库存扣了、订单没支付 → 数据不一致！
```

**Seata 的 AT 模式**（自动补偿）：

```java
// 只需加一个注解，Seata 自动做两阶段提交/回滚
@GlobalTransactional
public void createOrder(OrderRequest req) {
    orderMapper.insert(order);            // 分支事务 1
    stockClient.deduct(req.getProductId(), req.getQty());   // 分支事务 2 (Feign)
    payClient.createPay(order.getId(), req.getAmount());    // 分支事务 3
    // 若第 3 步抛异常 → Seata 自动回滚前两步（根据 undo_log 反向补偿）
}
```

**分布式事务测试用例（必测清单）：**

| 场景 | 预期 |
| :--- | :--- |
| 全部成功 | 三方数据一致 |
| **第 2 步失败** | 第 1 步回滚（订单不存在、库存未扣） |
| **第 3 步失败** | 前两步都回滚 |
| 回滚期间并发查询 | 看到的状态是中间态还是最终态（隔离级别） |
| 回滚本身失败 | 补偿重试机制、人工干预入口 |
| 幂等 | 同一请求重发不会重复扣库存 |
| TCC 模式 | Try 失败后 Cancel 是否执行、空回滚/悬挂问题 |

### 4.4 契约测试（Contract Testing）

**解决什么**：提供方改了接口（字段改名/删字段），消费方不知道，运行时才炸。

```text
消费者驱动的契约（以 Spring Cloud Contract / Pact 为例）：

1. 消费方定义契约："我期望 GET /stock/{id} 返回 { id, qty, version }"
2. 提供方拿到契约，在 CI 里验证自己的实现是否满足
3. 提供方每次改动 → 契约测试自动跑 → 破坏契约直接构建失败

测试价值：把"运行时才发现的接口不兼容"提前到 CI 阶段
```

### 4.5 韧性测试 / 混沌工程

**核心问题：微服务不是"平时能用"，而是"出问题时还能用"。**

| 注入的故障 | 验证点 |
| :--- | :--- |
| kill 掉一个下游服务 | 调用方熔断/降级是否生效，不雪崩 |
| 给下游注入 3s 延迟 | 超时+熔断按配置触发 |
| 断开数据库连接 | 服务报错是否可控、恢复后自愈 |
| 网络丢包 30% | 重试与幂等配合是否正确 |
| Redis 挂掉 | 是否降级到 DB（还是直接全挂） |

> 工具：ChaosBlade、Chaos Mesh（K8s 场景）、Pumba。详细方法论见契约测试与混沌工程专题（Details 规划中）。

## 五、测试实战

### 5.1 微服务接口测试脚本示例

```python
# test_microservice.py
import requests
import pytest

GATEWAY = "http://gateway.test.example.com"     # 走网关（验证路由+鉴权）
ORDER_SVC = "http://order-service.test.example.com"  # 直连服务（绕过网关）


def test_via_gateway_auth():
    """网关统一鉴权：不带 token 应被拦"""
    r = requests.get(f"{GATEWAY}/api/order/list", timeout=5)
    assert r.status_code in (401, 403), "网关未拦截未鉴权请求"


def test_direct_service_no_auth():
    """绕过网关直连服务：应被服务自身拦截（纵深防御）★"""
    r = requests.get(f"{ORDER_SVC}/order/list", timeout=5)
    # 若服务自己不鉴权，此处返回 200 → 高危（内网被攻破后裸奔）
    assert r.status_code in (401, 403), \
        f"服务缺少自身鉴权，直连返回 {r.status_code}"


def test_timeout_cascade():
    """验证下游慢时，调用方按配置超时并降级，而不是无限等待"""
    import time
    start = time.time()
    r = requests.get(f"{GATEWAY}/api/order/detail?id=1", timeout=15)
    elapsed = time.time() - start
    # 假设 stock-service 被注入 10s 延迟，order 读超时 5s
    # 预期：5s 左右返回降级结果，而不是等满 10s+
    assert elapsed < 8, f"调用耗时 {elapsed:.1f}s，疑似超时未生效"
    assert "库存服务" not in r.text or "稍后重试" in r.text


def test_rate_limit():
    """网关限流：并发 200 打 100 QPS 的接口"""
    from concurrent.futures import ThreadPoolExecutor
    codes = []

    def hit(_):
        try:
            r = requests.get(f"{GATEWAY}/api/order/list", timeout=5)
            codes.append(r.status_code)
        except Exception:
            codes.append("err")

    with ThreadPoolExecutor(max_workers=50) as ex:
        list(ex.map(hit, range(200)))

    from collections import Counter
    stat = Counter(codes)
    print(stat)
    assert stat.get(429, 0) > 0, "未见限流响应，限流可能未配置"
    assert stat.get(200, 0) > 0, "全部被限，限流阈值可能过低"
```

### 5.2 微服务故障场景清单（提 Bug 与验收对照）

| 故障 | 系统应表现 | 常见错误实现 |
| :--- | :--- | :--- |
| 某服务宕机 | 调用方熔断降级，其余功能正常 | 全站 500 |
| 下游响应慢 | 按超时熔断，用户看到"稍后重试" | 用户无限等待 |
| Nacos 挂掉 | 在线服务继续用本地缓存列表运行 | 全站瘫痪 |
| 配置中心改错值 | 能快速回滚配置 | 需要重新发版 |
| Redis 挂掉 | 降级读 DB，性能下降但可用 | 直接不可用 |
| MQ 积压 | 消费端限速、告警 | 消息丢失或 OOM |
| 数据库主从延迟 | 读主库或容忍短暂不一致 | 刚写完读不到 |

### 5.3 排障三板斧（测试定位问题的顺序）

```text
1. 看注册中心：服务在不在？实例数对不对？健康状态？
   → Nacos 控制台 → 服务列表
2. 看链路：这次请求走到了哪？哪一段慢/报错？
   → Zipkin / SkyWalking 查 traceId
3. 看日志：对应服务、对应实例的日志
   → kubectl logs（K8s 环境）/ 日志平台（ELK）

再配合：
4. 看熔断降级：Sentinel 控制台是否触发了熔断
5. 看配置：是不是某次配置变更引入（看 Nacos 变更历史）
```

## 六、发布与运行时治理

### 6.1 部署形态

| 方式 | 说明 | 测试关注 |
| :--- | :--- | :--- |
| Docker Compose | 一键起全套（开发/测试环境） | 依赖启动顺序（Nacos 先于业务服务） |
| Kubernetes | 生产主流（见 K8s 篇） | 探针、资源限制、滚动更新 |
| 传统 jar 部署 | `java -jar` + 启动脚本 | 配置隔离、端口规划 |

```yaml
# docker-compose.yml（测试环境整套微服务）
services:
  nacos:
    image: nacos/nacos-server:v2.2.3
    environment: { MODE: standalone }
    ports: ["8848:8848"]
  mysql:
    image: mysql:8.0
    environment: { MYSQL_ROOT_PASSWORD: "123456" }
  redis:
    image: redis:7
  order-service:
    image: registry.example.com/order-service:latest
    environment:
      SPRING_PROFILES_ACTIVE: test
      SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR: nacos:8848
    depends_on: [nacos, mysql, redis]
    deploy: { replicas: 2 }          # 2 个实例，方便测负载均衡
```

### 6.2 灰度发布与流量染色

```text
需求：新版本只让 10% 用户/内部员工先用，观察无异常再全量

实现：Gateway 按规则路由 + Nacos 元数据
  ┌                 ┐
  │ 请求带 header:   │──── 灰度标记 ────► v2 实例（metadata.version=gray）
  │ X-Gray: true    │
  │ 无标记          ├──── 90% ────────► v1 实例（metadata.version=stable）
  └                 ┘
```

**灰度测试点：**

- [ ] 带灰度标记的请求**全量**到 v2，不带的全到 v1（不能串）
- [ ] **灰度实例挂了**，灰度流量是否回落到 v1（而不是直接报错）
- [ ] v1/v2 同时在线时，**MQ 消息**两边都会消费吗（是否重复消费）
- [ ] 数据库结构变更：v1 与 v2 是否兼容同一张表（**不能互踩**）
- [ ] 灰度期间用 v1 下的订单，v2 能否正确处理
- [ ] 全量切流后，v1 实例摘除，老会话是否受影响

### 6.3 监控告警（测试验证指标）

| 层 | 工具 | 关注指标 |
| :--- | :--- | :--- |
| 服务 | Prometheus + Grafana | QPS、RT（P99）、错误率 |
| 链路 | SkyWalking / Zipkin | 慢调用定位 |
| 资源 | node-exporter / cAdvisor | CPU、内存、GC |
| 业务 | 自定义埋点 | 下单量、支付成功率 |

> 监控体系详见后续 Prometheus + Grafana 专题（P1 规划中）。

## 七、常见问题速查

| 问题 | 原因 | 解决/验证 |
| :--- | :--- | :--- |
| 服务调用 404 | 服务名错 / namespace 不一致 / 路由没配 | 查 Nacos 服务列表里的服务名 |
| 配置改了不生效 | 缺 `@RefreshScope` | 加注解后重启再测 |
| 调用报 Connection refused | 目标实例已死但未摘除（感知延迟） | 等待或查心跳；确认有熔断兜底 |
| Feign 报 Read timed out | 下游慢 / 超时配置过小 | 调 read-timeout；排查下游慢 SQL |
| 网关 503 | 路由的 `uri: lb://服务名` 无可用实例 | 查注册中心实例健康状态 |
| 限流不生效 | Sentinel 规则未推送 / 网关限流缺 Redis | 控制台确认规则已下发 |
| 熔断后一直不恢复 | 半开探测持续失败 / 规则配置问题 | 查 Sentinel 控制台熔断状态 |
| 分布式事务没回滚 | 未加 `@GlobalTransactional` / Seata 未部署 | 确认注解与 TC Server |
| 重复消费 MQ | 消费端未幂等 | 业务侧加唯一键/幂等表 |
| 灰度流量串了 | 网关路由规则/元数据配置错 | 用染色请求逐实例验证 |
| 跨域报错 | Gateway CORS 配置不全 | 检查预检请求与 allowed-origins |
| 服务启动慢/注册慢 | Nacos 未就绪服务就起了 | 启动顺序 / 健康检查就绪探测 |

## 八、学习资源

| 资源 | 说明 |
| :--- | :--- |
| [Spring Cloud 官方文档](https://spring.io/projects/spring-cloud) | 组件总览与版本对应 |
| [Spring Cloud Alibaba](https://sca.aliyun.com/) | Nacos/Sentinel/Seata 权威文档 |
| [Nacos 官网](https://nacos.io/) | 注册/配置中心 |
| [Sentinel GitHub](https://github.com/alibaba/Sentinel) | 熔断限流 |
| [Seata 官网](https://seata.apache.org/) | 分布式事务 |
| [Spring Cloud Gateway 文档](https://docs.spring.io/spring-cloud-gateway/reference/) | 网关 |
| [Spring Cloud Contract](https://spring.io/projects/spring-cloud-contract) | 契约测试 |
| [本站：SpringBoot]({%post_url 2026-05-05-SpringBoot%}) | 单服务基础 |
| [本站：Kubernetes]({%post_url 2026-10-26-Kubernetes%}) | 微服务部署载体 |
| [本站：Kafka]({%post_url 2026-10-22-Kafka%}) | 微服务间异步通信 |
