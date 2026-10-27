---
title: "Kubernetes相关"
categories:
  - 运维部署
tags:
  - Kubernetes
  - K8s
  - 容器编排
  - kubectl
toc: true
order: 3
---
# Kubernetes 容器编排 完整系统学习大纲

> 本文面向**测试工程师**，按"概念 → 动手 → 核心对象 → 网络/配置/存储 → 调度运维 → 测试实战"的顺序组织，由浅入深。
> 学 Docker 解决的是"一个容器怎么跑"，学 Kubernetes（简称 K8s）解决的是"成百上千个容器怎么协同、自愈、伸缩、发布"。测试同学掌握它，就能自己拉起一整套测试环境、验证弹性伸缩与高可用、做故障注入与混沌测试。

## 一、Kubernetes 概述

### 1.1 什么是 Kubernetes？

*   **定义**：Kubernetes 是 Google 开源的**容器编排系统**，用于自动化部署、扩缩容和管理容器化应用。
*   **词源**：希腊语"舵手/领航员"，简称 **K8s**（K 和 s 之间有 8 个字母）。
*   **起源**：源自 Google 内部使用了十几年的 Borg 系统，2014 年开源，现由 CNCF 托管。
*   **地位**：容器编排领域的**事实标准**，云厂商（阿里云 ACK、腾讯云 TKE、AWS EKS、GKE）全部托管支持。

### 1.2 容器编排要解决什么问题？

Docker 单机很方便，但到了生产/测试集群就会遇到：

| 问题 | Docker 单机 | Kubernetes 的解法 |
| :--- | :--- | :--- |
| 容器挂了怎么办 | 人工重启 | **自愈**：自动重建 |
| 流量大了怎么办 | 手动多起几个 | **自动伸缩**（HPA） |
| 容器放哪台机器 | 自己挑 | **自动调度**（按资源打分） |
| 服务之间怎么访问 | 手动配 IP/端口 | **Service + DNS** 服务发现 |
| 怎么发布新版本 | 停掉再起 | **滚动更新**，不中断 |
| 配置/密码怎么管 | 打进镜像 | **ConfigMap / Secret** 解耦 |
| 数据怎么存 | 挂本地目录 | **PV / PVC** 持久化 |

### 1.3 编排工具对比

| 工具 | 定位 | 现状 |
| :--- | :--- | :--- |
| **Kubernetes** | 完整编排平台 | ✅ 行业标准，生态最全 |
| **Docker Swarm** | Docker 官方编排 | ❌ 已基本停止发展 |
| **Docker Compose** | 单机多容器 | ✅ 本地开发/小规模仍好用 |
| **Mesos + Marathon** | 通用集群调度 | ❌ 已退场 |

> 💡 **测试建议**：本地联调、单人开发用 **Docker Compose** 就够了；一旦涉及多套环境、弹性伸缩、高可用验证，就必须上 K8s。

### 1.4 核心概念（务必先记牢）

| 概念 | 一句话解释 | 类比 |
| :--- | :--- | :--- |
| **Cluster（集群）** | 一组机器（节点）组成的整体 | 一个机房 |
| **Node（节点）** | 集群中的一台机器（物理机/虚拟机） | 一台服务器 |
| **Pod** | **最小调度单元**，含 1~N 个容器 | 一个"逻辑主机" |
| **Container** | 真正跑应用的容器 | 一个进程 |
| **Deployment** | 管理 Pod 副本数、滚动更新 | 应用发布器 |
| **ReplicaSet** | 保证 Pod 副本数量 | 副本控制器 |
| **Service** | 为一组 Pod 提供**稳定访问入口** | 负载均衡 + 内网域名 |
| **Ingress** | 七层（HTTP）路由入口 | Nginx 虚拟主机 |
| **Namespace** | 逻辑隔离的"分组" | 环境隔离（dev/test/prod） |
| **ConfigMap** | 配置（明文） | 配置文件 |
| **Secret** | 敏感配置（密码/密钥） | 加密配置 |
| **Volume / PVC** | 存储 | 硬盘 |
| **Label / Selector** | 标签与选择器，对象间关联的纽带 | 打标签筛选 |

### 1.5 整体架构

```text
┌───────────────────────── Control Plane（控制平面，Master）────────────────────────┐
│                                                                                   │
│  kube-apiserver     集群唯一入口，所有操作都经过它（REST 接口）                      │
│  etcd               集群的"数据库"，保存所有状态（KV 存储）                          │
│  kube-scheduler     调度器：决定 Pod 放哪个 Node                                    │
│  kube-controller-manager  控制器：副本数、节点、服务账号等循环控制                    │
│  cloud-controller-manager 云厂商对接（负载均衡、磁盘等）                             │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘
                │ 通过 kube-apiserver 通信
┌───────────────┴───────────────────── Worker Node（工作节点）──────────────────────┐
│                                                                                   │
│  kubelet         节点上的"管家"，负责启停容器、上报状态                              │
│  kube-proxy      维护网络规则，实现 Service 的负载均衡                               │
│  容器运行时      真正跑容器的程序（containerd / CRI-O；K8s 1.24+ 已移除 dockershim） │
│  Pod             ┌──────────┐ ┌──────────┐                                        │
│                  │ Container│ │ Container│                                         │
│                  └──────────┘ └──────────┘                                         │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**一句话理解**：你向 `apiserver` 提交"期望状态"（我要 3 个副本），控制器不断对比"实际状态"，不一致就调整——这就是**声明式 API**。

### 1.6 典型应用场景

*   微服务部署与治理
*   **多套测试环境隔离**（用 Namespace 给每个测试人员一套环境）
*   弹性伸缩应对流量高峰
*   CI/CD 流水线（构建 → 推镜像 → 部署到 K8s）
*   AI/大数据任务调度

## 二、环境搭建与快速上手

### 2.1 几种本地环境对比

| 方案 | 特点 | 适合 |
| :--- | :--- | :--- |
| **minikube** | 单节点集群，自带 Dashboard，最成熟 | ✅ **学习首选** |
| **kind** | 用 Docker 容器模拟节点，启动快 | ✅ **CI 环境首选** |
| **k3s / k3d** | 轻量级 K8s，资源占用小 | 资源紧张的机器 |
| **Docker Desktop** | 自带 K8s，勾选即用 | Windows/macOS 图省事 |
| **kubeadm** | 手动搭建生产级集群 | 学习集群组建原理 |

### 2.2 minikube 快速上手（推荐）

```bash
# 1. 安装（需先有 Docker 或其他虚拟化环境）
# Windows (需管理员权限打开 PowerShell)
choco install minikube
# 或用 winget
winget install Kubernetes.minikube

