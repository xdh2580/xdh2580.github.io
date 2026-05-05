---
title: "Spring Boot相关"
categories:
  - SpringBoot
tags:
  - SpringBoot
toc: true
order: 3
---
# Spring Boot 框架 完整系统学习大纲

---

## 一、Spring Boot 概述
### 1.1 Spring Boot 简介
**Spring Boot** 是一个基于 Spring 框架的快速开发框架，旨在简化 Spring 应用的初始搭建和开发过程。它通过提供默认配置、开箱即用的特性，让开发者能够快速创建独立运行的、生产级别的 Spring 应用程序，而无需进行繁琐的 XML 配置。

### 1.2 Spring Boot 核心特性
*   **自动配置**：根据项目依赖自动配置 Spring 应用
*   **起步依赖**：提供预配置的依赖管理，简化构建配置
*   **内嵌容器**：内置 Tomcat、Jetty 或 Undertow 服务器
*   **生产就绪**：提供健康检查、指标监控等生产级功能
*   **无需 XML 配置**：基于 Java 配置和约定优于配置原则
*   **命令行接口**：提供 Spring Boot CLI 工具
*   **丰富的功能**：集成数据访问、安全、消息、批处理等

### 1.3 Spring Boot 与 Spring 的关系
*   **Spring Framework**：基础框架，提供核心功能（IoC、AOP、事务等）
*   **Spring Boot**：基于 Spring Framework 的快速开发框架
*   **关系**：Spring Boot 不是 Spring 的替代品，而是简化 Spring 应用开发的工具

| 特性 | Spring Framework | Spring Boot |
|------|-----------------|-------------|
| 配置方式 | XML 或 Java Config | 自动配置，最小化配置 |
| 服务器 | 需要外部服务器 | 内置服务器 |
| 依赖管理 | 手动管理依赖 | 起步依赖自动管理 |
| 部署 | 需要打包为 WAR 部署 | 可执行 JAR，独立运行 |
| 开发速度 | 较慢，配置繁琐 | 快速，开箱即用 |
| 学习曲线 | 较陡峭 | 相对平缓 |

### 1.4 Spring Boot 版本发展
*   **2013年**：Spring Boot 开始开发
*   **2014年4月**：Spring Boot 1.0 发布
*   **2018年3月**：Spring Boot 2.0 发布（重大更新）
*   **2022年11月**：Spring Boot 3.0 发布（基于 Spring 6，Java 17+）
*   **最新版本**：Spring Boot 3.x 系列，支持 Java 17+ 和 Jakarta EE 9+

### 1.5 Spring Boot 生态系统
*   **核心框架**：Spring Boot
*   **数据访问**：Spring Data JPA、MyBatis、JDBC
*   **安全控制**：Spring Security
*   **微服务**：Spring Cloud
*   **消息队列**：Spring AMQP、Spring Kafka
*   **批处理**：Spring Batch
*   **集成工具**：Spring Integration
*   **测试框架**：Spring Boot Test
*   **监控管理**：Spring Boot Actuator
*   **开发工具**：Spring Boot DevTools

### 1.6 Spring Boot 3 新特性
*   **Java 17+ 支持**：最低要求 Java 17
*   **Jakarta EE 9+**：从 javax 迁移到 jakarta 命名空间
*   **记录（Records）支持**：更好的 DTO 支持
*   **GraalVM 原生镜像**：改进的原生编译支持
*   **问题详情（ProblemDetail）**：标准化的错误响应
*   **HTTP 接口客户端**：声明式 HTTP 客户端
*   **可观测性**：集成了 Micrometer 和 Micrometer Tracing
*   **改进的 AOT 处理**：更好的提前编译支持

---

## 二、快速开始
### 2.1 系统要求
*   **Java**：JDK 17 或更高版本（Spring Boot 3.x）
*   **构建工具**：Maven 3.5+ 或 Gradle 7.x+
*   **开发工具**：IDEA、Eclipse、VS Code
*   **Spring Boot 版本**：3.0.0+

### 2.2 创建第一个 Spring Boot 应用
* **2.2.1 使用 Spring Initializr**
    Spring Initializr 是创建 Spring Boot 项目的最简单方式，提供 Web 界面和多种构建工具支持。

    访问地址：[https://start.spring.io](https://start.spring.io)

    创建步骤：
    1. 选择构建工具（Maven/Gradle）
    2. 选择语言（Java/Kotlin/Groovy）
    3. 选择 Spring Boot 版本
    4. 填写项目元数据
    5. 添加依赖
    6. 生成项目

* **2.2.2 使用命令行**

    ```bash
    # 使用 curl
    curl https://start.spring.io/starter.zip -d dependencies=web,data-jpa \
    -d type=maven-project -d javaVersion=17 -d groupId=com.example \
    -d artifactId=demo -o demo.zip

    # 使用 HTTPie
    http https://start.spring.io/starter.zip dependencies==web,data-jpa \
    type==maven-project javaVersion==17 groupId==com.example \
    artifactId==demo -o demo.zip
    ```

* **2.2.3 手动创建项目结构**
    ```
    demo/
    ├── src/
    │ ├── main/
    │ │ ├── java/
    │ │ │ └── com/
    │ │ │ └── example/
    │ │ │ └── demo/
    │ │ │ └── DemoApplication.java
    │ │ └── resources/
    │ │ ├── application.properties
    │ │ └── static/
    │ │ └── templates/
    │ └── test/
    │ └── java/
    │ └── com/
    │ └── example/
    │ └── demo/
    │ └── DemoApplicationTests.java
    ├── pom.xml
    └── README.md
    ```

### 2.3 第一个 Spring Boot 应用代码

```java
// DemoApplication.java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

@RestController
class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```


```properties
# application.properties
server.port=8080
spring.application.name=demo
```

### 2.4 运行应用
#### 2.4.1 使用 IDE 运行
1. 在 IDEA 中直接运行 main 方法
2. 在 Eclipse 中作为 Spring Boot 应用运行

#### 2.4.2 使用命令行运行

```bash
# 使用 Maven
mvn spring-boot:run

# 使用 Gradle
gradle bootRun

# 打包后运行
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### 2.5 访问应用
打开浏览器，访问 [http://localhost:8080/hello](http://localhost:8080/hello)，将会看到 "Hello, Spring Boot!" 响应。

---

## 三、核心概念
### 3.1 自动配置（Auto-configuration）
**自动配置**是 Spring Boot 的核心特性之一，它根据项目类路径中的依赖自动配置 Spring 应用程序。其工作原理如下：

1. **条件注解**：基于条件判断是否启用配置
2. **自动配置类**：在 `spring-boot-autoconfigure` 包中定义
3. **spring.factories**：列出所有自动配置类
4. **@EnableAutoConfiguration**：启用自动配置

**条件注解示例**：

```java
@Configuration
@ConditionalOnClass(DataSource.class)  // 当 DataSource 类存在时
@ConditionalOnProperty(name = "spring.datasource.url")  // 当配置了数据源 URL 时
@AutoConfigureAfter(DataSourceAutoConfiguration.class)  // 在数据源自动配置后执行
public class MyAutoConfiguration {
    // 自动配置 Bean
}
```

**常用条件注解**：

| 注解 | 描述 |
|------|------|
| @ConditionalOnClass | 当类路径中存在指定类时生效 |
| @ConditionalOnMissingClass | 当类路径中不存在指定类时生效 |
| @ConditionalOnBean | 当容器中存在指定 Bean 时生效 |
| @ConditionalOnMissingBean | 当容器中不存在指定 Bean 时生效 |
| @ConditionalOnProperty | 当配置属性满足条件时生效 |
| @ConditionalOnResource | 当资源文件存在时生效 |
| @ConditionalOnWebApplication | 当是 Web 应用时生效 |
| @ConditionalOnNotWebApplication | 当不是 Web 应用时生效 |
| @ConditionalOnExpression | 当 SpEL 表达式为 true 时生效 |
| @ConditionalOnJava | 当 Java 版本满足条件时生效 |

### 3.2 起步依赖（Starters）
**起步依赖**是预定义的依赖描述符，它包含了一组相关的依赖，简化了项目的依赖管理。

**常用起步依赖**：

| Starter | 描述 |
|---------|------|
| spring-boot-starter-web | Web 应用开发 |
| spring-boot-starter-data-jpa | JPA 数据访问 |
| spring-boot-starter-security | 安全框架 |
| spring-boot-starter-test | 测试框架 |
| spring-boot-starter-actuator | 应用监控 |
| spring-boot-starter-thymeleaf | Thymeleaf 模板引擎 |
| spring-boot-starter-aop | AOP 支持 |
| spring-boot-starter-cache | 缓存支持 |
| spring-boot-starter-validation | 数据校验 |
| spring-boot-starter-amqp | RabbitMQ 消息队列 |

**起步依赖的优势**：
1. 提供功能相关的依赖集合
2. 解决依赖版本冲突
3. 自动传递依赖管理
4. 简化构建配置

### 3.3 外部化配置
Spring Boot 支持多种外部化配置方式，优先级从高到低：

1. **命令行参数**：`java -jar app.jar --server.port=8081`
2. **系统属性**：`-Dspring.profiles.active=dev`
3. **环境变量**：`SPRING_PROFILES_ACTIVE=dev`
4. **配置文件**：`application-{profile}.properties/yml`
5. **默认配置**：`application.properties/yml`

**配置文件示例**：

```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api
    
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    
myapp:
  feature:
    enabled: true
    max-size: 100
```

**@ConfigurationProperties 使用**：

```java
@Component
@ConfigurationProperties(prefix = "myapp.feature")
public class FeatureProperties {
    private boolean enabled = false;
    private int maxSize = 50;
    
    // getter 和 setter
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    
    public int getMaxSize() { return maxSize; }
    public void setMaxSize(int maxSize) { this.maxSize = maxSize; }
}
```

### 3.4 启动过程分析
Spring Boot 应用的启动过程可以分为以下几个阶段：

1. **启动类执行**：调用 `SpringApplication.run()`
2. **创建应用上下文**：根据应用类型创建合适的 ApplicationContext
3. **准备环境**：加载配置文件、命令行参数、环境变量
4. **创建 Bean 工厂**：创建 BeanDefinitionRegistry
5. **执行 Runner**：执行 ApplicationRunner 和 CommandLineRunner
6. **启动内嵌服务器**：启动 Tomcat/Jetty/Undertow
7. **发布事件**：发布 ApplicationReadyEvent 事件

**启动过程关键源码**：

```java
public class SpringApplication {
    public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
        return run(new Class<?>[]{primarySource}, args);
    }
    
    public static ConfigurableApplicationContext run(Class<?>[] primarySources, String... args) {
        return new SpringApplication(primarySources).run(args);
    }
    
    public ConfigurableApplicationContext run(String... args) {
        // 1. 创建并启动计时器
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        
        // 2. 创建引导上下文
        DefaultBootstrapContext bootstrapContext = createBootstrapContext();
        
        // 3. 创建并准备应用上下文
        ConfigurableApplicationContext context = createApplicationContext();
        context.setApplicationStartup(this.applicationStartup);
        prepareContext(context, bootstrapContext, this.applicationArguments);
        
        // 4. 刷新上下文
        refreshContext(context);
        
        // 5. 启动完成
        afterRefresh(context, this.applicationArguments);
        stopWatch.stop();
        
        return context;
    }
}
```

### 3.5 应用事件
Spring Boot 在启动和关闭过程中会发布一系列事件，开发者可以监听这些事件执行特定操作。

**生命周期事件**（按发布顺序）：

| 事件 | 描述 |
|------|------|
| ApplicationStartingEvent | 应用启动时立即发布 |
| ApplicationEnvironmentPreparedEvent | 环境准备好时发布 |
| ApplicationContextInitializedEvent | 应用上下文初始化完成时发布 |
| ApplicationPreparedEvent | 应用准备完成，Bean 定义加载完成时发布 |
| ApplicationStartedEvent | 应用启动完成时发布 |
| ApplicationReadyEvent | 应用完全就绪，可以处理请求时发布 |
| ApplicationFailedEvent | 应用启动失败时发布 |

**监听事件示例**：

```java
@Component
public class MyApplicationListener implements ApplicationListener<ApplicationReadyEvent> {
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        System.out.println("应用启动完成，可以处理请求");
    }
}

// 或使用注解方式
@Component
public class MyApplicationEventListener {
    @EventListener
    public void handleApplicationReady(ApplicationReadyEvent event) {
        System.out.println("应用启动完成");
    }
}
```

---

## 四、核心配置
### 4.1 配置文件
Spring Boot 支持多种配置文件格式，主要有 properties 和 yaml 两种。

**配置文件对比**：

| 特性 | Properties 格式 | YAML 格式 |
|------|----------------|-----------|
| 格式 | 键值对 | 层次结构 |
| 可读性 | 一般 | 较好 |
| 复杂配置 | 繁琐 | 简洁 |
| 多环境 | 需要多个文件 | 支持文档分隔符 |
| 特殊字符 | 需要转义 | 支持多种格式 |
| 数组/列表 | 使用逗号分隔 | 使用短横线表示 |

**YAML 配置示例**：

```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api
  tomcat:
    max-threads: 200
    connection-timeout: 5000

# 数据源配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      connection-timeout: 30000
      maximum-pool-size: 20
      minimum-idle: 5

# JPA 配置
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true

# 日志配置
logging:
  level:
    com.example.demo: DEBUG
    org.springframework: INFO
  file:
    name: logs/app.log
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
```

### 4.2 多环境配置
Spring Boot 支持多环境配置，通过 profiles 实现。

**创建不同环境的配置文件**：
```
resources/
├── application.yml # 主配置文件
├── application-dev.yml # 开发环境
├── application-test.yml # 测试环境
└── application-prod.yml # 生产环境
```
**配置文件内容**：

```yaml
# application.yml
spring:
  profiles:
    active: @activatedProperties@  # 使用 Maven/Gradle 变量
    
myapp:
  name: demo-app
  version: 1.0.0
```


```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  h2:
    console:
      enabled: true
      
logging:
  level:
    root: DEBUG
```


```yaml
# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/mydb
    username: prod_user
    password: ${DB_PASSWORD:defaultPassword}
  jpa:
    hibernate:
      ddl-auto: validate
      
server:
  port: 8080
  compression:
    enabled: true
    
logging:
  file:
    name: /var/log/app/app.log
  level:
    root: WARN
```

**激活 Profile 的方式**：
1. **配置文件指定**：`spring.profiles.active=dev`
2. **命令行参数**：`java -jar app.jar --spring.profiles.active=dev`
3. **环境变量**：`SPRING_PROFILES_ACTIVE=dev`
4. **虚拟机参数**：`-Dspring.profiles.active=dev`
5. **测试注解**：`@ActiveProfiles("test")`

**Profile 分组**：

```yaml
spring:
  profiles:
    active: production,audit
    group:
      production: db,mq,cache
      development: db,debug
      
# 当激活 production 时，会自动激活 db、mq、cache
```

### 4.3 自定义配置
**@Value 注解**：

```java
@Component
public class MyComponent {
    @Value("${myapp.name:defaultName}")
    private String appName;
    
    @Value("${myapp.timeout:30}")
    private int timeout;
    
    @Value("#{${myapp.map}}")
    private Map<String, String> map;
    
    @Value("classpath:data.json")
    private Resource dataFile;
    
    @Value("${server.port}")
    private String serverPort;
}
```

**@ConfigurationProperties 注解**：

```java
@Component
@ConfigurationProperties(prefix = "myapp.config")
@Validated
public class AppConfig {
    @NotNull
    @NotEmpty
    private String name;
    
    @Min(1)
    @Max(100)
    private int maxSize;
    
    private List<String> allowedHosts = new ArrayList<>();
    
    private Map<String, String> settings = new HashMap<>();
    
    private NestedConfig nested = new NestedConfig();
    
    // 静态内部类
    public static class NestedConfig {
        private boolean enabled;
        private String path;
        
        // getter 和 setter
    }
    
    // getter 和 setter
}
```

**配置属性元数据**：

```json
// META-INF/spring-configuration-metadata.json
{
  "properties": [
    {
      "name": "myapp.config.name",
      "type": "java.lang.String",
      "description": "应用程序名称",
      "sourceType": "com.example.demo.config.AppConfig"
    },
    {
      "name": "myapp.config.max-size",
      "type": "java.lang.Integer",
      "description": "最大尺寸",
      "sourceType": "com.example.demo.config.AppConfig",
      "defaultValue": 50
    }
  ]
}
```

### 4.4 配置加密
**Jasypt 加密配置**：
1. 添加依赖

    ```xml
    <dependency>
        <groupId>com.github.ulisesbocchio</groupId>
        <artifactId>jasypt-spring-boot-starter</artifactId>
        <version>3.0.5</version>
    </dependency>
    ```

2. 配置加密

    ```yaml
    # application.yml
    jasypt:
    encryptor:
        password: ${JASYPT_PASSWORD:mySecretKey}  # 从环境变量获取密钥
        
    spring:
    datasource:
        password: ENC(加密后的密码)
    ```

3. 加密工具类

    ```java
    import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

    public class JasyptUtil {
        public static void main(String[] args) {
            StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
            encryptor.setPassword("mySecretKey");
            
            String encrypted = encryptor.encrypt("myPassword");
            System.out.println("加密: " + encrypted);
            
            String decrypted = encryptor.decrypt(encrypted);
            System.out.println("解密: " + decrypted);
        }
    }
    ```

### 4.5 配置验证
**配置属性验证**：

```java
@Component
@ConfigurationProperties(prefix = "myapp")
@Validated
public class AppProperties {
    
    @NotNull
    @NotEmpty
    private String name;
    
    @Min(1)
    @Max(65535)
    private int port;
    
    @Pattern(regexp = "^https?://.*")
    private String url;
    
    @Valid
    private Security security = new Security();
    
    public static class Security {
        @NotEmpty
        private String username;
        
        @Size(min = 8, max = 20)
        private String password;
        
        // getter 和 setter
    }
    
    // getter 和 setter
}
```

**自定义验证器**：

```java
@Component
@ConfigurationProperties(prefix = "myapp")
@Validated
public class CustomValidatedProperties {
    
    @ValidEndpoint
    private String endpoint;
    
    // 自定义验证注解
    @Target({ ElementType.FIELD })
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = EndpointValidator.class)
    public @interface ValidEndpoint {
        String message() default "Invalid endpoint";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }
    
    // 验证器实现
    public static class EndpointValidator implements ConstraintValidator<ValidEndpoint, String> {
        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            return value != null && (value.startsWith("http://") || value.startsWith("https://"));
        }
    }
}
```

---

## 五、Web 开发
### 5.1 Spring MVC
**Spring MVC 架构**：

```
客户端请求 → DispatcherServlet → HandlerMapping → Controller → 视图解析器 → 视图渲染 → 响应
```

**基本控制器**：

```java
@RestController
@RequestMapping("/api")
public class UserController {
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@Valid @RequestBody User user) {
        return userService.save(user);
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, 
                                         @Valid @RequestBody User user) {
        if (!userService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        user.setId(id);
        return ResponseEntity.ok(userService.save(user));
    }
    
    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }
}
```

**请求映射注解**：

| 注解 | HTTP 方法 | 描述 |
|------|-----------|------|
| @GetMapping | GET | 获取资源 |
| @PostMapping | POST | 创建资源 |
| @PutMapping | PUT | 更新资源 |
| @DeleteMapping | DELETE | 删除资源 |
| @PatchMapping | PATCH | 部分更新资源 |
| @RequestMapping | 任意 | 通用映射 |

**方法参数注解**：

| 注解 | 描述 |
|------|------|
| @PathVariable | 获取 URL 路径变量 |
| @RequestParam | 获取查询参数 |
| @RequestBody | 获取请求体（JSON/XML） |
| @RequestHeader | 获取请求头 |
| @CookieValue | 获取 Cookie 值 |
| @ModelAttribute | 获取模型属性 |
| @RequestPart | 获取文件上传部分 |
| @MatrixVariable | 获取矩阵变量 |

**响应处理**：

```java
@RestController
public class ResponseController {
    
    // 返回对象（自动转为 JSON）
    @GetMapping("/user")
    public User getUser() {
        return new User(1L, "张三", "zhangsan@example.com");
    }
    
    // 返回 ResponseEntity
    @GetMapping("/custom")
    public ResponseEntity<Map<String, Object>> customResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", new User(1L, "张三", "zhangsan@example.com"));
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok()
                .header("X-Custom-Header", "value")
                .body(response);
    }
    
    // 返回 ResponseEntity 带状态码
    @GetMapping("/notfound")
    public ResponseEntity<User> notFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .header("X-Reason", "user-not-found")
                .build();
    }
    
    // 返回 Stream
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<User> streamUsers() {
        return Flux.interval(Duration.ofSeconds(1))
                .map(i -> new User(i, "User" + i, "user" + i + "@example.com"));
    }
}
```

### 5.2 REST API 设计
**RESTful API 最佳实践**：

1. **资源命名**
   - 使用名词复数形式：`/users` 而不是 `/getUsers`
   - 层级关系：`/users/{userId}/orders`
   - 避免动词：使用 HTTP 方法表示操作

2. **HTTP 方法使用**
   - GET：获取资源
   - POST：创建资源
   - PUT：更新整个资源
   - PATCH：部分更新资源
   - DELETE：删除资源

3. **状态码使用**
   - 200：请求成功
   - 201：创建成功
   - 204：无内容
   - 400：请求错误
   - 401：未认证
   - 403：无权限
   - 404：资源不存在
   - 500：服务器错误

4. **版本控制**
   - URL 路径：`/api/v1/users`
   - 请求头：`Accept: application/vnd.company.app-v1+json`

5. **分页、排序、过滤**
   - 分页：`?page=1&size=20`
   - 排序：`?sort=name,desc&sort=age,asc`
   - 过滤：`?name=张三&age_gt=18`

**分页实现**：

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("id")));
        Page<User> userPage = userService.findAll(pageable);
        
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(userPage.getTotalElements()))
                .header("X-Total-Pages", String.valueOf(userPage.getTotalPages()))
                .body(userPage);
    }
}
```