# macOS
brew install minikube

# 2. 启动集群（国内建议加镜像源）
minikube start --image-mirror-country=cn --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers

# 3. 验证
kubectl cluster-info
kubectl get nodes

# 4. 打开可视化面板（另开终端保持运行）
minikube dashboard

# 5. 停止 / 删除
minikube stop
minikube delete
```

### 2.3 kind（CI 环境首选）

```bash
# 安装 kind
choco install kind          # Windows
brew install kind           # macOS

# 创建集群（比 minikube 快很多）
kind create cluster --name test

# 多节点集群配置 kind-config.yaml
cat > kind-config.yaml <<'EOF'
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
EOF
kind create cluster --name multi --config kind-config.yaml

# 删除
kind delete cluster --name test
```

### 2.4 kubectl 安装与配置

```bash
# kubectl 是与集群交互的唯一命令行工具
kubectl version --client

# 配置自动补全（强烈建议，命令太长）
# Bash
echo 'source <(kubectl completion bash)' >> ~/.bashrc
# Zsh
echo 'source <(kubectl completion zsh)' >> ~/.zshrc

# 设置别名（后面文章都用 k 替代 kubectl）
echo 'alias k=kubectl' >> ~/.bashrc
echo 'complete -F __start_kubectl k' >> ~/.bashrc
```

**kubectl 命令通式：**

```text
kubectl  [command]  [TYPE]  [NAME]  [flags]

command: get / describe / create / apply / delete / logs / exec / edit / scale
TYPE:    pods(po) / services(svc) / deployments(deploy) / nodes(no) / namespaces(ns)
NAME:    资源名，省略表示全部
flags:   -n 命名空间   -o 输出格式   --all-namespaces(-A)
```

**常用缩写**（记住能省很多时间）：

| 全称 | 缩写 | 全称 | 缩写 |
| :--- | :--- | :--- | :--- |
| pods | po | services | svc |
| deployments | deploy | namespaces | ns |
| nodes | no | replicasets | rs |
| configmaps | cm | persistentvolumeclaims | pvc |
| ingresses | ing | statefulsets | sts |

### 2.5 第一个应用：跑一个 Nginx

```bash
# 1. 创建一个 Deployment
kubectl create deployment my-nginx --image=nginx:1.25

# 2. 查看
kubectl get deployments
kubectl get pods -o wide

# 3. 暴露为 Service（NodePort 类型）
kubectl expose deployment my-nginx --port=80 --type=NodePort

# 4. 查看访问地址
kubectl get svc my-nginx
minikube service my-nginx --url    # minikube 专用，直接给 URL

# 5. 本地端口转发（测试调试最常用）
kubectl port-forward svc/my-nginx 8080:80
# 然后浏览器访问 http://localhost:8080

# 6. 清理
kubectl delete deployment my-nginx
kubectl delete service my-nginx
```

> 💡 **测试提示**：`kubectl port-forward` 是测试同学最常用的命令——不需要配 Ingress、不需要 LoadBalancer，直接把集群内的服务映射到本地端口调试。

## 三、核心对象：Pod

### 3.1 什么是 Pod？

*   Pod 是 K8s 的**最小调度单元**，不是容器。
*   一个 Pod 里可以跑 1 个或多个紧密协作的容器。
*   **同一 Pod 内的容器**：共享网络（同一个 IP、同一个 localhost）、共享存储卷。
*   Pod 是**短暂的**（ephemeral）：随时可能被销毁重建，**IP 会变**。

### 3.2 为什么需要 Pod 这一层？

```text
场景：主容器 + 日志收集容器（sidecar）

Pod (IP: 10.244.1.5)
├── 容器 A：业务应用（写日志到 /var/log/app.log）
└── 容器 B：日志采集器（读 /var/log/app.log 发到 ES）

两个容器共享同一个 Volume，B 能读到 A 写的日志；
共享网络，B 可以用 localhost 访问 A 的接口。
```

### 3.3 Pod 生命周期与状态

**Pod 阶段（Phase）：**

| 状态 | 含义 | 测试排查方向 |
| :--- | :--- | :--- |
| **Pending** | 已创建但还没调度成功或镜像在下载 | 资源不足？镜像拉不下来？ |
| **Running** | 已调度，至少一个容器在运行 | 正常，但仍需看就绪探针 |
| **Succeeded** | 所有容器成功结束（Job 类） | 一次性任务完成 |
| **Failed** | 至少一个容器异常退出 | 看日志和退出码 |
| **Unknown** | 节点失联，状态未知 | 节点网络/心跳问题 |

**容器状态（比 Pod 状态更常用）：**

| 状态 | 含义 |
| :--- | :--- |
| **Waiting** | 等待中（拉取镜像、等待调度） |
| **Running** | 正常运行 |
| **Terminated** | 已结束（有退出码） |

### 3.4 用 YAML 创建 Pod（声明式，重点）

命令行适合临时测试，**正式用法一律写 YAML**。

```yaml
# pod-demo.yaml
apiVersion: v1                    # API 版本
kind: Pod                         # 资源类型
metadata:                         # 元数据
  name: nginx-pod
  namespace: default
  labels:                         # 标签（Service 靠它筛选 Pod）
    app: nginx
    env: test
spec:                             # 期望状态
  containers:
    - name: nginx
      image: nginx:1.25           # 务必写具体版本，别用 latest
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 80
      resources:                  # 资源限制
        requests:                 # 调度时的最小保证
          cpu: "100m"             # 100m = 0.1 核
          memory: "128Mi"
        limits:                   # 上限，超了会被 OOMKill
          cpu: "500m"
          memory: "256Mi"
      env:                        # 环境变量
        - name: ENV_NAME
          value: "test"