**全局异常处理**：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error("Not Found")
                .message(ex.getMessage())
                .path(((ServletWebRequest) request).getRequest().getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {
        
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Failed")
                .message("输入验证失败")
                .errors(errors)
                .build();
        
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message(ex.getMessage())
                .path(((ServletWebRequest) request).getRequest().getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

**统一响应格式**：

```java
public class ApiResponse<T> {
    private boolean success;
    private String code;
    private String message;
    private T data;
    private Long timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "200", "成功", data, System.currentTimeMillis());
    }
    
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, code, message, null, System.currentTimeMillis());
    }
    
    // 构造方法、getter、setter
}
```

### 5.3 静态资源处理
**静态资源配置**：

```yaml
# application.yml
spring:
  web:
    resources:
      static-locations: classpath:/static/,classpath:/public/,file:./uploads/
      cache:
        period: 3600
        cachecontrol:
          max-age: 3600
          must-revalidate: true
          
  mvc:
    static-path-pattern: /static/**
```

**自定义资源处理器**：

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 处理 /uploads/** 映射到文件系统
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
        
        // 处理 /static/** 映射到 classpath
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
    }
    
    // 欢迎页面
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/login").setViewName("login");
    }
}
```

### 5.4 文件上传下载
**文件上传**：

```java
@RestController
@RequestMapping("/api/files")
public class FileController {
    
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("文件不能为空");
        }
        
        try {
            // 保存文件
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads").resolve(filename);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // 保存文件信息到数据库
            FileInfo fileInfo = new FileInfo();
            fileInfo.setFilename(filename);
            fileInfo.setOriginalFilename(file.getOriginalFilename());
            fileInfo.setContentType(file.getContentType());
            fileInfo.setSize(file.getSize());
            fileInfo.setDescription(description);
            fileRepository.save(fileInfo);
            
            return ResponseEntity.ok("文件上传成功: " + filename);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("文件上传失败: " + e.getMessage());
        }
    }
    
    // 多文件上传
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<String>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files) {
        
        List<String> filenames = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String filename = saveFile(file);
                filenames.add(filename);
            }
        }
        
        return ResponseEntity.ok(filenames);
    }
}
```

**文件下载**：

```java
@GetMapping("/download/{filename:.+}")
public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
    try {
        Path filePath = Paths.get("uploads").resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
```

**文件配置**：

```yaml
# application.yml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB
      max-request-size: 100MB
      file-size-threshold: 2KB
      location: ${java.io.tmpdir}
      
  web:
    resources:
      static-locations: file:uploads/
```

### 5.5 跨域处理
**全局跨域配置**：

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:3000", "https://*.example.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "X-Total-Count")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**方法级跨域配置**：

```java
@RestController
@RequestMapping("/api")
public class UserController {
    
    @CrossOrigin(
        origins = "http://localhost:3000",
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = "*",
        maxAge = 3600
    )
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }
}
```

**Filter 方式跨域**：

```java
@Component
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "authorization, content-type, xsrf-token");
        response.setHeader("Access-Control-Expose-Headers", "xsrf-token");
        
        if ("OPTIONS".equals(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
}
```

---

## 六、数据访问
### 6.1 Spring Data JPA
**JPA 核心概念**：
*   **实体（Entity）**：映射数据库表的 Java 类
*   **实体管理器（EntityManager）**：管理实体生命周期的接口
*   **持久化上下文（Persistence Context）**：实体实例的集合
*   **仓库（Repository）**：数据访问的抽象接口
*   **查询（Query）**：通过 JPQL 或原生 SQL 查询数据

**实体定义**：

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "email", nullable = false, unique = true)
    @Email
    private String email;
    
    @Column(name = "phone")
    @Pattern(regexp = "^1[3-9]\\d{9}$")
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // 一对一关系
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile profile;
    
    // 一对多关系
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Order> orders = new ArrayList<>();
    
    // 多对多关系
    @ManyToMany
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    // 枚举类型
    public enum UserStatus {
        ACTIVE, INACTIVE, LOCKED, DELETED
    }
}
```

**仓库接口**：

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long>,
                                        JpaSpecificationExecutor<User>,
                                        QuerydslPredicateExecutor<User> {
    
    // 方法名查询
    List<User> findByUsername(String username);
    List<User> findByEmailContaining(String email);
    List<User> findByStatusOrderByCreatedAtDesc(UserStatus status);
    
    // 分页查询
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    
    // @Query 注解查询
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    // 原生 SQL 查询
    @Query(value = "SELECT * FROM users WHERE created_at > :date", nativeQuery = true)
    List<User> findUsersAfterDate(@Param("date") LocalDateTime date);
    
    // 修改查询
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    @Transactional
    int updateStatus(@Param("id") Long id, @Param("status") UserStatus status);
    
    // 投影查询
    @Query("SELECT u.username as username, u.email as email FROM User u")
    List<UserProjection> findUserProjections();
    
    // 实体图
    @EntityGraph(attributePaths = {"roles", "profile"})
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdWithDetails(@Param("id") Long id);
}
```

**服务层实现**：

```java
@Service
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Page<User> getUsers(UserQuery query, Pageable pageable) {
        Specification<User> spec = Specification.where(null);
        
        if (query.getUsername() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.like(root.get("username"), "%" + query.getUsername() + "%"));
        }
        
        if (query.getStatus() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), query.getStatus()));
        }
        
        if (query.getStartDate() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.greaterThanOrEqualTo(root.get("createdAt"), query.getStartDate()));
        }
        
        return userRepository.findAll(spec, pageable);
    }
    
    @Transactional
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("邮箱已存在");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .status(UserStatus.ACTIVE)
                .build();
        
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
        
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
    }
    
    // 批量操作
    @Transactional
    public int batchUpdateStatus(List<Long> ids, UserStatus status) {
        return userRepository.batchUpdateStatus(ids, status);
    }
}
```

**JPA 配置**：

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
  
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
    show-sql: true
    open-in-view: false
    
  # 多数据源配置
  datasource:
    primary:
      url: jdbc:mysql://localhost:3306/primary
      username: root
      password: 123456
    secondary:
      url: jdbc:mysql://localhost:3306/secondary
      username: root
      password: 123456
```

**多数据源配置**：

```java
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "com.example.primary",
    entityManagerFactoryRef = "primaryEntityManagerFactory",
    transactionManagerRef = "primaryTransactionManager"
)
public class PrimaryDataSourceConfig {
    
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(primaryDataSource())
                .packages("com.example.primary")
                .persistenceUnit("primary")
                .build();
    }
    
    @Bean
    @Primary
    public PlatformTransactionManager primaryTransactionManager(
            @Qualifier("primaryEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
```

### 6.2 Spring Data JDBC
**JDBC 配置**：

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jdbc:
    template:
      fetch-size: 100
      max-rows: 1000
      query-timeout: 30
```

**JdbcTemplate 使用**：

```java
@Repository
public class UserJdbcRepository {
    
    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    
    public UserJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
    }
    
    public List<User> findAll() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }
    
    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, new UserRowMapper(), id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
    
    public int create(User user) {
        String sql = "INSERT INTO users(username, email, password) VALUES(?, ?, ?)";
        return jdbcTemplate.update(sql, 
            user.getUsername(), 
            user.getEmail(), 
            user.getPassword());
    }
    
    public int update(User user) {
        String sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getId());
    }
    
    public int delete(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
    
    // 批量操作
    public int[] batchInsert(List<User> users) {
        String sql = "INSERT INTO users(username, email, password) VALUES(?, ?, ?)";
        
        List<Object[]> batchArgs = users.stream()
            .map(user -> new Object[]{user.getUsername(), user.getEmail(), user.getPassword()})
            .collect(Collectors.toList());
        
        return jdbcTemplate.batchUpdate(sql, batchArgs);
    }
    
    // 使用 NamedParameterJdbcTemplate
    public List<User> findByStatus(String status) {
        String sql = "SELECT * FROM users WHERE status = :status";
        Map<String, Object> params = new HashMap<>();
        params.put("status", status);
        
        return namedParameterJdbcTemplate.query(sql, params, new UserRowMapper());
    }
    
    // 行映射器
    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getLong("id"));
            user.setUsername(rs.getString("username"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return user;
        }
    }
}
```

**事务管理**：

```java
@Service
public class OrderService {
    
    private final JdbcTemplate jdbcTemplate;
    
    public OrderService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    @Transactional
    public void placeOrder(Order order) {
        // 1. 创建订单
        String orderSql = "INSERT INTO orders(user_id, total_amount) VALUES(?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(orderSql, new String[]{"id"});
            ps.setLong(1, order.getUserId());
            ps.setBigDecimal(2, order.getTotalAmount());
            return ps;
        }, keyHolder);
        
        Long orderId = keyHolder.getKey().longValue();
        
        // 2. 创建订单项
        String itemSql = "INSERT INTO order_items(order_id, product_id, quantity, price) VALUES(?, ?, ?, ?)";
        List<Object[]> batchArgs = order.getItems().stream()
            .map(item -> new Object[]{orderId, item.getProductId(), item.getQuantity(), item.getPrice()})
            .collect(Collectors.toList());
        
        jdbcTemplate.batchUpdate(itemSql, batchArgs);
        
        // 3. 扣减库存
        for (OrderItem item : order.getItems()) {
            String updateSql = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";
            int updated = jdbcTemplate.update(updateSql, item.getQuantity(), item.getProductId(), item.getQuantity());
            
            if (updated == 0) {
                throw new InsufficientStockException("库存不足");
            }
        }
        
        // 4. 扣减用户余额
        String balanceSql = "UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?";
        int updated = jdbcTemplate.update(balanceSql, order.getTotalAmount(), order.getUserId(), order.getTotalAmount());
        
        if (updated == 0) {
            throw new InsufficientBalanceException("余额不足");
        }
    }
}
```

### 6.3 MyBatis
**MyBatis 配置**：

```yaml
# application.yml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.demo.model
  configuration:
    map-underscore-to-camel-case: true
    use-generated-keys: true
    default-fetch-size: 100
    default-statement-timeout: 30
  executor-type: simple
```

**Mapper 接口**：

```java
@Mapper
public interface UserMapper {
    
    // 注解方式
    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(@Param("id") Long id);
    
    @Select("SELECT * FROM users WHERE username = #{username}")
    User findByUsername(@Param("username") String username);
    
    @Insert("INSERT INTO users(username, email, password) VALUES(#{username}, #{email}, #{password})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE users SET username = #{username}, email = #{email} WHERE id = #{id}")
    int update(User user);
    
    @Delete("DELETE FROM users WHERE id = #{id}")
    int delete(Long id);
    
    // 动态 SQL
    @SelectProvider(type = UserSqlProvider.class, method = "findByCondition")
    List<User> findByCondition(UserCondition condition);
    
    // 一对多查询
    @Select("SELECT * FROM users WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "orders", column = "id", 
                many = @Many(select = "com.example.demo.mapper.OrderMapper.findByUserId"))
    })
    User findByIdWithOrders(Long id);
}
```

**XML 映射文件**：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.demo.mapper.UserMapper">
    
    <resultMap id="userMap" type="User">
        <id property="id" column="id"/>
        <result property="username" column="username"/>
        <result property="email" column="email"/>
        <result property="password" column="password"/>
        <result property="createdAt" column="created_at"/>
        <result property="updatedAt" column="updated_at"/>
    </resultMap>
    
    <!-- 基础查询 -->
    <select id="findAll" resultMap="userMap">
        SELECT * FROM users
    </select>
    
    <!-- 条件查询 -->
    <select id="findByCondition" resultMap="userMap" parameterType="UserCondition">
        SELECT * FROM users
        <where>
            <if test="username != null and username != ''">
                AND username LIKE CONCAT('%', #{username}, '%')
            </if>
            <if test="email != null and email != ''">
                AND email = #{email}
            </if>
            <if test="status != null">
                AND status = #{status}
            </if>
            <if test="startDate != null">
                AND created_at >= #{startDate}
            </if>
            <if test="endDate != null">
                AND created_at <= #{endDate}
            </if>
        </where>
        ORDER BY created_at DESC
    </select>
    
    <!-- 分页查询 -->
    <select id="findByPage" resultMap="userMap">
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT #{offset}, #{pageSize}
    </select>
    
    <!-- 批量插入 -->
    <insert id="batchInsert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO users (username, email, password) VALUES
        <foreach collection="list" item="user" separator=",">
            (#{user.username}, #{user.email}, #{user.password})
        </foreach>
    </insert>
    
    <!-- 批量更新 -->
    <update id="batchUpdate">
        <foreach collection="list" item="user" separator=";">
            UPDATE users
            SET username = #{user.username},
                email = #{user.email}
            WHERE id = #{user.id}
        </foreach>
    </update>
    
    <!-- 动态更新 -->
    <update id="updateSelective" parameterType="User">
        UPDATE users
        <set>
            <if test="username != null">username = #{username},</if>
            <if test="email != null">email = #{email},</if>
            <if test="password != null">password = #{password},</if>
        </set>
        WHERE id = #{id}
    </update>
    
    <!-- 关联查询 -->
    <resultMap id="userWithOrdersMap" type="User" extends="userMap">
        <collection property="orders" ofType="Order" columnPrefix="order_">
            <id property="id" column="id"/>
            <result property="orderNo" column="order_no"/>
            <result property="totalAmount" column="total_amount"/>
        </collection>
    </resultMap>
    
    <select id="findUserWithOrders" resultMap="userWithOrdersMap">
        SELECT 
            u.*,
            o.id as order_id,
            o.order_no as order_order_no,
            o.total_amount as order_total_amount
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.id = #{id}
    </select>
    
</mapper>
```

**PageHelper 分页插件**：

```java
@Service
public class UserService {
    
    private final UserMapper userMapper;
    
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    
    public PageInfo<User> getUsers(int pageNum, int pageSize, UserCondition condition) {
        // 使用 PageHelper
        PageHelper.startPage(pageNum, pageSize);
        
        List<User> users = userMapper.findByCondition(condition);
        
        return new PageInfo<>(users);
    }
    
    public PageInfo<User> getUsersWithSort(int pageNum, int pageSize, String orderBy) {
        // 排序和分页
        PageHelper.startPage(pageNum, pageSize, orderBy);
        
        List<User> users = userMapper.findAll();
        
        return new PageInfo<>(users);
    }
}
```

### 6.4 事务管理
**声明式事务**：

```java
@Service
@Transactional
public class OrderService {
    
    @Transactional(readOnly = true)
    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("订单不存在"));
    }
    
    @Transactional(rollbackFor = Exception.class)
    public Order createOrder(CreateOrderRequest request) {
        // 创建订单逻辑
        Order order = new Order();
        // ... 设置属性
        
        return orderRepository.save(order);
    }
    
    @Transactional(rollbackFor = {BusinessException.class, InsufficientStockException.class})
    public void processOrder(Long orderId) {
        try {
            // 处理订单
        } catch (Exception e) {
            throw new BusinessException("订单处理失败", e);
        }
    }
    
    // 传播行为
    @Transactional(propagation = Propagation.REQUIRED)
    public void methodA() {
        // 如果当前没有事务，就新建一个事务
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void methodB() {
        // 总是新建一个事务
    }
    
    @Transactional(propagation = Propagation.NESTED)
    public void methodC() {
        // 如果当前存在事务，则嵌套事务执行
    }
    
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void methodD() {
        // 以非事务方式执行
    }
    
    @Transactional(propagation = Propagation.NEVER)
    public void methodE() {
        // 以非事务方式执行，如果当前存在事务则抛出异常
    }
}
```

**编程式事务**：

```java
@Service
public class OrderService {
    
    private final PlatformTransactionManager transactionManager;
    private final TransactionTemplate transactionTemplate;
    
    public OrderService(PlatformTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }
    
    public void processOrder(Long orderId) {
        // 使用 TransactionTemplate
        transactionTemplate.execute(status -> {
            try {
                // 业务逻辑
                return null;
            } catch (Exception e) {
                status.setRollbackOnly();
                throw e;
            }
        });
    }
    
    public void processWithManualTransaction(Long orderId) {
        // 手动管理事务
        DefaultTransactionDefinition definition = new DefaultTransactionDefinition();
        definition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        definition.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);
        definition.setTimeout(30);
        
        TransactionStatus status = transactionManager.getTransaction(definition);
        
        try {
            // 业务逻辑
            
            transactionManager.commit(status);
        } catch (Exception e) {
            transactionManager.rollback(status);
            throw e;
        }
    }
}
```

**事务隔离级别**：

```java
@Service
public class AccountService {
    
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        // 转账逻辑
    }
    
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public BigDecimal getBalance(Long accountId) {
        // 查询余额
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void batchUpdate(List<Account> accounts) {
        // 批量更新
    }
}
```

| 隔离级别 | 描述 | 可能的问题 |
|----------|------|-----------|
| READ_UNCOMMITTED | 读取未提交的数据 | 脏读、不可重复读、幻读 |
| READ_COMMITTED | 读取已提交的数据 | 不可重复读、幻读 |
| REPEATABLE_READ | 可重复读 | 幻读 |
| SERIALIZABLE | 串行化 | 无 |

---

## 七、安全控制
### 7.1 Spring Security 进阶配置
**安全配置详解**：
Spring Security 是 Spring 生态中负责安全认证和授权的框架。在 Spring Boot 中，通过自动配置简化了安全设置，但仍需根据业务需求进行定制。

**常用安全配置选项**：

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| 密码编码器 | 密码存储策略 | BCryptPasswordEncoder |
| 会话管理 | 会话创建策略 | stateless（无状态） |
| CSRF 防护 | 跨站请求伪造防护 | 禁用（API场景） |
| CORS 配置 | 跨域资源共享 | 允许特定源 |
| 安全头 | 安全相关HTTP头 | 内容安全策略 |
| 认证提供者 | 认证逻辑 | DaoAuthenticationProvider |
| 访问决策 | 授权决策逻辑 | 基于角色/权限 |

**多认证源配置**：

```java
@Configuration
@EnableWebSecurity
public class MultiAuthSecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/user/**").hasRole("USER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
            )
            .rememberMe(remember -> remember
                .tokenValiditySeconds(7 * 24 * 60 * 60) // 7天
                .key("myRememberKey")
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .deleteCookies("JSESSIONID")
            );
        
        return http.build();
    }
    
    // 内存用户配置（示例）
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withUsername("user")
            .password("{bcrypt}$2a$10$...")
            .roles("USER")
            .build();
        
        UserDetails admin = User.withUsername("admin")
            .password("{bcrypt}$2a$10$...")
            .roles("ADMIN", "USER")
            .build();
        
        return new InMemoryUserDetailsManager(user, admin);
    }
}
```

### 7.2 OAuth2 与单点登录
**OAuth2 授权服务器配置**：

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {
    
    private final AuthenticationManager authenticationManager;
    private final DataSource dataSource;
    
    public AuthorizationServerConfig(AuthenticationManager authenticationManager, 
                                     DataSource dataSource) {
        this.authenticationManager = authenticationManager;
        this.dataSource = dataSource;
    }
    
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.jdbc(dataSource);
    }
    
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
            .authenticationManager(authenticationManager)
            .tokenStore(tokenStore())
            .accessTokenConverter(accessTokenConverter());
    }
    
    @Bean
    public TokenStore tokenStore() {
        return new JdbcTokenStore(dataSource);
    }
    
    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey("mySecretKey");
        return converter;
    }
}
```

**OAuth2 资源服务器配置**：

```java
@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {
    
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/api/public/**").permitAll()
            .antMatchers("/api/**").authenticated();
    }
    
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId("api-resource");
    }
}
```

### 7.3 方法级安全控制
**使用注解进行细粒度控制**：

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @PreAuthorize("hasRole('ADMIN') or hasPermission(#id, 'Product', 'read')")
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.findById(id);
    }
    
    @PreAuthorize("@securityService.canCreateProduct(authentication)")
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.create(product);
    }
    
    @PostAuthorize("returnObject.owner == authentication.name")
    @GetMapping("/secret/{id}")
    public SecretProduct getSecretProduct(@PathVariable Long id) {
        return productService.findSecretById(id);
    }
    
    @PreFilter("filterObject.owner == authentication.name")
    @PostMapping("/batch")
    public List<Product> createProducts(@RequestBody List<Product> products) {
        return productService.batchCreate(products);
    }
    
    @PostFilter("filterObject.price > 100")
    @GetMapping("/expensive")
    public List<Product> getExpensiveProducts() {
        return productService.findAll();
    }
    
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.delete(id);
    }
    
    @RolesAllowed({"USER", "ADMIN"})
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.update(id, product);
    }
}
```

**自定义权限评估器**：

```java
@Component("securityService")
public class SecurityService {
    
    public boolean canCreateProduct(Authentication authentication) {
        // 自定义权限逻辑
        return authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("CREATE_PRODUCT"));
    }
    
    public boolean isProductOwner(Long productId, String username) {
        // 检查用户是否是产品所有者
        return productService.isOwner(productId, username);
    }
}
```

### 7.4 安全审计
**审计功能配置**：

```java
@Configuration
@EnableJpaAuditing
public class AuditConfig {
    
    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.of("system");
            }
            return Optional.of(authentication.getName());
        };
    }
}

@Entity
@EntityListeners(AuditingEntityListener.class)
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private BigDecimal price;
    
    @CreatedBy
    private String createdBy;
    
    @LastModifiedBy
    private String lastModifiedBy;
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
}
```

**安全事件监听**：

```java
@Component
public class SecurityEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityEventListener.class);
    
    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event) {
        logger.info("用户 {} 登录成功", event.getAuthentication().getName());
        
        // 记录登录日志
        LoginLog log = new LoginLog();
        log.setUsername(event.getAuthentication().getName());
        log.setLoginTime(LocalDateTime.now());
        log.setStatus("SUCCESS");
        loginLogRepository.save(log);
    }
    
    @EventListener
    public void handleAuthenticationFailure(AbstractAuthenticationFailureEvent event) {
        logger.warn("用户 {} 登录失败: {}", 
            event.getAuthentication().getName(), 
            event.getException().getMessage());
    }
    
    @EventListener
    public void handleAuthorizationFailure(AccessDeniedException event) {
        logger.warn("授权失败: {}", event.getMessage());
    }
}
```

### 7.5 安全头配置
**安全头配置示例**：

```java
@Configuration
public class SecurityHeadersConfig {
    
    @Bean
    public SecurityFilterChain securityHeadersFilterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline'")
                )
                .frameOptions(FrameOptionsConfig::sameOrigin)
                .xssProtection(xss -> xss
                    .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK)
                )
                .contentTypeOptions(ContentTypeOptionsConfig::deny)
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN)
                )
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000) // 1年
                )
            );
        
        return http.build();
    }
}
```

---

## 八、消息队列
### 8.1 RabbitMQ 集成
**RabbitMQ 配置**：

```yaml
# application.yml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
    virtual-host: /
    connection-timeout: 30000
    listener:
      simple:
        prefetch: 10
        concurrency: 5
        max-concurrency: 10
        acknowledge-mode: auto
```

**队列配置**：

```java
@Configuration
public class RabbitMQConfig {
    
    // 订单队列
    @Bean
    public Queue orderQueue() {
        return new Queue("order.queue", true); // 持久化
    }
    
    // 死信队列
    @Bean
    public Queue orderDeadLetterQueue() {
        return new Queue("order.dead.letter.queue", true);
    }
    
    // 交换器
    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange("order.exchange");
    }
    
    // 绑定
    @Bean
    public Binding orderBinding() {
        return BindingBuilder
            .bind(orderQueue())
            .to(orderExchange())
            .with("order.routing.key");
    }
    
    // JSON消息转换器
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
```

**消息生产者**：

```java
@Service
public class OrderMessageProducer {
    
    private final RabbitTemplate rabbitTemplate;
    
    public OrderMessageProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    
    public void sendOrderCreated(Order order) {
        rabbitTemplate.convertAndSend(
            "order.exchange",
            "order.routing.key",
            order,
            message -> {
                message.getMessageProperties().setPriority(5);
                message.getMessageProperties().setExpiration("60000"); // 60秒过期
                return message;
            }
        );
    }
    
    // 发送延迟消息
    public void sendDelayedMessage(Order order, long delay) {
        rabbitTemplate.convertAndSend(
            "delayed.exchange",
            "delayed.routing.key",
            order,
            message -> {
                message.getMessageProperties().setDelay(Math.toIntExact(delay));
                return message;
            }
        );
    }
    
    // 发送事务消息
    @Transactional
    public void sendTransactionalMessage(Order order) {
        rabbitTemplate.convertAndSend(
            "order.exchange",
            "order.routing.key",
            order
        );
        // 如果后续操作失败，消息会回滚
    }
}
```

**消息消费者**：

```java
@Component
public class OrderMessageConsumer {
    
    @RabbitListener(queues = "order.queue")
    public void processOrder(Order order) {
        // 处理订单
        orderService.process(order);
    }
    
    // 手动确认
    @RabbitListener(queues = "order.queue")
    public void processOrderManualAck(Order order, Channel channel, 
                                      @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        try {
            orderService.process(order);
            channel.basicAck(tag, false); // 确认消息
        } catch (Exception e) {
            channel.basicNack(tag, false, true); // 拒绝并重新入队
        }
    }
    
    // 批量消费
    @RabbitListener(queues = "order.queue", containerFactory = "batchFactory")
    public void processOrderBatch(List<Message> messages, Channel channel) {
        for (Message message : messages) {
            Order order = (Order) rabbitTemplate.getMessageConverter().fromMessage(message);
            orderService.process(order);
        }
    }
}
```

### 8.2 Kafka 集成
**Kafka 配置**：

```yaml
# application.yml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: order-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "com.example.demo.model"
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    listener:
      ack-mode: batch
```

**Kafka 生产者**：

```java
@Service
public class KafkaProducer {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public KafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    public void sendOrderEvent(String topic, OrderEvent event) {
        kafkaTemplate.send(topic, event.getOrderId().toString(), event);
    }
    
    public void sendWithCallback(String topic, OrderEvent event) {
        ListenableFuture<SendResult<String, Object>> future = 
            kafkaTemplate.send(topic, event.getOrderId().toString(), event);
        
        future.addCallback(new ListenableFutureCallback<SendResult<String, Object>>() {
            @Override
            public void onSuccess(SendResult<String, Object> result) {
                log.info("消息发送成功: {}", result.getRecordMetadata().toString());
            }
            
            @Override
            public void onFailure(Throwable ex) {
                log.error("消息发送失败: {}", ex.getMessage());
            }
        });
    }
    
    // 事务消息
    @Transactional
    public void sendTransactionalMessage(String topic, OrderEvent event) {
        kafkaTemplate.executeInTransaction(t -> {
            t.send(topic, event.getOrderId().toString(), event);
            // 其他操作
            return true;
        });
    }
}
```

**Kafka 消费者**：

```java
@Component
public class KafkaConsumer {
    
    @KafkaListener(topics = "order-topic", groupId = "order-group")
    public void consumeOrder(OrderEvent event) {
        log.info("收到订单事件: {}", event);
        orderService.processOrderEvent(event);
    }
    
    // 批量消费
    @KafkaListener(topics = "order-topic", groupId = "order-group", 
                   containerFactory = "batchFactory")
    public void consumeOrderBatch(List<ConsumerRecord<String, OrderEvent>> records) {
        for (ConsumerRecord<String, OrderEvent> record : records) {
            orderService.processOrderEvent(record.value());
        }
    }
    
    // 手动提交
    @KafkaListener(topics = "order-topic", groupId = "order-group", 
                   containerFactory = "manualAckFactory")
    public void consumeOrderManual(OrderEvent event, 
                                   Acknowledgment acknowledgment) {
        try {
            orderService.processOrderEvent(event);
            acknowledgment.acknowledge();
        } catch (Exception e) {
            // 处理失败，不确认
        }
    }
}
```

### 8.3 消息可靠性保证
**消息可靠性模式**：
1. **At Most Once**：最多一次，可能丢失消息
2. **At Least Once**：至少一次，可能重复消费
3. **Exactly Once**：恰好一次，需要额外支持

**消息重试机制**：

```java
@Configuration
public class RetryConfig {
    
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        
        // 重试配置
        RetryTemplate retryTemplate = new RetryTemplate();
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(1000);
        backOffPolicy.setMultiplier(2.0);
        backOffPolicy.setMaxInterval(10000);
        
        retryTemplate.setBackOffPolicy(backOffPolicy);
        retryTemplate.setRetryPolicy(new SimpleRetryPolicy(3));
        
        factory.setAdviceChain(retryTemplate);
        
        return factory;
    }
}
```

**死信队列处理**：

```java
@Configuration
public class DeadLetterConfig {
    
    @Bean
    public Queue orderQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", "order.dlx.exchange");
        args.put("x-dead-letter-routing-key", "order.dead.letter");
        args.put("x-message-ttl", 60000); // 60秒过期
        
        return new Queue("order.queue", true, false, false, args);
    }
    
    @Bean
    public Queue deadLetterQueue() {
        return new Queue("order.dead.letter.queue");
    }
    
    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange("order.dlx.exchange");
    }
    
    @Bean
    public Binding deadLetterBinding() {
        return BindingBuilder
            .bind(deadLetterQueue())
            .to(deadLetterExchange())
            .with("order.dead.letter");
    }
}
```

---

## 九、缓存
### 9.1 Spring Cache
**缓存配置**：

```yaml
# application.yml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 60000
      cache-null-values: false
      key-prefix: "cache:"
      use-key-prefix: true
```

**启用缓存**：

```java
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**缓存使用示例**：

```java
@Service
public class ProductService {
    
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("产品不存在"));
    }
    
    @Cacheable(value = "products", key = "'list'", condition = "#category != null")
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    @CachePut(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }
    
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public void clearAllProducts() {
        // 清除所有产品缓存
    }
    
    @Caching(
        evict = {
            @CacheEvict(value = "products", key = "#product.id"),
            @CacheEvict(value = "productList", allEntries = true)
        }
    )
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
```

**自定义缓存管理器**：

```java
@Configuration
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()))
            .disableCachingNullValues();
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .withInitialCacheConfigurations(getCacheConfigurations())
            .transactionAware()
            .build();
    }
    
    private Map<String, RedisCacheConfiguration> getCacheConfigurations() {
        Map<String, RedisCacheConfiguration> configMap = new HashMap<>();
        
        configMap.put("products", RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new JdkSerializationRedisSerializer())));
        
        configMap.put("users", RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1)));
        
        return configMap;
    }
}
```

### 9.2 Redis 缓存
**Redis 配置**：

```yaml
# application.yml
spring:
  redis:
    host: localhost
    port: 6379
    password: 
    database: 0
    timeout: 2000
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: -1
```

**Redis 模板使用**：

```java
@Service
public class RedisService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;
    
    public RedisService(RedisTemplate<String, Object> redisTemplate,
                       StringRedisTemplate stringRedisTemplate) {
        this.redisTemplate = redisTemplate;
        this.stringRedisTemplate = stringRedisTemplate;
    }
    
    public void setValue(String key, Object value) {
        redisTemplate.opsForValue().set(key, value, Duration.ofMinutes(10));
    }
    
    public Object getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }
    
    public void setHashValue(String key, String hashKey, Object value) {
        redisTemplate.opsForHash().put(key, hashKey, value);
    }
    
    public Object getHashValue(String key, String hashKey) {
        return redisTemplate.opsForHash().get(key, hashKey);
    }
    
    public void addToList(String key, Object value) {
        redisTemplate.opsForList().rightPush(key, value);
    }
    
    public List<Object> getList(String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }
    
    public void addToSet(String key, Object value) {
        redisTemplate.opsForSet().add(key, value);
    }
    
    public Set<Object> getSet(String key) {
        return redisTemplate.opsForSet().members(key);
    }
    
    public void increment(String key) {
        redisTemplate.opsForValue().increment(key);
    }
    
    public Boolean setIfAbsent(String key, Object value, Duration timeout) {
        return redisTemplate.opsForValue().setIfAbsent(key, value, timeout);
    }
}
```

**分布式锁实现**：

```java
@Component
public class DistributedLock {
    
    private final RedisTemplate<String, String> redisTemplate;
    private static final String LOCK_PREFIX = "lock:";
    
    public DistributedLock(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    public boolean tryLock(String lockKey, String requestId, long expireTime) {
        String key = LOCK_PREFIX + lockKey;
        
        return Boolean.TRUE.equals(redisTemplate.opsForValue()
            .setIfAbsent(key, requestId, Duration.ofMillis(expireTime)));
    }
    
    public boolean unlock(String lockKey, String requestId) {
        String key = LOCK_PREFIX + lockKey;
        String value = redisTemplate.opsForValue().get(key);
        
        if (requestId.equals(value)) {
            return Boolean.TRUE.equals(redisTemplate.delete(key));
        }
        return false;
    }
    
    // Redisson 分布式锁
    public void withRedissonLock(String lockKey, Runnable task) {
        RLock lock = redissonClient.getLock(lockKey);
        try {
            boolean locked = lock.tryLock(10, 60, TimeUnit.SECONDS);
            if (locked) {
                task.run();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
```

### 9.3 多级缓存
**多级缓存配置**：

```java
@Configuration
public class MultiLevelCacheConfig {
    
    @Primary
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
        caffeineCacheManager.setCaffeine(caffeineCacheBuilder());
        
        // 创建多级缓存管理器
        List<CacheManager> cacheManagers = new ArrayList<>();
        cacheManagers.add(caffeineCacheManager);
        cacheManagers.add(redisCacheManager());
        
        return new CompositeCacheManager(cacheManagers);
    }
    
    @Bean
    public Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
            .initialCapacity(100)
            .maximumSize(1000)
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .recordStats();
    }
    
    @Bean
    public RedisCacheManager redisCacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1));
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
```

**缓存穿透/击穿/雪崩解决方案**：

```java
@Service
public class CacheSafeService {
    
    // 缓存空值防止缓存穿透
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product getProductSafe(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            // 缓存空值，短时间过期
            redisTemplate.opsForValue().set("product:null:" + id, "", 1, TimeUnit.MINUTES);
        }
        return product;
    }
    
    // 互斥锁防止缓存击穿
    public Product getProductWithLock(Long id) {
        String cacheKey = "product:" + id;
        Product product = (Product) redisTemplate.opsForValue().get(cacheKey);
        
        if (product == null) {
            String lockKey = "lock:product:" + id;
            try {
                // 尝试获取锁
                if (tryLock(lockKey)) {
                    // 双重检查
                    product = (Product) redisTemplate.opsForValue().get(cacheKey);
                    if (product == null) {
                        product = productRepository.findById(id).orElse(null);
                        if (product != null) {
                            redisTemplate.opsForValue().set(cacheKey, product, 30, TimeUnit.MINUTES);
                        }
                    }
                } else {
                    // 等待重试
                    Thread.sleep(100);
                    return getProductWithLock(id);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                unlock(lockKey);
            }
        }
        return product;
    }
    
    // 随机过期时间防止缓存雪崩
    public void setWithRandomExpire(String key, Object value) {
        Random random = new Random();
        int expire = 1800 + random.nextInt(600); // 30-40分钟随机过期
        redisTemplate.opsForValue().set(key, value, expire, TimeUnit.SECONDS);
    }
}
```

---

## 十、定时任务
### 10.1 @Scheduled 注解
**基本定时任务**：

```java
@Component
public class ScheduledTasks {
    
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);
    
    // 每5秒执行一次
    @Scheduled(fixedRate = 5000)
    public void fixedRateTask() {
        logger.info("Fixed Rate Task: {}", System.currentTimeMillis());
    }
    
    // 每5秒执行一次，上次结束5秒后开始
    @Scheduled(fixedDelay = 5000)
    public void fixedDelayTask() {
        logger.info("Fixed Delay Task: {}", System.currentTimeMillis());
    }
    
    // 初始延迟3秒，每5秒执行一次
    @Scheduled(initialDelay = 3000, fixedRate = 5000)
    public void initialDelayTask() {
        logger.info("Initial Delay Task: {}", System.currentTimeMillis());
    }
    
    // Cron表达式：每秒执行
    @Scheduled(cron = "*/1 * * * * *")
    public void cronTask() {
        logger.info("Cron Task: {}", System.currentTimeMillis());
    }
    
    // Cron表达式：工作日上午10点执行
    @Scheduled(cron = "0 0 10 * * MON-FRI")
    public void workdayTask() {
        logger.info("Workday Task: {}", LocalDateTime.now());
    }
}
```

**定时任务配置**：

```java
@Configuration
@EnableScheduling
public class SchedulerConfig implements SchedulingConfigurer {
    
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(taskScheduler());
    }
    
    @Bean(destroyMethod = "shutdown")
    public Executor taskScheduler() {
        return Executors.newScheduledThreadPool(10);
    }
    
    @Bean
    public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10);
        scheduler.setThreadNamePrefix("scheduled-task-");
        scheduler.setAwaitTerminationSeconds(60);
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        return scheduler;
    }
}
```

### 10.2 动态定时任务
**动态定时任务实现**：

```java
@Component
public class DynamicScheduledTask {
    
    private final ThreadPoolTaskScheduler taskScheduler;
    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
    
    public DynamicScheduledTask(ThreadPoolTaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }
    
    public void addTask(String taskId, Runnable task, String cronExpression) {
        ScheduledFuture<?> future = taskScheduler.schedule(
            task,
            triggerContext -> {
                CronTrigger trigger = new CronTrigger(cronExpression);
                return trigger.nextExecutionTime(triggerContext);
            }
        );
        
        scheduledTasks.put(taskId, future);
    }
    
    public void updateTask(String taskId, Runnable task, String cronExpression) {
        cancelTask(taskId);
        addTask(taskId, task, cronExpression);
    }
    
    public void cancelTask(String taskId) {
        ScheduledFuture<?> future = scheduledTasks.get(taskId);
        if (future != null) {
            future.cancel(true);
            scheduledTasks.remove(taskId);
        }
    }
    
    public boolean isTaskRunning(String taskId) {
        ScheduledFuture<?> future = scheduledTasks.get(taskId);
        return future != null && !future.isDone();
    }
    
    public List<String> getRunningTasks() {
        return scheduledTasks.entrySet().stream()
            .filter(entry -> !entry.getValue().isDone())
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
}
```

### 10.3 分布式定时任务
**基于数据库的分布式锁**：

```java
@Component
public class DistributedScheduledTask {
    