```

```bash
kubectl apply -f pod-demo.yaml       # 创建/更新
kubectl get pod nginx-pod
kubectl describe pod nginx-pod       # 看详情和事件（排查首选）
kubectl logs nginx-pod               # 看日志
kubectl logs -f nginx-pod            # 实时跟踪
kubectl exec -it nginx-pod -- /bin/sh   # 进容器
kubectl delete -f pod-demo.yaml      # 删除
kubectl edit pod nginx-pod           # 在线编辑
```

**YAML 四大段（所有 K8s 资源通用）：**

| 字段 | 作用 |
| :--- | :--- |
| `apiVersion` | 用哪个 API 组/版本（v1、apps/v1、batch/v1…） |
| `kind` | 资源类型（Pod/Deployment/Service…） |
| `metadata` | 名字、命名空间、标签、注解 |
| `spec` | **期望状态**（你要什么） |
| `status` | 实际状态（系统填，不用写） |

> 💡 记不住字段怎么写？用 `kubectl explain pod.spec.containers` 查文档，比翻官网快。

### 3.5 探针（Probe）—— 保证应用"真活着"

K8s 默认的健康检查只能看容器进程在不在，**进程在但应用假死**它发现不了。探针解决这个。

| 探针 | 作用 | 失败后果 |
| :--- | :--- | :--- |
| **livenessProbe** 存活探针 | 容器是否活着 | 失败 → **重启容器** |
| **readinessProbe** 就绪探针 | 是否能接流量 | 失败 → **从 Service 摘掉**（不重启） |
| **startupProbe** 启动探针 | 是否启动完成 | 成功前，另两个探针不生效（保护慢启动应用） |

```yaml
spec:
  containers:
    - name: app
      image: myapp:1.0
      # 存活探针：HTTP 检查
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 15    # 启动后等 15 秒再开始探测
        periodSeconds: 10          # 每 10 秒探一次
        timeoutSeconds: 2
        failureThreshold: 3        # 连续失败 3 次才判定失败
      # 就绪探针：TCP 检查
      readinessProbe:
        tcpSocket:
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
      # 启动探针：保护慢启动（如 Java 应用）
      startupProbe:
        httpGet:
          path: /health
          port: 8080
        failureThreshold: 30       # 最多等 30*5=150 秒
        periodSeconds: 5
```

**三种探测方式：**

```yaml
# 1. HTTP GET（最常用，返回 2xx/3xx 视为成功）
httpGet:
  path: /health
  port: 8080
  httpHeaders:
    - name: Custom-Header
      value: test

# 2. TCP 端口（能连上就算成功）
tcpSocket:
  port: 8080

# 3. 执行命令（退出码为 0 视为成功）
exec:
  command: ["cat", "/tmp/healthy"]
```

> ⚠️ **常见坑**：`initialDelaySeconds` 设太小，应用还没启动就被判定失败 → 无限重启（CrashLoopBackOff）。Java 类应用务必配 `startupProbe` 或把延迟调大。

### 3.6 资源限制：requests 与 limits

| 字段 | 作用 | 超出后果 |
| :--- | :--- | :--- |
| `requests` | 调度依据，节点必须有这么多空闲资源才调度 | 不超（保底） |
| `limits` | 硬上限 | CPU 超限被**限流**（变慢）；内存超限被 **OOMKill**（重启） |

```yaml
resources:
  requests:
    cpu: "250m"      # 0.25 核
    memory: "256Mi"
  limits:
    cpu: "1"         # 1 核
    memory: "512Mi"
```

**CPU 单位**：`1` = 1 核，`100m` = 0.1 核（100 毫核）
**内存单位**：`128Mi`（MiB）、`1Gi`（GiB）、`1G`（十进制 GB）

> 💡 **测试价值**：故意把 `limits.memory` 设小，就能稳定复现 **OOMKilled**，验证应用内存泄漏或异常时的表现。这是 Compose 很难做的测试。

<details markdown="1">
<summary>三种 QoS 等级（了解即可）</summary>

K8s 根据 requests/limits 的组合给 Pod 划分服务质量等级，节点资源不足时按等级决定先杀谁：

| 等级 | 条件 | 被驱逐优先级 |
| :--- | :--- | :--- |
| **Guaranteed** | requests == limits（cpu 和 memory 都满足） | 最低（最后才被杀） |
| **Burstable** | 至少设了 requests，但不满足上面 | 中等 |
| **BestEffort** | 完全没设 requests/limits | 最高（最先被杀） |

生产环境的关键服务建议设成 Guaranteed。

</details>

## 四、工作负载：Deployment 等控制器

### 4.1 为什么不用裸 Pod？

裸 Pod（直接 `kind: Pod`）的问题：

*   挂了没人管，不会自动重建
*   没有副本数概念，无法扩缩容
*   更新要手动删了重建，会中断服务

**结论**：生产/测试环境一律用**工作负载控制器**管理 Pod。

### 4.2 工作负载类型对比

| 类型 | 用途 | 特点 |
| :--- | :--- | :--- |
| **Deployment** | 无状态应用（Web/API）★ | 最常用，支持滚动更新、回滚 |
| **ReplicaSet** | 副本控制器 | 一般不直接用，Deployment 自动管理 |
| **StatefulSet** | 有状态应用（MySQL/Redis/Kafka） | 固定名称、固定存储、有序启停 |
| **DaemonSet** | 每节点跑一个（日志采集/监控 agent） | 新节点加入会自动部署 |
| **Job** | 一次性任务 | 跑完就结束 |
| **CronJob** | 定时任务 | 类似 Linux crontab |

### 4.3 Deployment 实战（重点）

```yaml
# deployment-demo.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
spec:
  replicas: 3                      # 副本数
  selector:                        # 选择器：管理哪些 Pod（必须匹配 template 的 labels）
    matchLabels:
      app: web
  strategy:                        # 更新策略
    type: RollingUpdate            # RollingUpdate（默认）| Recreate
    rollingUpdate:
      maxSurge: 1                  # 更新期间最多比期望多 1 个 Pod
      maxUnavailable: 0            # 更新期间最多允许 0 个不可用（零中断）
  template:                        # Pod 模板（就是前面讲的 Pod spec）
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.25
          ports:
            - containerPort: 80
          resources:
            requests: {cpu: "100m", memory: "128Mi"}
            limits: {cpu: "500m", memory: "256Mi"}
          readinessProbe:
            httpGet: {path: /, port: 80}
            initialDelaySeconds: 5
```

```bash
kubectl apply -f deployment-demo.yaml

# 查看
kubectl get deploy
kubectl get rs                     # 自动创建的 ReplicaSet
kubectl get pods -l app=web        # 按标签筛选

# 扩缩容
kubectl scale deploy web-app --replicas=5