    @Scheduled(cron = "0 */5 * * * *")
    @SchedulerLock(name = "syncDataTask", lockAtMostFor = "5m", lockAtLeastFor = "1m")
    public void syncData() {
        // 使用数据库锁确保只有一个实例执行
        if (tryAcquireLock("syncDataTask", 5)) {
            try {
                // 执行任务
                dataSyncService.sync();
            } finally {
                releaseLock("syncDataTask");
            }
        }
    }
    
    private boolean tryAcquireLock(String lockName, int expireSeconds) {
        String sql = "INSERT INTO distributed_lock(lock_name, locked_by, locked_at, expire_at) " +
                    "VALUES(?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? SECOND)) " +
                    "ON DUPLICATE KEY UPDATE " +
                    "locked_by = IF(expire_at < NOW(), VALUES(locked_by), locked_by), " +
                    "locked_at = IF(expire_at < NOW(), VALUES(locked_at), locked_at), " +
                    "expire_at = IF(expire_at < NOW(), VALUES(expire_at), expire_at)";
        
        int updated = jdbcTemplate.update(sql, lockName, getInstanceId(), expireSeconds);
        return updated > 0;
    }
}
```

**使用 Quartz 集群**：

```yaml
# application.yml
spring:
  quartz:
    job-store-type: jdbc
    jdbc:
      initialize-schema: never
    properties:
      org.quartz.scheduler.instanceId: AUTO
      org.quartz.scheduler.instanceName: clusteredScheduler
      org.quartz.jobStore.class: org.quartz.impl.jdbcjobstore.JobStoreTX
      org.quartz.jobStore.driverDelegateClass: org.quartz.impl.jdbcjobstore.StdJDBCDelegate
      org.quartz.jobStore.tablePrefix: QRTZ_
      org.quartz.jobStore.isClustered: true
      org.quartz.jobStore.clusterCheckinInterval: 20000
      org.quartz.threadPool.class: org.quartz.simpl.SimpleThreadPool
      org.quartz.threadPool.threadCount: 10
```

---

## 十一、监控管理
### 11.1 Spring Boot Actuator
**Actuator 配置**：

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
      base-path: /actuator
    jmx:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
    metrics:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: ${spring.application.name}
  tracing:
    sampling:
      probability: 1.0
```

**健康检查端点**：

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    private final DataSource dataSource;
    private final RedisTemplate<String, String> redisTemplate;
    
    public CustomHealthIndicator(DataSource dataSource, 
                                RedisTemplate<String, String> redisTemplate) {
        this.dataSource = dataSource;
        this.redisTemplate = redisTemplate;
    }
    
    @Override
    public Health health() {
        // 检查数据库连接
        boolean dbHealthy = checkDatabase();
        // 检查Redis连接
        boolean redisHealthy = checkRedis();
        // 检查外部服务
        boolean externalServiceHealthy = checkExternalService();
        
        Map<String, Object> details = new HashMap<>();
        details.put("database", dbHealthy ? "connected" : "disconnected");
        details.put("redis", redisHealthy ? "connected" : "disconnected");
        details.put("externalService", externalServiceHealthy ? "available" : "unavailable");
        
        if (dbHealthy && redisHealthy && externalServiceHealthy) {
            return Health.up().withDetails(details).build();
        } else {
            return Health.down().withDetails(details).build();
        }
    }
    
    // 数据库就绪探针
    @ReadinessProbe
    public HealthCheckResponse databaseReady() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1000)) {
                return HealthCheckResponse.up("database");
            }
        } catch (SQLException e) {
            return HealthCheckResponse.down("database").withDetail("error", e.getMessage());
        }
        return HealthCheckResponse.down("database");
    }
    
    // 应用活跃探针
    @LivenessProbe
    public HealthCheckResponse applicationAlive() {
        return HealthCheckResponse.up("application");
    }
}
```

### 11.2 自定义指标
**自定义业务指标**：

```java
@Component
public class BusinessMetrics {
    
    private final MeterRegistry meterRegistry;
    private final Counter orderCounter;
    private final Timer orderProcessingTimer;
    private final DistributionSummary orderAmountSummary;
    
    public BusinessMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        
        // 订单计数器
        this.orderCounter = Counter.builder("orders.total")
            .description("Total number of orders")
            .tag("type", "business")
            .register(meterRegistry);
        
        // 订单处理时间计时器
        this.orderProcessingTimer = Timer.builder("orders.processing.time")
            .description("Order processing time")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(meterRegistry);
        
        // 订单金额分布
        this.orderAmountSummary = DistributionSummary.builder("orders.amount")
            .description("Order amount distribution")
            .baseUnit("CNY")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(meterRegistry);
    }
    
    public void incrementOrderCount() {
        orderCounter.increment();
    }
    
    public void recordOrderProcessingTime(Runnable task) {
        orderProcessingTimer.record(task);
    }
    
    public void recordOrderAmount(BigDecimal amount) {
        orderAmountSummary.record(amount.doubleValue());
    }
    
    // 测量方法执行时间
    @Timed(value = "user.service", description = "Time taken to process user")
    @Counted(value = "user.service", description = "Number of user service calls")
    public User processUser(User user) {
        // 处理用户
        return user;
    }
    
    // 自定义仪表盘
    public void createCustomGauge() {
        List<String> cacheKeys = Arrays.asList("key1", "key2", "key3");
        
        Gauge.builder("cache.keys.count", cacheKeys, List::size)
            .description("Number of keys in cache")
            .register(meterRegistry);
    }
}
```

**日志监控配置**：

```java
@Configuration
public class LoggingConfig {
    