# 更新镜像（触发滚动更新）
kubectl set image deploy web-app web=nginx:1.26

# 查看更新状态
kubectl rollout status deploy web-app

# 查看历史版本
kubectl rollout history deploy web-app

# 回滚
kubectl rollout undo deploy web-app              # 回上一版
kubectl rollout undo deploy web-app --to-revision=2   # 回指定版本
```

### 4.4 滚动更新原理

```text
初始：v1 v1 v1 （3 副本）

滚动更新过程（maxSurge=1, maxUnavailable=0）：
  v1 v1 v1 + v2     → 新建 1 个 v2，就绪后
  v1 v1 v2          → 删掉 1 个 v1，再建 1 个 v2
  v1 v2 v2          → ...
  v2 v2 v2          → 完成，全程始终有 3 个可用

关键点：readinessProbe 决定了"新 Pod 什么时候算就绪"
       探针没配好 → 新版本不可用就被切流量 → 线上事故
```

**两种策略：**

| 策略 | 行为 | 适用 |
| :--- | :--- | :--- |
| **RollingUpdate** | 逐个替换，不中断（默认） | 绝大多数场景 |
| **Recreate** | 先全删再全建，会中断 | 不支持多版本共存的应用（如有锁/共享存储） |

### 4.5 StatefulSet（有状态应用）

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql            # 必须有一个 Headless Service
  replicas: 3
  selector:
    matchLabels: {app: mysql}
  template:
    metadata:
      labels: {app: mysql}
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:         # 每个副本自动创建独立 PVC
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

**Deployment vs StatefulSet：**

| 维度 | Deployment | StatefulSet |
| :--- | :--- | :--- |
| Pod 名称 | 随机后缀 `web-5f7d9c-x2k9p` | 固定有序 `mysql-0/1/2` |
| 存储 | 共享（通常） | 每个 Pod 独立 PVC |
| 启停顺序 | 无序 | 有序（0→1→2 启动，2→1→0 停止） |
| 网络标识 | 不稳定 | 稳定 DNS（`mysql-0.mysql.default.svc`） |
| 适用 | 无状态 Web/API | MySQL、Redis、Kafka、ZooKeeper |

### 4.6 DaemonSet 与 Job

```yaml
# DaemonSet：每个节点跑一个日志采集器
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels: {app: log-collector}
  template:
    metadata:
      labels: {app: log-collector}
    spec:
      containers:
        - name: collector
          image: fluentd:latest
```

```yaml
# Job：一次性任务（数据初始化、跑批）
apiVersion: batch/v1
kind: Job
metadata:
  name: data-init
spec:
  backoffLimit: 3               # 失败重试次数
  template:
    spec:
      restartPolicy: Never      # Job 必须设为 Never 或 OnFailure
      containers:
        - name: init
          image: myapp:1.0
          command: ["python", "init_data.py"]

---
# CronJob：定时任务
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-clean
spec:
  schedule: "0 2 * * *"         # 每天凌晨 2 点
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
            - name: clean
              image: myapp:1.0
              command: ["python", "cleanup.py"]
```

## 五、服务与网络：Service / Ingress

### 5.1 为什么需要 Service？

**问题**：Pod 随时会被销毁重建，**IP 每次都变**；而且一个应用有多个副本，客户端该访问哪个？

**解决**：Service 提供**稳定的访问入口**（固定 IP + DNS 名），并自动把流量负载均衡到后端健康的 Pod。

```text
客户端 → Service (固定: 10.96.x.x / web-app.default.svc)
              ↓ 自动负载均衡
         ┌────┼────┐
       Pod1  Pod2  Pod3   (IP 会变，由 Service 动态追踪)
```

**Service 靠 Label Selector 找 Pod**：

```yaml
spec:
  selector:
    app: web          # 选中所有带 app=web 标签的 Pod
```

> 只有 **readinessProbe 通过**的 Pod 才会被加入 Service 的后端。

### 5.2 Service 四种类型

| 类型 | 作用 | 访问方式 | 适用 |
| :--- | :--- | :--- | :--- |
| **ClusterIP** | 集群内部访问（默认） | `服务名.命名空间.svc:端口` | 微服务间调用 |
| **NodePort** | 每个节点开一个端口（30000-32767） | `节点IP:30080` | 测试环境/外部临时访问 |
| **LoadBalancer** | 云厂商负载均衡器 | 公网 IP | 公有云生产环境 |
| **ExternalName** | DNS 别名映射到外部域名 | `CNAME` | 访问集群外服务 |

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-svc
spec:
  type: ClusterIP          # 默认可省略
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80             # Service 暴露的端口
      targetPort: 8080     # Pod 内容器的端口（不写则等于 port）
```

```bash
kubectl get svc
kubectl describe svc web-svc      # 看 Endpoints（后端 Pod 列表）
kubectl get endpoints web-svc     # 快速看有没有选中 Pod
```

> ⚠️ **排查口诀**：Service 访问不通，先看 `kubectl get endpoints`。**Endpoints 为空**说明 selector 没匹配上 Pod，或 Pod 未就绪——这是最高频的问题。

### 5.3 服务发现（DNS）

集群内的每个 Service 都会自动注册一条 DNS 记录：

```text
格式：<service名>.<namespace>.svc.cluster.local

同命名空间可简写：
  curl http://web-svc:80          # 同 namespace
  curl http://web-svc.test:80     # 跨 namespace（test 命名空间）

环境变量方式（Pod 创建时注入，不推荐，Service 后建会有问题）：
  WEB_SVC_SERVICE_HOST / WEB_SVC_SERVICE_PORT
```

```bash
# 在集群内临时起一个调试 Pod 验证连通性（测试常用）
kubectl run curl-test --image=curlimages/curl -it --rm -- sh
# 进去后
curl http://web-svc
curl http://web-svc.test.svc.cluster.local
nslookup web-svc
```

### 5.4 Ingress（七层路由）

Service 是四层（TCP/UDP），**Ingress 是七层（HTTP）**：按域名、路径路由到不同 Service，相当于集群入口的 Nginx。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: nginx        # 需先安装 Ingress Controller
  rules:
    - host: test.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port: {number: 8080}
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-svc
                port: {number: 80}
```

```bash
# minikube 启用 Ingress 插件
minikube addons enable ingress
kubectl get ingress
```

**Service vs Ingress：**

| 维度 | Service | Ingress |
| :--- | :--- | :--- |
| 层级 | 四层（TCP/UDP） | 七层（HTTP/HTTPS） |
| 能力 | 负载均衡 | 域名/路径路由、HTTPS 终结、重写 |
| 依赖 | 无 | 需安装 Ingress Controller（如 ingress-nginx） |

### 5.5 网络模型要点

*   **每个 Pod 一个独立 IP**，Pod 之间可直接互通（无需 NAT）——由 CNI 插件实现（Calico、Flannel、Cilium）。
*   **Pod 内容器共享网络**，用 `localhost` 互通。
*   **Service 的 ClusterIP 是虚拟 IP**，由 kube-proxy 维护的 iptables/IPVS 规则转发。
*   K8s 1.24+ 使用 `containerd` 作为运行时，不再依赖 Docker daemon。

## 六、配置管理：ConfigMap / Secret

### 6.1 为什么要把配置拿出来？

配置写死在镜像里的问题是：改个数据库地址就要**重新构建镜像**。K8s 把配置独立成对象，实现"**一份镜像，多环境部署**"。

### 6.2 ConfigMap（明文配置）

```bash
# 命令行创建
kubectl create configmap app-config --from-literal=DB_HOST=mysql --from-literal=LOG_LEVEL=debug

# 从文件创建（整个配置文件）
kubectl create configmap nginx-conf --from-file=nginx.conf
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "mysql"
  DB_PORT: "3306"
  LOG_LEVEL: "debug"
  app.properties: |            # 多行配置（整个文件）
    server.port=8080
    spring.profiles.active=test
```

### 6.3 Secret（敏感配置）

```bash
# 创建
kubectl create secret generic db-secret \
  --from-literal=username=root \
  --from-literal=password=123456

# 从文件（如 TLS 证书）
kubectl create secret tls my-tls --cert=tls.crt --key=tls.key
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque                    # Opaque(默认) / kubernetes.io/tls / docker-registry
data:
  username: cm9vdA==            # 注意：value 必须是 base64 编码
  password: MTIzNDU2
# 也可以用 stringData 明文写，K8s 会自动编码（更方便）
stringData:
  password: "123456"
```

```bash
# base64 编解码
echo -n "123456" | base64        # MTIzNDU2
echo "MTIzNDU2" | base64 -d      # 123456
```

| Secret 类型 | 用途 |
| :--- | :--- |
| `Opaque` | 通用（默认），存用户名密码 |
| `kubernetes.io/tls` | TLS 证书（配合 Ingress 用） |
| `kubernetes.io/dockerconfigjson` | 私有镜像仓库登录凭证 |

### 6.4 三种注入方式

```yaml
spec:
  containers:
    - name: app
      image: myapp:1.0
      # 方式一：单个环境变量
      env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_HOST
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
      # 方式二：整体注入（推荐，配置项多时省事）
      envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: db-secret
      # 方式三：挂载为文件（配置文件场景）
      volumeMounts:
        - name: config-volume
          mountPath: /etc/app
  volumes:
    - name: config-volume
      configMap:
        name: app-config
```

> ⚠️ **重要坑**：
> 1. **环境变量方式不会热更新** —— 改了 ConfigMap，Pod 里的环境变量不变，必须重启 Pod。
> 2. **挂载为文件方式会自动更新**（约 1 分钟延迟），但应用要支持热加载配置才生效。
> 3. Secret 的 base64 **不是加密**，只是编码，任何能 `kubectl get secret -o yaml` 的人都能解码。生产要开启 etcd 静态加密或用 Vault。

## 七、存储：Volume / PV / PVC

### 7.1 为什么需要存储？

Pod 是短暂的，容器重启后**文件系统会被重置**。数据库、日志、上传文件必须存在 Pod 之外。

### 7.2 存储层次关系

```text
Pod → volume → PVC（申请）→ PV（实际存储）→ StorageClass（自动创建 PV）

类比：
  Pod     = 人
  PVC     = 提需求："我要 10G 硬盘"
  PV      = 实际硬盘
  StorageClass = 硬盘供应商（按需自动供货）
```

### 7.3 常用卷类型

```yaml
spec:
  containers:
    - name: app
      volumeMounts:
        - name: cache
          mountPath: /tmp/cache
        - name: data
          mountPath: /data
  volumes:
    # 1. emptyDir：临时卷，Pod 删除就没了（同 Pod 多容器共享）
    - name: cache
      emptyDir: {}

    # 2. hostPath：挂载宿主机目录（测试环境方便，生产不安全）
    - name: data
      hostPath:
        path: /data/app
        type: DirectoryOrCreate
```

```yaml
# 3. PVC：持久化卷（生产/测试推荐）
    - name: data
      persistentVolumeClaim:
        claimName: app-pvc
```

### 7.4 PV / PVC / StorageClass

```yaml
# PVC：用户申请存储
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-pvc
spec:
  accessModes:
    - ReadWriteOnce        # RWO(单节点读写) / ROX(多节点只读) / RWX(多节点读写)
  storageClassName: standard
  resources:
    requests:
      storage: 5Gi
```

```yaml
# StorageClass：动态供给，自动创建 PV
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: k8s.io/minikube-hostpath      # 不同环境不一样
reclaimPolicy: Delete                       # Delete / Retain
volumeBindingMode: Immediate
```

```bash
kubectl get pv, pvc
kubectl describe pvc app-pvc      # 卡在 Pending 就看这里的原因
```

| 访问模式 | 缩写 | 含义 |
| :--- | :--- | :--- |
| ReadWriteOnce | RWO | 单节点可读写（最常用） |
| ReadOnlyMany | ROX | 多节点只读 |
| ReadWriteMany | RWX | 多节点读写（需 NFS/分布式存储） |

## 八、命名空间与资源管理

### 8.1 Namespace（逻辑隔离）

```bash
kubectl get ns                    # 默认有 default / kube-system / kube-public / kube-node-lease
kubectl create ns test
kubectl apply -f app.yaml -n test
kubectl get pods -n test
kubectl config set-context --current --namespace=test   # 切换默认命名空间
```

> 💡 **测试价值**：给每个测试人员/每个需求分支开一个 Namespace，就能在同一套集群上跑**多套互不干扰的测试环境**，资源利用率远高于"一人一台虚拟机"。

### 8.2 资源配额

```yaml
# 限制整个 Namespace 的资源总量
apiVersion: v1
kind: ResourceQuota
metadata:
  name: test-quota
  namespace: test
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"
    services: "10"