    @Bean
    public MeterRegistryLogbackConfigurer meterRegistryLogbackConfigurer(MeterRegistry registry) {
        return new MeterRegistryLogbackConfigurer(registry);
    }
    
    // 日志级别动态调整
    @RestController
    @RequestMapping("/actuator/loggers")
    public class LoggersController {
        
        @PostMapping("/{name}")
        public void configureLogLevel(@PathVariable String name, 
                                     @RequestBody Map<String, String> configuration) {
            String level = configuration.get("configuredLevel");
            if (level != null) {
                LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
                context.getLogger(name).setLevel(Level.valueOf(level));
            }
        }
    }
}
```

### 11.3 应用监控
**慢查询监控**：

```java
@Aspect
@Component
@Slf4j
public class SlowQueryAspect {
    
    @Value("${app.slow-query.threshold:1000}")
    private long slowQueryThreshold;
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    @Around("@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    public Object monitorRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        try {
            return joinPoint.proceed();
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            
            // 记录指标
            Timer.Sample sample = Timer.start(meterRegistry);
            sample.stop(meterRegistry.timer("http.request.duration"));
            
            // 记录慢查询
            if (duration > slowQueryThreshold) {
                String methodName = joinPoint.getSignature().toShortString();
                log.warn("慢查询: {} 耗时 {}ms", methodName, duration);
                
                // 发送告警
                alertSlowQuery(methodName, duration);
            }
        }
    }
}
```

**告警配置**：

```yaml
# application.yml
management:
  metrics:
    export:
      prometheus:
        enabled: true
  endpoint:
    prometheus:
      enabled: true
      
# 告警规则
alerting:
  rules:
    - alert: HighErrorRate
      expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.1
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "高错误率"
        description: "5分钟内错误率超过10%"
    
    - alert: HighResponseTime
      expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) > 1
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "高响应时间"
        description: "95%分位响应时间超过1秒"
```

---

## 十二、测试
### 12.1 单元测试
**基本单元测试**：

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void shouldCreateUserSuccessfully() {
        // 准备
        CreateUserRequest request = new CreateUserRequest(
            "testuser", "password123", "test@example.com");
        
        User expectedUser = User.builder()
            .username("testuser")
            .password("encodedPassword")
            .email("test@example.com")
            .build();
        
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(expectedUser);
        
        // 执行
        User result = userService.createUser(request);
        
        // 验证
        assertThat(result.getUsername()).isEqualTo("testuser");
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password123");
    }
    
    @Test
    void shouldThrowExceptionWhenUsernameExists() {
        // 准备
        CreateUserRequest request = new CreateUserRequest(
            "existinguser", "password123", "test@example.com");
        
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);
        
        // 执行和验证
        assertThatThrownBy(() -> userService.createUser(request))
            .isInstanceOf(BusinessException.class)
            .hasMessage("用户名已存在");
        
        verify(userRepository, never()).save(any(User.class));
    }
    
    @ParameterizedTest
    @ValueSource(strings = {"user1", "user2", "user3"})
    void shouldFindUserByUsername(String username) {
        // 参数化测试
        User user = User.builder().username(username).build();
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        
        Optional<User> result = userService.findByUsername(username);
        
        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo(username);
    }
}
```

### 12.2 集成测试
**Spring Boot 集成测试**：

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }
    
    @Test
    void shouldCreateUser() throws Exception {
        CreateUserRequest request = new CreateUserRequest(
            "testuser", "password123", "test@example.com");
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
        
        assertThat(userRepository.count()).isEqualTo(1);
    }
    
    @Test
    void shouldReturnUserList() throws Exception {
        // 准备数据
        User user1 = User.builder().username("user1").email("user1@example.com").build();
        User user2 = User.builder().username("user2").email("user2@example.com").build();
        userRepository.saveAll(Arrays.asList(user1, user2));
        
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("user1"))
                .andExpect(jsonPath("$[1].username").value("user2"));
    }
    
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldAccessAdminEndpointWithAdminRole() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void shouldDenyAccessAdminEndpointWithoutAdminRole() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isForbidden());
    }
}
```

**测试切片**：

```java
// 只测试Web层
@WebMvcTest(UserController.class)
class UserControllerWebTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void shouldGetUser() throws Exception {
        User user = User.builder().id(1L).username("testuser").build();
        when(userService.getUser(1L)).thenReturn(Optional.of(user));
        
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));
    }
}

// 只测试JPA
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldFindByUsername() {
        User user = User.builder().username("testuser").build();
        entityManager.persist(user);
        
        Optional<User> found = userRepository.findByUsername("testuser");
        
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("testuser");
    }
}

// 只测试JSON序列化
@JsonTest
class UserJsonTest {
    
    @Autowired
    private JacksonTester<User> json;
    
    @Test
    void shouldSerializeUser() throws Exception {
        User user = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .build();
        
        assertThat(json.write(user)).isEqualToJson("user.json");
        assertThat(json.write(user)).hasJsonPathStringValue("@.username");
    }
}
```

### 12.3 测试配置
**测试配置文件**：

```yaml
# src/test/resources/application-test.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: false
  redis:
    host: localhost
    port: 6379
    lettuce:
      pool:
        max-active: 5
  kafka:
    bootstrap-servers: ${spring.embedded.kafka.brokers}
    
test:
  double:
    precision: 0.001
```

**测试工具类**：

```java
@SpringBootTest
@Testcontainers
class IntegrationTestWithContainers {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @Container
    static RedisContainer<?> redis = new RedisContainer<>("redis:6-alpine")
        .withExposedPorts(6379);
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", redis::getFirstMappedPort);
    }
    
    @Test
    void shouldWorkWithContainers() {
        // 使用真实容器进行测试
    }
}
```

---

## 十三、部署
### 13.1 打包部署
**打包配置**：

```xml
<!-- Maven 打包配置 -->
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <executable>true</executable>
                <layers>
                    <enabled>true</enabled>
                </layers>
            </configuration>
        </plugin>
    </plugins>
</build>
```

**Docker 部署**：

```dockerfile
# Dockerfile
# 第一阶段：构建
FROM maven:3.8.4-openjdk-17-slim AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# 第二阶段：运行
FROM openjdk:17-jdk-slim
WORKDIR /app