```

```yaml
# 给未指定资源的容器设默认值
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: test
spec:
  limits:
    - type: Container
      default:
        cpu: "500m"
        memory: "512Mi"
      defaultRequest:
        cpu: "100m"
        memory: "128Mi"
```

### 8.3 Label / Selector

```bash
# 打标签
kubectl label pod web-xxx env=test version=v2
kubectl label pod web-xxx env-         # 删除标签（键后加减号）

# 筛选
kubectl get pods -l app=web
kubectl get pods -l 'env in (test,dev),version!=v1'
```

**Label vs Annotation：**

| | 用途 | 能否被 Selector 筛选 |
| :--- | :--- | :--- |
| **Label** | 标识身份，用于关联选择 | ✅ 能 |
| **Annotation** | 存附加信息（构建号、负责人、监控配置） | ❌ 不能 |

## 九、调度与运维

### 9.1 调度流程

```text
1. 过滤（Filtering）：排除不满足条件的节点
     资源够吗？端口冲突吗？有污点吗？匹配 nodeSelector 吗？
2. 打分（Scoring）：对剩余节点打分
     资源越空闲分越高、镜像已存在分越高…
3. 选中最高分节点，绑定 Pod
```

### 9.2 控制 Pod 落在哪

```yaml
spec:
  # 1. 简单：按节点标签选
  nodeSelector:
    disktype: ssd

  # 2. 亲和性（更灵活，支持软硬策略）
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:    # 硬条件，必须满足
        nodeSelectorTerms:
          - matchExpressions:
              - key: env
                operator: In
                values: [test, dev]
      preferredDuringSchedulingIgnoredDuringExecution:   # 软条件，尽量满足
        - weight: 1
          preference:
            matchExpressions:
              - key: zone
                operator: In
                values: [zone-a]
    # Pod 反亲和：让副本分散到不同节点（高可用必备）
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: app
                operator: In
                values: [web]
          topologyKey: kubernetes.io/hostname
```

### 9.3 污点与容忍

**Taint（污点）** 打在**节点**上，表示"拒绝"；**Toleration（容忍）** 写在 **Pod** 上，表示"我能接受"。

```bash
# 给节点打污点
kubectl taint nodes node1 dedicated=test:NoSchedule

# 查看
kubectl describe node node1 | grep Taint

# 删除污点
kubectl taint nodes node1 dedicated=test:NoSchedule-
```

| 效果 | 行为 |
| :--- | :--- |
| `NoSchedule` | 新 Pod 不调度上来（已有 Pod 不受影响） |
| `PreferNoSchedule` | 尽量不调度（软策略） |
| `NoExecute` | 不调度 + **驱逐已有 Pod** |

```yaml
# Pod 声明容忍
spec:
  tolerations:
    - key: "dedicated"
      operator: "Equal"
      value: "test"
      effect: "NoSchedule"
```

> 💡 Master 节点默认有 `NoSchedule` 污点，所以普通 Pod 不会调度上去——这就是"为什么我的 Pod 都不在 master 上"的原因。

### 9.4 驱逐与优雅停机

```yaml
spec:
  terminationGracePeriodSeconds: 30     # 优雅停机宽限期（默认 30 秒）
  containers:
    - name: app
      lifecycle:
        preStop:                        # 停止前执行（如先摘流量、等待处理完）
          exec:
            command: ["sh", "-c", "sleep 10"]
```

**停机流程**：收到 SIGTERM → 执行 preStop → 从 Service 摘除 → 等待处理完 → 宽限期到发 SIGKILL。

## 十、Helm：K8s 的包管理器

### 10.1 为什么需要 Helm？

一个应用往往有十几个 YAML（Deployment、Service、ConfigMap、Ingress、PVC…），改个镜像版本要改多处。**Helm 把这些打包成一个 Chart，用变量统一管理**。

| 概念 | 含义 |
| :--- | :--- |
| **Chart** | 一个应用的包（模板集合），相当于"安装包" |
| **Repository** | Chart 仓库，相当于"应用商店" |
| **Release** | Chart 的一次部署实例（同一 Chart 可部署多次） |

### 10.2 安装与常用命令

```bash
# 安装 Helm
choco install kubernetes-helm      # Windows
brew install helm                  # macOS

# 添加仓库（国内可用镜像源）
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# 搜索
helm search repo mysql

# 安装（一个 Chart 就拉起整套）
helm install my-mysql bitnami/mysql

# 查看已部署
helm list

# 升级（改配置后）
helm upgrade my-mysql bitnami/mysql --set auth.rootPassword=newpass

# 回滚
helm rollback my-mysql 1

# 卸载
helm uninstall my-mysql
```

### 10.3 测试环境一键搭建示例

```bash
# 一键起 Redis（测试依赖）
helm install redis bitnami/redis --set architecture=standalone

# 获取密码
kubectl get secret redis -o jsonpath="{.data.redis-password}" | base64 -d

# 一键起 MySQL
helm install mysql bitnami/mysql \
  --set auth.rootPassword=test123 \
  --set primary.persistence.size=5Gi
```

> 💡 相比 Docker Compose，Helm 的优势是**社区维护了上千个成熟 Chart**，MySQL 主从、Redis 哨兵、Kafka、Prometheus 都有现成的，几分钟就能拉起一套接近生产的测试环境。

## 十一、可观测性与故障排查

### 11.1 排查三板斧

```bash
# 第一斧：看状态
kubectl get pods -A -o wide

# 第二斧：看事件（90% 的问题在这里有答案）
kubectl describe pod <pod名>
# 重点看底部的 Events 区域

# 第三斧：看日志
kubectl logs <pod名> [-c 容器名] [--tail=100] [-f]
kubectl logs <pod名> --previous      # 看上一次崩溃前的日志（CrashLoopBackOff 必用）
```

### 11.2 常见故障速查表

| 状态 / 事件 | 原因 | 排查命令 |
| :--- | :--- | :--- |
| **ImagePullBackOff** | 镜像拉不到 | `kubectl describe pod` 看事件；检查镜像名/tag、仓库权限、网络 |
| **ErrImagePull** | 镜像不存在或没权限 | 确认镜像地址，私有仓库需配 `imagePullSecrets` |
| **CrashLoopBackOff** | 容器启动后立刻退出 | `kubectl logs <pod> --previous`；检查配置、依赖、启动命令 |
| **Pending** | 无法调度 | `kubectl describe pod` 看事件：资源不足 / 无匹配节点 / PVC 未绑定 |
| **OOMKilled** | 内存超 limits | 调大 `limits.memory` 或排查内存泄漏；`kubectl describe` 看 Last State |
| **CreateContainerConfigError** | 引用的 ConfigMap/Secret 不存在 | 检查 `kubectl get cm,secret` |
| **ContainerCreating** 卡住 | 存储/网络插件问题 | 看节点事件、CNI 插件状态 |
| **Evicted** | 节点资源不足被驱逐 | `kubectl describe node` 看磁盘/内存压力 |
| **Terminating** 卡住 | 优雅停机超时或 finalizer | `kubectl delete pod <pod> --force --grace-period=0` |
| Service 访问不通 | Endpoints 为空 | `kubectl get endpoints <svc>`；检查 selector 和就绪探针 |
| PVC 一直 Pending | 无可用 PV / StorageClass | `kubectl describe pvc`；检查是否有默认 SC |

### 11.3 监控与日志方案

| 组件 | 作用 |
| :--- | :--- |
| **Metrics Server** | 提供 `kubectl top` 资源指标（HPA 依赖它） |
| **Prometheus** | 时序监控，采集集群和应用指标 |
| **Grafana** | 可视化大盘 |
| **EFK / Loki** | 日志收集（Elasticsearch+Fluentd+Kibana / Grafana Loki） |
| **kube-state-metrics** | 暴露 K8s 对象状态指标 |

```bash
# 启用 metrics-server（minikube）
minikube addons enable metrics-server
kubectl top nodes
kubectl top pods -A
```

## 十二、测试视角：K8s 怎么测（重点）

### 12.1 K8s 给测试带来的能力

| 能力 | 测试价值 |
| :--- | :--- |
| 环境快速复制 | 一套 YAML 拉起完整环境，几分钟一套 |
| Namespace 隔离 | 多人并行测试互不干扰 |
| 自愈能力 | 可验证"服务挂了能不能自己恢复" |
| 弹性伸缩 | 可验证 HPA 扩容是否生效 |
| 滚动更新 | 可验证"发布期间业务是否中断" |
| 资源限制 | 可构造 OOM、CPU 限流等异常场景 |
| 故障注入 | 删 Pod、断网、杀节点，做混沌测试 |

### 12.2 测试点清单

- [ ] **部署正确性**：副本数、镜像版本、资源限制、环境变量是否正确
- [ ] **服务可用性**：Service/Ingress 能访问，返回正常
- [ ] **就绪探针**：未就绪的 Pod 不会被接入流量
- [ ] **自愈能力**：删掉 Pod 后能否自动重建
- [ ] **扩缩容**：手动 scale 与 HPA 自动扩容是否生效
- [ ] **滚动更新**：更新过程中请求不中断、无 5xx
- [ ] **回滚**：更新失败后能否快速回滚
- [ ] **配置生效**：改 ConfigMap/Secret 后应用行为是否变化
- [ ] **资源限制**：超限时是否被限流/OOMKill，表现是否符合预期
- [ ] **持久化**：Pod 重建后数据是否保留
- [ ] **节点故障**：节点宕机后 Pod 是否漂移到其他节点

### 12.3 自愈能力测试

```bash
# 1. 查看当前 Pod
kubectl get pods -l app=web -o wide

# 2. 强制删除一个 Pod
kubectl delete pod web-app-xxxxx --force --grace-period=0

# 3. 立刻观察：Deployment 会自动创建新 Pod
kubectl get pods -l app=web -w       # -w 实时观察

# 断言点：
#   □ 新 Pod 在 10 秒内被创建
#   □ 副本数最终恢复到 3
#   □ 新 Pod 就绪后能正常提供服务
```

### 12.4 滚动更新零中断测试

```bash
# 终端 1：持续请求，统计失败数
for i in $(seq 1 10000); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://web-svc/health)
  if [ "$code" != "200" ]; then echo "FAIL: $code at $i"; fi
  sleep 0.1
done

# 终端 2：执行更新
kubectl set image deploy web-app web=nginx:1.26

# 断言点：
#   □ 全程无 5xx
#   □ 无连接超时
#   □ 更新完成后所有 Pod 都是新版本
kubectl rollout status deploy web-app
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'
```

> 💡 如果滚动更新期间出现 5xx，常见原因：① 没配 `readinessProbe`，新 Pod 还没起来就接了流量；② `maxUnavailable` 设太大；③ 应用没有优雅停机（preStop）。

### 12.5 弹性伸缩（HPA）测试

```bash
# 1. 给 Deployment 设资源 requests（HPA 依赖它）
# 2. 创建 HPA：CPU 超过 50% 就扩容，2~10 个副本
kubectl autoscale deploy web-app --cpu-percent=50 --min=2 --max=10
kubectl get hpa

# 3. 加压（在集群内）
kubectl run -i --tty load-gen --rm --image=busybox --restart=Never -- \
  /bin/sh -c "while sleep 0.01; do wget -q -O- http://web-svc; done"

# 4. 观察扩容过程
kubectl get hpa -w
kubectl get pods -w

# 断言点：
#   □ CPU 超阈值后副本数增加
#   □ 最多扩到 max 个
#   □ 停止加压后，5 分钟（默认缩容稳定窗口）后缩回
```

### 12.6 异常场景测试

```bash
# 场景 1：内存溢出（构造 OOMKilled）
kubectl set resources deploy web-app --limits=memory=50Mi
kubectl get pods -w      # 观察是否出现 OOMKilled、重启次数增加

# 场景 2：配置错误（验证应用容错）
kubectl edit cm app-config     # 把 DB_HOST 改成一个不存在的地址
kubectl rollout restart deploy web-app
kubectl logs -l app=web        # 看是否有清晰的错误日志和重试机制

# 场景 3：依赖服务不可用
kubectl scale deploy mysql --replicas=0      # 停掉依赖
# 观察被测应用是否降级/熔断/友好提示，而不是崩溃

# 场景 4：节点故障模拟
kubectl drain <node名> --ignore-daemonsets --delete-emptydir-data
# 观察 Pod 是否漂移到其他节点
kubectl uncordon <node名>      # 恢复
```

### 12.7 Python 封装示例（可复用）

```python
# k8s_helper.py
import subprocess
import json