# 创建非root用户
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# 复制JAR文件
COPY --from=builder /app/target/*.jar app.jar

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 环境变量
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# 暴露端口
EXPOSE 8080

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
```

**Docker Compose 部署**：

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/db
      - SPRING_DATASOURCE_USERNAME=user
      - SPRING_DATASOURCE_PASSWORD=password
      - SPRING_REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:13-alpine
    environment:
      - POSTGRES_DB=db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  backend:
    driver: bridge
```

### 13.2 部署策略
**蓝绿部署**：
```yaml
# Kubernetes 蓝绿部署
apiVersion: apps/v1
kind: Deployment
metadata:
name: app-v1
spec:
replicas: 3
selector:
matchLabels:
app: myapp
version: v1
template:
metadata:
labels:
app: myapp
version: v1
spec:
containers:
name: app
image: myapp:v1
ports:
containerPort: 8080
readinessProbe:
httpGet:
path: /actuator/health/readiness
port: 8080
initialDelaySeconds: 30
periodSeconds: 10
livenessProbe:
httpGet:
path: /actuator/health/liveness
port: 8080
initialDelaySeconds: 60
periodSeconds: 10
apiVersion: v1
kind: Service
metadata:
name: app-service
spec:
selector:
app: myapp
ports:
port: 80
targetPort: 8080
```
**滚动更新**：
```yaml
# 滚动更新策略
spec:
strategy:
type: RollingUpdate
rollingUpdate:
maxSurge: 1
maxUnavailable: 0
minReadySeconds: 30
```
### 13.3 配置管理
**外部化配置**：

```java
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class)
            .properties(
                "spring.config.name:application,config",
                "spring.config.location:optional:classpath:/,optional:classpath:/config/,optional:file:./,optional:file:./config/",
                "spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}"
            )
            .run(args);
    }
}
```

**配置服务器**：

```yaml
# bootstrap.yml
spring:
  application:
    name: myapp
  cloud:
    config:
      uri: http://config-server:8888
      fail-fast: true
      retry:
        max-attempts: 6
        max-interval: 10000
      request-read-timeout: 5000
      request-connect-timeout: 2000
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
```

---

## 十四、微服务
### 14.1 Spring Cloud
**微服务架构组件**：

| 组件 | 功能 | 替代方案 |
|------|------|----------|
| Eureka/Nacos | 服务注册与发现 | Consul, Zookeeper |
| Ribbon/Spring Cloud LoadBalancer | 客户端负载均衡 | Nginx |
| Feign/OpenFeign | 声明式HTTP客户端 | RestTemplate, WebClient |
| Hystrix/Resilience4j | 熔断降级 | Sentinel |
| Zuul/Spring Cloud Gateway | API网关 | Kong, Nginx |
| Config Server | 配置中心 | Apollo, Nacos Config |
| Sleuth/Zipkin | 分布式追踪 | SkyWalking, Jaeger |

**服务注册与发现**：

```java
// 服务提供者
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

// 服务消费者
@Service
public class OrderService {
    
    private final RestTemplate restTemplate;
    private final LoadBalancerClient loadBalancer;
    
    public OrderService(RestTemplate restTemplate, 
                       LoadBalancerClient loadBalancer) {
        this.restTemplate = restTemplate;
        this.loadBalancer = loadBalancer;
    }
    
    public User getUser(Long userId) {
        // 使用 RestTemplate
        return restTemplate.getForObject(
            "http://user-service/api/users/{id}", 
            User.class, 
            userId
        );
    }
    
    public User getUserWithFeign(Long userId) {
        return userServiceClient.getUser(userId);
    }
}

// Feign 客户端
@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    @GetMapping("/api/users/{id}")
    User getUser(@PathVariable("id") Long id);
    
    @PostMapping("/api/users")
    User createUser(@RequestBody User user);
}
```

### 14.2 API 网关
**Spring Cloud Gateway 配置**：

```java
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user_service", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    .addRequestHeader("X-Request-Id", UUID.randomUUID().toString())
                    .circuitBreaker(config -> config
                        .setName("userService")
                        .setFallbackUri("forward:/fallback/user"))
                    .retry(config -> config
                        .setRetries(3)
                        .setStatuses(HttpStatus.INTERNAL_SERVER_ERROR))
                )
                .uri("lb://user-service"))
            .route("order_service", r -> r
                .path("/api/orders/**")
                .filters(f -> f
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter()))
                    .modifyRequestBody(String.class, String.class, 
                        (exchange, s) -> Mono.just(s.toUpperCase()))
                )
                .uri("lb://order-service"))
            .build();
    }
    
    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(10, 20, 1);
    }
}
```

**网关过滤器**：

```java
@Component
public class AuthFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // 检查认证头
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        
        // 验证令牌
        String token = authHeader.substring(7);
        if (!validateToken(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        
        // 添加用户信息到请求头
        ServerHttpRequest modifiedRequest = request.mutate()
            .header("X-User-Id", extractUserId(token))
            .build();
        
        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }
    
    @Override
    public int getOrder() {
        return -1;
    }
}
```

### 14.3 服务容错
**Resilience4j 配置**：

```java
@Configuration
public class ResilienceConfig {
    
    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
            .failureRateThreshold(50)
            .waitDurationInOpenState(Duration.ofSeconds(60))
            .slidingWindowSize(10)
            .permittedNumberOfCallsInHalfOpenState(3)
            .build();
        
        return CircuitBreakerRegistry.of(config);
    }
    
    @Bean
    public RateLimiterRegistry rateLimiterRegistry() {
        RateLimiterConfig config = RateLimiterConfig.custom()
            .limitForPeriod(10)
            .limitRefreshPeriod(Duration.ofSeconds(1))
            .timeoutDuration(Duration.ofMillis(100))
            .build();
        
        return RateLimiterRegistry.of(config);
    }
    
    @Bean
    public BulkheadRegistry bulkheadRegistry() {
        BulkheadConfig config = BulkheadConfig.custom()
            .maxConcurrentCalls(5)
            .maxWaitDuration(Duration.ofMillis(100))
            .build();
        
        return BulkheadRegistry.of(config);
    }
}
```

**使用容错保护**：

```java
@Service
public class UserService {
    
    private final CircuitBreaker circuitBreaker;
    private final RateLimiter rateLimiter;
    private final Bulkhead bulkhead;
    
    public UserService(CircuitBreakerRegistry circuitBreakerRegistry,
                      RateLimiterRegistry rateLimiterRegistry,
                      BulkheadRegistry bulkheadRegistry) {
        this.circuitBreaker = circuitBreakerRegistry.circuitBreaker("userService");
        this.rateLimiter = rateLimiterRegistry.rateLimiter("userService");
        this.bulkhead = bulkheadRegistry.bulkhead("userService");
    }
    
    @TimeLimiter(name = "userService", fallbackMethod = "fallback")
    public CompletableFuture<User> getUserWithResilience(Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            // 受保护的服务调用
            return circuitBreaker.executeSupplier(() ->
                rateLimiter.executeSupplier(() ->
                    bulkhead.executeSupplier(() ->
                        userRepository.findById(userId)
                            .orElseThrow(ResourceNotFoundException::new)
                    )
                )
            );
        });
    }
    
    public User fallback(Long userId, TimeoutException e) {
        return User.builder()
            .id(userId)
            .username("fallback")
            .build();
    }
}
```

---

## 十五、性能优化
### 15.1 JVM 优化
**JVM 参数配置**：
```yaml
# application.yml
spring:
application:
name: myapp
config:
activate:
on-profile: prod
# JVM 参数
jvm:
options: >
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:InitiatingHeapOccupancyPercent=35
-Xlog:gc*:file=logs/gc.log:time,uptime,level,tags:filecount=5,filesize=10m
-XX:NativeMemoryTracking=summary
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=logs/
-XX:ErrorFile=logs/hs_err_pid%p.log
```
**监控JVM状态**：

```java
@Component
public class JvmMonitor {
    
    @Scheduled(fixedRate = 60000)
    public void monitorJvm() {
        Runtime runtime = Runtime.getRuntime();
        
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        double memoryUsage = (double) usedMemory / maxMemory * 100;
        
        if (memoryUsage > 80) {
            log.warn("JVM内存使用率过高: {}%", String.format("%.2f", memoryUsage));
        }
        
        // 监控线程状态
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        int threadCount = threadBean.getThreadCount();
        int peakThreadCount = threadBean.getPeakThreadCount();
        
        if (threadCount > 200) {
            log.warn("线程数过多: {}", threadCount);
        }
        
        // 监控GC
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        for (GarbageCollectorMXBean gcBean : gcBeans) {
            long count = gcBean.getCollectionCount();
            long time = gcBean.getCollectionTime();
            log.info("GC {}: 次数={}, 时间={}ms", 
                gcBean.getName(), count, time);
        }
    }
}
```

### 15.2 数据库优化
**连接池优化**：

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      connection-test-query: SELECT 1
      pool-name: HikariPool
      auto-commit: false
      data-source-properties:
        cachePrepStmts: true
        prepStmtCacheSize: 250
        prepStmtCacheSqlLimit: 2048
        useServerPrepStmts: true
        useLocalSessionState: true
        rewriteBatchedStatements: true
        cacheResultSetMetadata: true
        cacheServerConfiguration: true
        elideSetAutoCommits: true
        maintainTimeStats: false
```

**查询优化**：

```java
@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<User> findUsersWithOptimization(UserQuery query, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> root = cq.from(User.class);
        
        // 只选择需要的字段
        cq.multiselect(
            root.get("id"),
            root.get("username"),
            root.get("email")
        );
        
        // 添加查询条件
        List<Predicate> predicates = new ArrayList<>();
        if (query.getUsername() != null) {
            predicates.add(cb.like(root.get("username"), "%" + query.getUsername() + "%"));
        }
        if (query.getStatus() != null) {
            predicates.add(cb.equal(root.get("status"), query.getStatus()));
        }
        
        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(cb.desc(root.get("createdAt")));
        
        TypedQuery<User> typedQuery = entityManager.createQuery(cq);
        
        // 分页
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        // 使用只读查询
        typedQuery.setHint(QueryHints.READ_ONLY, true);
        
        return typedQuery.getResultList();
    }
    
    // 批量操作优化
    @Transactional
    public int batchInsert(List<User> users) {
        Session session = entityManager.unwrap(Session.class);
        session.setJdbcBatchSize(50);
        
        for (int i = 0; i < users.size(); i++) {
            entityManager.persist(users.get(i));
            
            // 每50条刷新一次
            if (i % 50 == 0 && i > 0) {
                entityManager.flush();
                entityManager.clear();
            }
        }
        
        return users.size();
    }
}
```

### 15.3 应用优化
**启动优化**：

```java
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class)
            .lazyInitialization(true) // 延迟初始化
            .logStartupInfo(false)    // 减少启动日志
            .run(args);
    }
}

// 使用懒加载
@Component
@Lazy
public class HeavyService {
    // 延迟初始化的重服务
}

// 使用条件装配
@Configuration
@ConditionalOnProperty(name = "feature.enabled", havingValue = "true")
public class FeatureConfig {
    // 按需加载配置
}
```

**缓存优化策略**：

```java
@Service
public class CacheOptimizationService {
    
    // 多级缓存策略
    public Product getProductWithMultiLevelCache(Long id) {
        // 1. 本地缓存
        Product product = localCache.get(id);
        if (product != null) {
            return product;
        }
        
        // 2. Redis缓存
        product = redisTemplate.opsForValue().get("product:" + id);
        if (product != null) {
            localCache.put(id, product);
            return product;
        }
        
        // 3. 数据库
        product = productRepository.findById(id).orElse(null);
        if (product != null) {
            // 写入缓存
            redisTemplate.opsForValue().set("product:" + id, product, 30, TimeUnit.MINUTES);
            localCache.put(id, product);
        }
        
        return product;
    }
    
    // 缓存预热
    @PostConstruct
    public void warmUpCache() {
        List<Product> hotProducts = productRepository.findHotProducts();
        for (Product product : hotProducts) {
            redisTemplate.opsForValue().set(
                "product:" + product.getId(), 
                product, 
                60, 
                TimeUnit.MINUTES
            );
        }
    }
}
```

---

## 十六、学习资源
### 16.1 官方资源
*   **Spring Boot 官方文档**：[https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
*   **Spring Framework 官方文档**：[https://spring.io/projects/spring-framework](https://spring.io/projects/spring-framework)
*   **Spring Cloud 官方文档**：[https://spring.io/projects/spring-cloud](https://spring.io/projects/spring-cloud)
*   **Spring Data 官方文档**：[https://spring.io/projects/spring-data](https://spring.io/projects/spring-data)
*   **Spring Security 官方文档**：[https://spring.io/projects/spring-security](https://spring.io/projects/spring-security)
*   **Spring Initializr**：[https://start.spring.io](https://start.spring.io)
*   **Spring Boot GitHub**：[https://github.com/spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
*   **Spring Guides**：[https://spring.io/guides](https://spring.io/guides)

### 16.2 推荐书籍
1.  **入门书籍**
    *   《Spring Boot 实战》- Craig Walls
    *   《Spring Boot 编程思想》- 小马哥
    *   《Spring Boot 揭秘》- 汪云飞
2.  **进阶书籍**
    *   《Spring 源码深度解析》- 郝佳
    *   《Spring Boot 企业级应用开发实战》
    *   《Spring Cloud 微服务实战》

### 16.3 在线课程
*   **Spring 官方教程**：Spring Guides 提供的循序渐进的实践教程
*   **Udemy**：多位讲师提供的完整 Spring Boot 系列课程
*   **Coursera**：知名大学的 Java 和 Spring 相关课程
*   **Bilibili/YouTube**：众多免费的视频教程和项目实战
*   **慕课网/极客时间**：国内的技术课程平台

### 16.4 社区与论坛
*   **Stack Overflow**：问题解答，标签 `spring-boot`、`spring` 下有大量讨论
*   **GitHub Issues**：各 Spring 项目的官方问题追踪和讨论区
*   **Reddit**：r/java、r/SpringBoot 子版块
*   **知乎/掘金/思否**：中文技术社区，有许多经验分享和问题讨论
*   **Spring 官方论坛**：社区讨论和官方支持

### 16.5 练习与实战
*   **Spring Initializr**：快速创建项目脚手架进行练习
*   **LeetCode**：算法练习，可结合 Spring Boot 实现 Web 接口
*   **GitHub 开源项目**：阅读和模仿优秀的 Spring Boot 项目源码
*   **官方样例代码**：Spring Boot 源码仓库中的 `spring-boot-samples` 模块
*   **构建个人项目**：从博客系统、管理系统等小型项目开始实践

### 16.6 学习建议
1.  **循序渐进**：从 Spring Boot 基础开始，再到 Web 开发、数据访问、安全等模块。
2.  **重视官方文档**：Spring 官方文档质量极高，是解决问题的最佳首选。
3.  **动手实践**：编码是学习框架的最佳途径，不要只停留在阅读。
4.  **理解而非记忆**：理解 Spring 的核心思想（如 IoC、AOP）和 Spring Boot 的自动配置原理。
5.  **关注社区**：通过社区了解最佳实践、常见问题解决方案和最新动态。
6.  **版本选择**：初学者建议从当前主流稳定版（如 Spring Boot 3.x）开始，避免过早接触快照或候选版本。