def kubectl(args: list, check: bool = True) -> str:
    """执行 kubectl 命令并返回 stdout"""
    result = subprocess.run(
        ["kubectl", *args], capture_output=True, text=True, encoding="utf-8"
    )
    if check and result.returncode != 0:
        raise RuntimeError(f"kubectl {' '.join(args)} 失败：{result.stderr}")
    return result.stdout.strip()


def get_pods(namespace: str = "default", label: str = None) -> list:
    """获取 Pod 列表"""
    args = ["get", "pods", "-n", namespace, "-o", "json"]
    if label:
        args += ["-l", label]
    data = json.loads(kubectl(args))
    return [
        {
            "name": item["metadata"]["name"],
            "phase": item["status"]["phase"],
            "ready": all(
                c.get("ready", False) for c in item["status"].get("containerStatuses", [])
            ),
            "restarts": sum(
                c.get("restartCount", 0) for c in item["status"].get("containerStatuses", [])
            ),
        }
        for item in data["items"]
    ]


def wait_ready(deploy: str, namespace: str = "default", timeout: int = 300) -> bool:
    """等待 Deployment 就绪"""
    kubectl([
        "rollout", "status", f"deploy/{deploy}",
        "-n", namespace, f"--timeout={timeout}s",
    ])
    return True


# ---------------- 测试示例 ----------------
def test_deployment_ready():
    """验证部署就绪且副本数正确"""
    wait_ready("web-app", "test")
    pods = get_pods("test", "app=web")
    assert len(pods) == 3, f"期望 3 个副本，实际 {len(pods)}"
    assert all(p["ready"] for p in pods), f"存在未就绪 Pod：{pods}"
    print("部署验证通过：", pods)


def test_self_healing():
    """验证自愈：删掉 Pod 后能自动恢复"""
    before = get_pods("test", "app=web")
    victim = before[0]["name"]

    kubectl(["delete", "pod", victim, "-n", "test", "--wait=false"])
    wait_ready("web-app", "test")

    after = get_pods("test", "app=web")
    assert len(after) == len(before), "副本数未恢复"
    assert all(p["ready"] for p in after), "恢复后仍有未就绪 Pod"
    print(f"自愈验证通过：{victim} 已被重建")


def test_no_crashloop():
    """验证没有崩溃循环"""
    pods = get_pods("test", "app=web")
    for p in pods:
        assert p["restarts"] < 3, f"{p['name']} 重启次数异常：{p['restarts']}"
    print("无 CrashLoopBackOff")
```

```python
# test_k8s_deploy.py（配合 pytest）
import pytest
from k8s_helper import test_deployment_ready, test_self_healing, test_no_crashloop

NS = "test"

def test_deploy():
    test_deployment_ready()

def test_healing():
    test_self_healing()

def test_stability():
    test_no_crashloop()
```

### 12.8 测试 K8s 应用的常见坑

| 坑 | 说明 |
| :--- | :--- |
| 探针没配或配错 | 导致更新期间 502、或假死容器不重启 |
| 用 `latest` 标签 | 无法判断跑的是哪个版本，回滚也困难 |
| 没设 `resources` | 一个 Pod 吃光节点资源，引发连锁驱逐 |
| ConfigMap 改了以为生效 | 环境变量方式必须重启 Pod |
| `kubectl port-forward` 断了 | 它是前台进程，终端关掉就没了，别拿它做长期访问 |
| 在 Pod 里改文件验证 | Pod 重建后全部丢失，必须改镜像或 ConfigMap |
| 忽略 Events | 90% 的问题答案都在 `kubectl describe` 的 Events 里 |

## 十三、kubectl 命令速查

```bash
# ---------- 查看 ----------
kubectl get pods|svc|deploy|nodes|ns [-A] [-o wide|yaml|json]
kubectl describe <type> <name>              # 详情 + 事件（排查首选）
kubectl explain <type>.<field>              # 查字段含义
kubectl api-resources                       # 所有资源类型

# ---------- 创建/更新 ----------
kubectl apply -f xxx.yaml                   # 声明式创建/更新（推荐）
kubectl create -f xxx.yaml                  # 命令式（已存在会报错）
kubectl create deploy <name> --image=<img>  # 快速创建
kubectl edit <type> <name>                  # 在线编辑
kubectl scale deploy <name> --replicas=N    # 扩缩容
kubectl set image deploy <name> c=img:v2    # 更新镜像

# ---------- 删除 ----------
kubectl delete -f xxx.yaml
kubectl delete pod <name> [--force --grace-period=0]
kubectl delete pods -l app=web              # 按标签批量删

# ---------- 调试 ----------
kubectl logs <pod> [-c <container>] [-f] [--tail=N] [--previous]
kubectl exec -it <pod> [-- <command>]       # -- /bin/sh
kubectl port-forward <pod|svc/name> 8080:80
kubectl cp <pod>:/path ./local              # 拷文件
kubectl run debug -it --rm --image=busybox -- sh   # 临时调试 Pod

# ---------- 发布 ----------
kubectl rollout status|history|undo deploy/<name>
kubectl rollout restart deploy/<name>       # 重启（改配置后常用）

# ---------- 集群 ----------
kubectl top nodes|pods                      # 资源占用
kubectl get events --sort-by=.lastTimestamp # 集群事件（排查利器）
kubectl config get-contexts                 # 多集群切换
kubectl config use-context <name>
```

## 十四、学习资源

| 资源 | 说明 |
| :--- | :--- |
| [Kubernetes 官方文档](https://kubernetes.io/zh-cn/docs/home/) | 权威，有中文版 |
| [kubectl 命令备忘单](https://kubernetes.io/zh-cn/docs/reference/kubectl/cheatsheet/) | 速查必备 |
| [Minikube 文档](https://minikube.sigs.k8s.io/docs/) | 本地环境搭建 |
| [Kind 文档](https://kind.sigs.k8s.io/) | CI 环境搭建 |
| [Helm 官方文档](https://helm.sh/zh/docs/) | 包管理 |
| [Play with Kubernetes](https://labs.play-with-k8s.com/) | 在线免费实验环境 |
| [Katacoda / Killercoda](https://killercoda.com/) | 交互式 K8s 场景练习 |
| 《Kubernetes in Action》 | 系统学习书籍 |
| [Artifact Hub](https://artifacthub.io/) | Helm Chart 仓库搜索 |
