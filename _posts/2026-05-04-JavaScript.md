---
title: "JavaScript相关"
categories:
  - JavaScript
tags:
  - JavaScript
toc: true
order: 2
---
# JavaScript 编程语言 完整系统学习大纲

---

## 一、JavaScript 概述
### 1.1 JavaScript 发展历史
*   **1995年**：Brendan Eich 在 Netscape 公司开发，最初名为 Mocha，后改为 LiveScript，最终定名 JavaScript
*   **1997年**：ECMAScript 1.0 成为标准
*   **2009年**：ES5 发布，带来严格模式、JSON 支持等
*   **2015年**：ES6（ES2015）发布，重大更新，引入类、模块、箭头函数等
*   **2015年至今**：每年发布新版本（ES2016、ES2017...）
*   **现代 JavaScript**：ES6+ 成为主流，TypeScript 流行

### 1.2 JavaScript 特性
*   **解释型语言**：边解释边执行
*   **动态类型**：变量类型在运行时确定
*   **基于原型**：使用原型链实现继承
*   **单线程**：但支持异步编程
*   **事件驱动**：非阻塞 I/O
*   **跨平台**：浏览器、服务器、桌面、移动端

### 1.3 JavaScript 运行环境
1.  **浏览器环境**
    *   Chrome V8
    *   Firefox SpiderMonkey
    *   Safari JavaScriptCore
    *   Edge Chakra
2.  **服务器环境**
    *   Node.js
    *   Deno
3.  **其他环境**
    *   桌面应用（Electron）
    *   移动应用（React Native）
    *   数据库（MongoDB）
    *   物联网设备

### 1.4 第一个 JavaScript 程序

```html
<!DOCTYPE html>
<html>
<head>
    <title>第一个JavaScript程序</title>
</head>
<body>
    <script>
        // 在浏览器控制台输出
        console.log("Hello, JavaScript!");
        
        // 在页面显示
        document.write("Hello, World!");
        
        // 弹出对话框
        alert("欢迎学习JavaScript!");
    </script>
</body>
</html>
```

---

## 二、基础语法
### 2.1 变量声明

```javascript
// var (函数作用域，不推荐在新代码中使用)
var name = "张三";
var age = 25;

// let (块级作用域，可重新赋值)
let score = 90;
score = 95;  // 允许重新赋值

// const (块级作用域，常量，不可重新赋值)
const PI = 3.14159;
// PI = 3.14;  // 错误：不能重新赋值

// 变量命名规则
let userName;      // 驼峰命名法
let user_age;      // 下划线命名法
let $price;        // 允许$开头
let _private;      // 允许_开头
// let 123abc;     // 错误：不能以数字开头
// let var;        // 错误：不能使用关键字
```

### 2.2 数据类型
1.  **基本数据类型**

    ```javascript
    // 1. String 字符串
    let str1 = "Hello";
    let str2 = 'World';
    let str3 = `模板字符串 ${str1}`;  // ES6模板字符串
    let str4 = "It's a book";
    let str5 = 'He said "Hello"';

    // 2. Number 数字
    let num1 = 42;         // 整数
    let num2 = 3.14;       // 浮点数
    let num3 = 1.23e6;     // 科学计数法
    let num4 = 0xff;       // 十六进制
    let num5 = 0o77;       // 八进制
    let num6 = 0b1111;     // 二进制
    let num7 = Infinity;   // 无穷大
    let num8 = -Infinity;  // 负无穷大
    let num9 = NaN;        // 非数字

    // 3. Boolean 布尔值
    let bool1 = true;
    let bool2 = false;

    // 4. Undefined 未定义
    let undef;  // 值为 undefined
    let undef2 = undefined;

    // 5. Null 空值
    let nullVar = null;

    // 6. Symbol 符号 (ES6)
    let sym1 = Symbol("id");
    let sym2 = Symbol("id");
    console.log(sym1 === sym2);  // false，每个Symbol都是唯一的

    // 7. BigInt 大整数 (ES2020)
    let bigInt = 1234567890123456789012345678901234567890n;
    ```

2.  **引用数据类型**

    ```javascript
    // Object 对象
    let obj = { name: "张三", age: 25 };

    // Array 数组
    let arr = [1, 2, 3, 4, 5];

    // Function 函数
    function greet() { return "Hello"; }

    // Date 日期
    let date = new Date();

    // RegExp 正则表达式
    let regex = /pattern/gi;
    ```

### 2.3 类型检测与转换

```javascript
// 类型检测
typeof "Hello";        // "string"
typeof 42;            // "number"
typeof true;          // "boolean"
typeof undefined;     // "undefined"
typeof null;          // "object" (历史遗留问题)
typeof Symbol();      // "symbol"
typeof 123n;          // "bigint"
typeof {};            // "object"
typeof [];            // "object"
typeof function(){};  // "function"

// 更好的类型检测
Array.isArray([]);           // true
[] instanceof Array;         // true
Object.prototype.toString.call([]);  // "[object Array]"

// 类型转换
// 显式转换
let num = Number("123");     // 123
let str = String(123);       // "123"
let bool = Boolean(1);       // true
let int = parseInt("123px"); // 123
let float = parseFloat("3.14em"); // 3.14

// 隐式转换
"5" + 2;      // "52" (字符串连接)
"5" - 2;      // 3 (数字运算)
"5" * "2";    // 10
true + 1;     // 2
false + 1;    // 1
null + 1;     // 1
undefined + 1; // NaN
```

### 2.4 运算符

```javascript
// 1. 算术运算符
let a = 10, b = 3;
a + b;   // 13
a - b;   // 7
a * b;   // 30
a / b;   // 3.333...
a % b;   // 1 (取余)
a ** b;  // 1000 (ES7，指数运算)
a++;     // 后自增
++a;     // 前自增
a--;     // 后自减
--a;     // 前自减

// 2. 赋值运算符
let x = 10;
x += 5;   // x = x + 5
x -= 3;   // x = x - 3
x *= 2;   // x = x * 2
x /= 4;   // x = x / 4
x %= 3;   // x = x % 3
x **= 2;  // x = x ** 2

// 3. 比较运算符
5 == "5";     // true (值相等)
5 === "5";    // false (值和类型都相等)
5 != "5";     // false
5 !== "5";    // true
5 > 3;        // true
5 < 3;        // false
5 >= 5;       // true
5 <= 4;       // false

// 4. 逻辑运算符
true && false;    // false (与)
true || false;    // true (或)
!true;            // false (非)

// 5. 位运算符
5 & 1;    // 1 (与)
5 | 1;    // 5 (或)
5 ^ 1;    // 4 (异或)
~5;       // -6 (非)
5 << 1;   // 10 (左移)
5 >> 1;   // 2 (右移)
5 >>> 1;  // 2 (无符号右移)

// 6. 条件运算符
let result = (age >= 18) ? "成人" : "未成年";

// 7. 空值合并运算符 ?? (ES2020)
let value = null;
let result = value ?? "默认值";  // "默认值"

// 8. 可选链操作符 ?. (ES2020)
let user = {};
let name = user?.profile?.name;  // undefined，不会报错
```

### 2.5 控制流程
1.  **条件语句**

    ```javascript
    // if-else
    let score = 85;
    if (score >= 90) {
        console.log("优秀");
    } else if (score >= 80) {
        console.log("良好");
    } else if (score >= 60) {
        console.log("及格");
    } else {
        console.log("不及格");
    }

    // switch
    let day = 3;
    switch (day) {
        case 1:
            console.log("星期一");
            break;
        case 2:
            console.log("星期二");
            break;
        case 3:
            console.log("星期三");
            break;
        default:
            console.log("其他");
    }

    // 三元运算符
    let age = 20;
    let status = (age >= 18) ? "成人" : "未成年人";
    ```

2.  **循环语句**

    ```javascript
    // for循环
    for (let i = 0; i < 5; i++) {
        console.log(i);
    }

    // for...in (遍历对象属性)
    let obj = {a: 1, b: 2, c: 3};
    for (let key in obj) {
        console.log(key, obj[key]);
    }

    // for...of (遍历可迭代对象)
    let arr = [1, 2, 3, 4, 5];
    for (let value of arr) {
        console.log(value);
    }

    // while循环
    let i = 0;
    while (i < 5) {
        console.log(i);
        i++;
    }

    // do...while循环
    let j = 0;
    do {
        console.log(j);
        j++;
    } while (j < 5);

    // 循环控制
    for (let i = 0; i < 10; i++) {
        if (i === 3) {
            continue;  // 跳过本次循环
        }
        if (i === 7) {
            break;     // 终止循环
        }
        console.log(i);
    }
    ```

---

## 三、函数
### 3.1 函数定义

```javascript
// 1. 函数声明
function add(a, b) {
    return a + b;
}

// 2. 函数表达式
const multiply = function(a, b) {
    return a * b;
};

// 3. 箭头函数 (ES6)
const divide = (a, b) => {
    return a / b;
};

// 箭头函数简写
const square = x => x * x;
const greet = () => "Hello World!";

// 4. 立即执行函数
(function() {
    console.log("立即执行");
})();

// 5. 构造函数
const Person = new Function('name', 'age', 
    'this.name = name; this.age = age;');

// 6. 生成器函数 (ES6)
function* generator() {
    yield 1;
    yield 2;
    yield 3;
}
```

### 3.2 函数参数

```javascript
// 默认参数 (ES6)
function greet(name = "游客", greeting = "你好") {
    return `${greeting}, ${name}!`;
}

// 剩余参数 (ES6)
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
sum(1, 2, 3, 4, 5);  // 15

// 参数解构
function printUser({name, age, city = "未知"}) {
    console.log(`${name}, ${age}岁, 来自${city}`);
}
printUser({name: "张三", age: 25});

// arguments 对象
function showArgs() {
    console.log(arguments.length);
    console.log(arguments[0]);
    // arguments 是类数组对象，不是真正的数组
    // 可转换为数组: Array.from(arguments) 或 [...arguments]
}
```

### 3.3 作用域与闭包

```javascript
// 作用域
let globalVar = "全局变量";  // 全局作用域

function outer() {
    let outerVar = "外部变量";  // 函数作用域
    
    function inner() {
        let innerVar = "内部变量";  // 函数作用域
        console.log(globalVar);    // 可以访问
        console.log(outerVar);     // 可以访问
        console.log(innerVar);     // 可以访问
    }
    
    inner();
    // console.log(innerVar);  // 错误：无法访问
}

// 闭包
function createCounter() {
    let count = 0;  // 私有变量
    
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.getCount());   // 2
// console.log(count);  // 错误：count是私有变量
```

### 3.4 高阶函数

```javascript
// 函数作为参数
function calculate(a, b, operation) {
    return operation(a, b);
}

function add(x, y) { return x + y; }
function multiply(x, y) { return x * y; }

calculate(5, 3, add);       // 8
calculate(5, 3, multiply);  // 15

// 函数作为返回值
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
double(5);  // 10
triple(5);  // 15

// Array 的高阶函数方法
const numbers = [1, 2, 3, 4, 5];

// map: 映射
const doubled = numbers.map(x => x * 2);  // [2, 4, 6, 8, 10]

// filter: 过滤
const evens = numbers.filter(x => x % 2 === 0);  // [2, 4]

// reduce: 归约
const sum = numbers.reduce((total, num) => total + num, 0);  // 15

// forEach: 遍历
numbers.forEach(x => console.log(x));

// find: 查找
const found = numbers.find(x => x > 3);  // 4

// some: 是否存在满足条件的
const hasEven = numbers.some(x => x % 2 === 0);  // true

// every: 是否都满足条件
const allPositive = numbers.every(x => x > 0);  // true
```

### 3.5 this 关键字

```javascript
// 1. 默认绑定（全局或undefined）
function showThis() {
    console.log(this);
}
showThis();  // 浏览器中: Window, Node.js中: global

// 2. 隐式绑定（对象方法）
const obj = {
    name: "张三",
    greet: function() {
        console.log(this.name);
    }
};
obj.greet();  // "张三"

// 3. 显式绑定（call, apply, bind）
function introduce(greeting) {
    console.log(`${greeting}, 我是${this.name}`);
}

const person1 = { name: "李四" };
const person2 = { name: "王五" };

introduce.call(person1, "你好");      // "你好, 我是李四"
introduce.apply(person2, ["Hello"]);  // "Hello, 我是王五"

const boundFunc = introduce.bind(person1, "Hi");
boundFunc();  // "Hi, 我是李四"

// 4. new 绑定（构造函数）
function Person(name) {
    this.name = name;
}
const john = new Person("John");
console.log(john.name);  // "John"

// 5. 箭头函数的this（词法作用域）
const obj2 = {
    name: "箭头函数",
    greet: function() {
        // 普通函数
        setTimeout(function() {
            console.log(this.name);  // undefined
        }, 100);
        
        // 箭头函数
        setTimeout(() => {
            console.log(this.name);  // "箭头函数"
        }, 100);
    }
};
obj2.greet();
```

---

## 四、对象
### 4.1 对象创建

```javascript
// 1. 对象字面量
const person = {
    name: "张三",
    age: 25,
    greet: function() {
        console.log(`你好，我是${this.name}`);
    },
    // ES6简写
    sayHello() {
        console.log("Hello!");
    },
    // 计算属性名
    ["id_" + Date.now()]: "unique-id"
};

// 2. 构造函数
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        console.log(`你好，我是${this.name}`);
    };
}
const person1 = new Person("李四", 30);

// 3. Object.create()
const proto = {
    greet: function() {
        console.log(`你好，我是${this.name}`);
    }
};
const person2 = Object.create(proto);
person2.name = "王五";
person2.age = 28;

// 4. Class (ES6)
class PersonClass {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(`你好，我是${this.name}`);
    }
}
const person3 = new PersonClass("赵六", 35);
```

### 4.2 对象操作

```javascript
const obj = { name: "张三", age: 25, city: "北京" };

// 访问属性
console.log(obj.name);      // "张三"
console.log(obj["age"]);    // 25
console.log(obj.gender);    // undefined

// 添加/修改属性
obj.gender = "男";
obj["occupation"] = "工程师";
obj.age = 26;

// 删除属性
delete obj.city;

// 检查属性
console.log("name" in obj);           // true
console.log(obj.hasOwnProperty("age")); // true
console.log(obj.hasOwnProperty("toString")); // false (继承属性)

// 遍历属性
for (let key in obj) {
    console.log(key, obj[key]);
}

Object.keys(obj);      // ["name", "age", "gender", "occupation"]
Object.values(obj);    // ["张三", 26, "男", "工程师"]
Object.entries(obj);   // [["name","张三"],["age",26],...]

// 对象合并
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = Object.assign({}, obj1, obj2);  // {a:1, b:3, c:4}
const merged2 = { ...obj1, ...obj2 };          // ES6扩展运算符

// 对象冻结
Object.freeze(obj);     // 完全冻结，不能修改
Object.seal(obj);       // 密封，可以修改现有属性，不能添加/删除
Object.preventExtensions(obj);  // 防止扩展，不能添加新属性
```

### 4.3 属性描述符

```javascript
const obj = {};

// 定义属性
Object.defineProperty(obj, 'name', {
    value: '张三',
    writable: true,      // 可写
    enumerable: true,    // 可枚举
    configurable: true   // 可配置
});

// 定义多个属性
Object.defineProperties(obj, {
    age: {
        value: 25,
        writable: true
    },
    salary: {
        get() {
            return this._salary;
        },
        set(value) {
            if (value < 0) {
                throw new Error("薪水不能为负");
            }
            this._salary = value;
        },
        enumerable: true
    }
});

// 获取属性描述符
const desc = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(desc);

// 获取所有属性描述符
const allDesc = Object.getOwnPropertyDescriptors(obj);
```

### 4.4 原型与继承

```javascript
// 原型链
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    console.log(`${this.name} 发出声音`);
};

function Dog(name, breed) {
    Animal.call(this, name);  // 调用父类构造函数
    this.breed = breed;
}

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log(`${this.name} 汪汪叫`);
};

const myDog = new Dog("旺财", "金毛");
myDog.speak();  // 继承自Animal
myDog.bark();   // Dog自己的方法

// ES6 Class 继承
class AnimalClass {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} 发出声音`);
    }
    
    // 静态方法
    static info() {
        console.log("动物类");
    }
}

class DogClass extends AnimalClass {
    constructor(name, breed) {
        super(name);  // 调用父类构造函数
        this.breed = breed;
    }
    
    bark() {
        console.log(`${this.name} 汪汪叫`);
    }
    
    // 重写父类方法
    speak() {
        super.speak();  // 调用父类方法
        console.log("并且摇尾巴");
    }
}

const dog2 = new DogClass("小黑", "泰迪");
dog2.speak();
DogClass.info();
```

---

## 五、数组
### 5.1 数组创建与操作

```javascript
// 创建数组
let arr1 = [1, 2, 3, 4, 5];                    // 数组字面量
let arr2 = new Array(5);                       // 长度为5的空数组
let arr3 = new Array(1, 2, 3, 4, 5);           // 带初始值
let arr4 = Array.from("hello");                // ["h","e","l","l","o"]
let arr5 = Array.of(1, 2, 3);                  // [1, 2, 3]

// 访问元素
let arr = [10, 20, 30, 40, 50];
console.log(arr[0]);      // 10
console.log(arr.at(-1));  // 50 (ES2022，负数索引)
console.log(arr.length);  // 5

// 修改数组
arr[1] = 25;              // 修改元素
arr.length = 3;           // 截断数组
arr.length = 10;          // 扩展数组

// 多维数组
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
console.log(matrix[1][2]);  // 6
```

### 5.2 数组方法
1.  **修改原数组的方法**

    ```javascript
    let arr = [1, 2, 3, 4, 5];

    // push/pop: 末尾添加/删除
    arr.push(6);        // [1,2,3,4,5,6]
    arr.pop();          // [1,2,3,4,5]

    // unshift/shift: 开头添加/删除
    arr.unshift(0);     // [0,1,2,3,4,5]
    arr.shift();        // [1,2,3,4,5]

    // splice: 添加/删除/替换
    arr.splice(1, 0, 1.5);     // 在索引1处插入1.5
    arr.splice(2, 1);          // 删除索引2的元素
    arr.splice(1, 2, 2, 3);    // 从索引1开始，删除2个元素，插入2,3

    // reverse: 反转
    arr.reverse();      // [5,4,3,2,1]

    // sort: 排序
    arr.sort((a, b) => a - b);  // 数字升序
    arr.sort((a, b) => b - a);  // 数字降序

    // fill: 填充
    arr.fill(0, 1, 3);  // 从索引1到3填充0

    // copyWithin: 复制
    arr.copyWithin(0, 3, 5);  // 将索引3-5复制到索引0
    ```

2.  **不修改原数组的方法**

    ```javascript
    let arr = [1, 2, 3, 4, 5];

    // concat: 合并
    let newArr = arr.concat([6, 7, 8]);

    // slice: 切片
    let part = arr.slice(1, 4);  // [2,3,4]

    // join: 连接为字符串
    let str = arr.join("-");  // "1-2-3-4-5"

    // indexOf/lastIndexOf: 查找索引
    let idx = arr.indexOf(3);     // 2
    let lastIdx = arr.lastIndexOf(3);

    // includes: 是否包含
    let has = arr.includes(3);    // true

    // find/findIndex: 查找元素/索引
    let found = arr.find(x => x > 3);      // 4
    let foundIdx = arr.findIndex(x => x > 3);  // 3

    // filter: 过滤
    let filtered = arr.filter(x => x % 2 === 0);  // [2,4]

    // map: 映射
    let mapped = arr.map(x => x * 2);  // [2,4,6,8,10]

    // reduce/reduceRight: 归约
    let sum = arr.reduce((total, num) => total + num, 0);  // 15
    let product = arr.reduceRight((total, num) => total * num, 1);

    // some/every: 条件判断
    let hasEven = arr.some(x => x % 2 === 0);  // true
    let allEven = arr.every(x => x % 2 === 0); // false

    // flat: 扁平化
    let nested = [1, [2, [3, [4]]]];
    let flat1 = nested.flat();      // [1, 2, [3, [4]]]
    let flat2 = nested.flat(2);     // [1, 2, 3, [4]]
    let flat3 = nested.flat(Infinity);  // [1, 2, 3, 4]

    // flatMap: 先map后flat
    let result = arr.flatMap(x => [x, x * 2]);  // [1,2,2,4,3,6,...]
    ```

### 5.3 数组迭代

```javascript
let arr = [1, 2, 3, 4, 5];

// forEach: 遍历
arr.forEach((value, index, array) => {
    console.log(`arr[${index}] = ${value}`);
});

// for...of: 遍历值
for (let value of arr) {
    console.log(value);
}

// for...in: 遍历索引（不推荐用于数组）
for (let index in arr) {
    console.log(index, arr[index]);
}

// entries/keys/values: 迭代器
for (let [index, value] of arr.entries()) {
    console.log(index, value);
}

for (let key of arr.keys()) {
    console.log(key);
}

for (let value of arr.values()) {
    console.log(value);
}
```

---

## 六、字符串
### 6.1 字符串创建与操作

```javascript
// 创建字符串
let str1 = "Hello World";
let str2 = 'Hello World';
let str3 = `Hello World`;  // 模板字符串
let str4 = String(123);    // "123"
let str5 = new String("Hello");  // String对象

// 访问字符
let str = "JavaScript";
console.log(str[0]);        // "J"
console.log(str.charAt(0)); // "J"
console.log(str.at(-1));    // "t" (ES2022)
console.log(str.charCodeAt(0));  // 74 (Unicode)

// 字符串长度
console.log(str.length);    // 10

// 字符串不可变性
str[0] = "j";  // 不会修改原字符串
console.log(str);  // 还是 "JavaScript"
```

### 6.2 字符串方法

```javascript
let str = "Hello World, Welcome to JavaScript!";

// 查找
str.indexOf("World");      // 6
str.lastIndexOf("o");      // 8
str.search(/World/);       // 6
str.includes("World");     // true
str.startsWith("Hello");   // true
str.endsWith("!");         // true
str.match(/[A-Z]/g);       // ["H","W","J"]

// 提取
str.slice(6, 11);         // "World"
str.substring(6, 11);     // "World"
str.substr(6, 5);         // "World"

// 修改
str.toLowerCase();        // 转小写
str.toUpperCase();        // 转大写
str.replace("World", "Universe");  // 替换
str.replaceAll("o", "0");          // 替换所有
str.concat(" Goodbye!");  // 连接
str.trim();              // 去除首尾空格
str.trimStart();         // 去除开头空格
str.trimEnd();           // 去除结尾空格
str.padStart(20, "*");   // 前面填充
str.padEnd(20, "*");     // 后面填充
str.repeat(3);           // 重复

// 分割
str.split(" ");          // ["Hello","World,","Welcome","to","JavaScript!"]
str.split("");           // 分割为字符数组
str.split(/\s+/);        // 正则分割

// 模板字符串
let name = "张三";
let age = 25;
let greeting = `你好，我是${name}，今年${age}岁。`;
let multiLine = `
    第一行
    第二行
    第三行
`;
```

### 6.3 标签模板

```javascript
function highlight(strings, ...values) {
    let result = "";
    strings.forEach((string, i) => {
        result += string;
        if (i < values.length) {
            result += `<span class="highlight">${values[i]}</span>`;
        }
    });
    return result;
}

let name = "张三";
let age = 25;
let html = highlight`你好，我是${name}，今年${age}岁。`;
console.log(html);
// 你好，我是<span class="highlight">张三</span>，今年<span class="highlight">25</span>岁。
```

---

## 七、日期与时间
### 7.1 Date 对象

```javascript
// 创建日期
let now = new Date();                    // 当前时间
let date1 = new Date(2024, 0, 15);       // 2024年1月15日
let date2 = new Date("2024-01-15");      // 字符串解析
let date3 = new Date(1705276800000);     // 时间戳
let date4 = new Date(Date.UTC(2024, 0, 15));  // UTC时间

// 获取日期组件
let d = new Date();
d.getFullYear();    // 年
d.getMonth();       // 月 (0-11)
d.getDate();        // 日 (1-31)
d.getDay();         // 星期 (0-6)
d.getHours();       // 时
d.getMinutes();     // 分
d.getSeconds();     // 秒
d.getMilliseconds();// 毫秒
d.getTime();        // 时间戳
d.getTimezoneOffset();  // 时区偏移（分钟）

// UTC版本
d.getUTCFullYear();
d.getUTCMonth();
// ...其他UTC方法

// 设置日期组件
d.setFullYear(2025);
d.setMonth(5);      // 6月
d.setDate(20);
d.setHours(15, 30, 0);  // 15:30:00
d.setTime(1705276800000);
```

### 7.2 日期格式化

```javascript
let date = new Date();

// 本地化字符串
date.toLocaleString();      // 本地日期时间
date.toLocaleDateString();  // 本地日期
date.toLocaleTimeString();  // 本地时间

// 格式化选项
let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
};
date.toLocaleString('zh-CN', options);

// ISO格式
date.toISOString();        // 2024-01-15T08:00:00.000Z
date.toJSON();             // 同toISOString

// 其他格式
date.toString();           // 本地时区的完整字符串
date.toDateString();       // 日期部分
date.toTimeString();       // 时间部分
date.toUTCString();        // UTC时区的字符串
date.toGMTString();        // GMT时区的字符串

// 时间戳
Date.now();                // 当前时间戳
date.getTime();            // 该日期的时间戳
date.valueOf();            // 同getTime
+date;                     // 转换为数字（时间戳）

// 日期运算
let date1 = new Date(2024, 0, 1);
let date2 = new Date(2024, 0, 15);
let diff = date2 - date1;  // 毫秒差
let days = diff / (1000 * 60 * 60 * 24);  // 天数差
```

---

## 八、数学计算
### 8.1 Math 对象

```javascript
// 常数
Math.PI;         // π
Math.E;          // 自然对数的底
Math.LN2;        // 2的自然对数
Math.LN10;       // 10的自然对数
Math.LOG2E;      // 以2为底e的对数
Math.LOG10E;     // 以10为底e的对数
Math.SQRT2;      // 2的平方根
Math.SQRT1_2;    // 1/2的平方根

// 取整
Math.round(4.7);   // 5 (四舍五入)
Math.round(4.4);   // 4
Math.ceil(4.1);    // 5 (向上取整)
Math.floor(4.9);   // 4 (向下取整)
Math.trunc(4.9);   // 4 (去掉小数)
Math.trunc(-4.9);  // -4

// 符号
Math.sign(5);      // 1
Math.sign(-5);     // -1
Math.sign(0);      // 0
Math.sign(-0);     // -0
Math.sign(NaN);    // NaN

// 最值
Math.max(1, 2, 3, 4, 5);  // 5
Math.min(1, 2, 3, 4, 5);  // 1
Math.max(...[1, 2, 3, 4, 5]);  // 展开运算符

// 随机数
Math.random();                     // 0-1之间的随机数
Math.floor(Math.random() * 100);   // 0-99的随机整数
Math.floor(Math.random() * 101);   // 0-100的随机整数

// 指数对数
Math.pow(2, 3);      // 8 (2³)
Math.sqrt(16);       // 4 (平方根)
Math.cbrt(27);       // 3 (立方根)
Math.exp(1);         // e¹
Math.log(Math.E);    // 1 (自然对数)
Math.log10(100);     // 2 (以10为底)
Math.log2(8);        // 3 (以2为底)

// 三角函数
Math.sin(Math.PI / 6);    // 0.5
Math.cos(Math.PI / 3);    // 0.5
Math.tan(Math.PI / 4);    // 1
Math.asin(0.5);           // π/6
Math.acos(0.5);           // π/3
Math.atan(1);             // π/4
Math.atan2(1, 1);         // π/4 (y, x)

// 双曲函数
Math.sinh(0);    // 0
Math.cosh(0);    // 1
Math.tanh(0);    // 0

// 绝对值
Math.abs(-5.5);  // 5.5
```

### 8.2 数值方法

```javascript
let num = 123.45678;

// 转换为字符串
num.toString();        // "123.45678"
num.toString(2);       // 二进制
num.toString(8);       // 八进制
num.toString(16);      // 十六进制
num.toFixed(2);        // "123.46" (保留2位小数)
num.toExponential(2);  // "1.23e+2" (科学计数法)
num.toPrecision(5);    // "123.46" (保留5位有效数字)

// 数值检查
Number.isFinite(123);      // true
Number.isFinite(Infinity); // false
Number.isFinite(NaN);      // false
Number.isFinite("123");    // false

Number.isInteger(123);     // true
Number.isInteger(123.5);   // false
Number.isInteger("123");   // false

Number.isNaN(NaN);         // true
Number.isNaN("NaN");       // false
Number.isNaN(123);         // false

Number.isSafeInteger(123);           // true
Number.isSafeInteger(2 ** 53);       // false
Number.isSafeInteger(2 ** 53 - 1);   // true

// 数值转换
Number.parseInt("123px");    // 123
Number.parseFloat("3.14em"); // 3.14
Number("123");               // 123
+"123";                      // 123

// 极值
Number.MAX_VALUE;         // 最大正数
Number.MIN_VALUE;         // 最小正数
Number.MAX_SAFE_INTEGER;  // 最大安全整数
Number.MIN_SAFE_INTEGER;  // 最小安全整数
Number.EPSILON;           // 机器精度
Number.POSITIVE_INFINITY; // 正无穷
Number.NEGATIVE_INFINITY; // 负无穷
```

---

## 九、正则表达式
### 9.1 正则表达式创建

```javascript
// 1. 字面量
let regex1 = /pattern/flags;

// 2. 构造函数
let regex2 = new RegExp("pattern", "flags");

// 示例
let pattern1 = /hello/i;                  // 忽略大小写
let pattern2 = /\d+/g;                    // 全局匹配数字
let pattern3 = new RegExp("world", "gi"); // 全局忽略大小写
let pattern4 = new RegExp("\\d+", "g");   // 转义反斜杠
```

### 9.2 正则表达式模式

```javascript
// 字符类
let regex1 = /[aeiou]/;       // 任意元音字母
let regex2 = /[^aeiou]/;      // 非元音字母
let regex3 = /[a-z]/;         // 小写字母
let regex4 = /[A-Z]/;         // 大写字母
let regex5 = /[0-9]/;         // 数字
let regex6 = /[a-zA-Z0-9]/;   // 字母数字
let regex7 = /\w/;            // 单词字符 [a-zA-Z0-9_]
let regex8 = /\W/;            // 非单词字符
let regex9 = /\d/;            // 数字 [0-9]
let regex10 = /\D/;           // 非数字
let regex11 = /\s/;           // 空白字符
let regex12 = /\S/;           // 非空白字符
let regex13 = /./;            // 除换行外任意字符
let regex14 = /\./;           // 点字符本身

// 量词
let regex15 = /a?/;           // 0或1次
let regex16 = /a*/;           // 0次或多次
let regex17 = /a+/;           // 1次或多次
let regex18 = /a{3}/;         // 3次
let regex19 = /a{3,}/;        // 3次或更多
let regex20 = /a{3,5}/;       // 3到5次
let regex21 = /a+?/;          // 惰性匹配（最少次数）

// 位置匹配
let regex22 = /^hello/;       // 以hello开头
let regex23 = /world$/;       // 以world结尾
let regex24 = /\bword\b/;     // 单词边界
let regex25 = /\Bword\B/;     // 非单词边界
let regex26 = /(?=abc)/;      // 正向先行断言
let regex27 = /(?!abc)/;      // 负向先行断言
let regex28 = /(?<=abc)/;     // 正向后行断言
let regex29 = /(?<!abc)/;     // 负向后行断言

// 分组
let regex30 = /(ab)+/;        // 捕获分组
let regex31 = /(?:ab)+/;      // 非捕获分组
let regex32 = /(?<name>ab)+/; // 命名捕获分组
```

### 9.3 正则表达式方法

```javascript
let str = "Hello World, hello JavaScript!";
let pattern = /hello/gi;

// test: 测试是否匹配
pattern.test(str);  // true

// exec: 执行匹配
let result = pattern.exec(str);
while (result) {
    console.log(result[0], result.index);
    result = pattern.exec(str);
}

// match: 字符串匹配
let matches = str.match(pattern);  // ["Hello", "hello"]
let matchAll = str.matchAll(pattern);  // 迭代器

// search: 搜索位置
let pos = str.search(pattern);  // 0

// replace: 替换
let newStr = str.replace(pattern, "Hi");  // "Hi World, Hi JavaScript!"
let newStr2 = str.replace(pattern, (match) => match.toUpperCase());

// split: 分割
let parts = str.split(/\W+/);  // ["Hello", "World", "hello", "JavaScript", ""]
```

---

## 十、异步编程
### 10.1 回调函数

```javascript
function fetchData(callback) {
    setTimeout(() => {
        const data = { name: "张三", age: 25 };
        callback(null, data);  // 第一个参数是错误，第二个是数据
    }, 1000);
}

fetchData((error, data) => {
    if (error) {
        console.error("错误:", error);
    } else {
        console.log("数据:", data);
    }
});

// 回调地狱示例
function asyncTask1(callback) {
    setTimeout(() => callback(null, "结果1"), 1000);
}

function asyncTask2(input, callback) {
    setTimeout(() => callback(null, input + " 结果2"), 1000);
}

function asyncTask3(input, callback) {
    setTimeout(() => callback(null, input + " 结果3"), 1000);
}

asyncTask1((err, res1) => {
    if (err) return console.error(err);
    asyncTask2(res1, (err, res2) => {
        if (err) return console.error(err);
        asyncTask3(res2, (err, res3) => {
            if (err) return console.error(err);
            console.log("最终结果:", res3);
        });
    });
});
```

### 10.2 Promise

```javascript
// 创建Promise
const promise = new Promise((resolve, reject) => {
    // 异步操作
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
            resolve("操作成功");
        } else {
            reject(new Error("操作失败"));
        }
    }, 1000);
});

// 使用Promise
promise
    .then(result => {
        console.log("成功:", result);
        return result + "!";
    })
    .then(processedResult => {
        console.log("处理后的结果:", processedResult);
    })
    .catch(error => {
        console.error("失败:", error.message);
    })
    .finally(() => {
        console.log("操作完成");
    });

// Promise静态方法
Promise.resolve(42);  // 创建已解决的Promise
Promise.reject(new Error("失败"));  // 创建已拒绝的Promise

// Promise.all: 所有成功
Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
]).then(results => {
    console.log(results);  // [1, 2, 3]
}).catch(error => {
    console.error(error);
});

// Promise.race: 第一个完成
Promise.race([
    new Promise(resolve => setTimeout(() => resolve(1), 1000)),
    new Promise(resolve => setTimeout(() => resolve(2), 500))
]).then(first => {
    console.log("第一个完成:", first);  // 2
});

// Promise.allSettled: 所有都完成
Promise.allSettled([
    Promise.resolve(1),
    Promise.reject(new Error("失败")),
    Promise.resolve(3)
]).then(results => {
    console.log(results);
});

// Promise.any: 第一个成功
Promise.any([
    Promise.reject(new Error("失败1")),
    Promise.resolve("成功1"),
    Promise.resolve("成功2")
]).then(first => {
    console.log("第一个成功:", first);  // "成功1"
});
```

### 10.3 async/await

```javascript
// async函数
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("获取数据失败:", error);
        throw error;
    }
}

// 使用async/await
async function processData() {
    try {
        console.log("开始获取数据...");
        const data = await fetchData();
        console.log("获取到数据:", data);
        
        // 并行处理
        const [result1, result2] = await Promise.all([
            processItem1(data),
            processItem2(data)
        ]);
        
        console.log("处理结果:", result1, result2);
        return { result1, result2 };
    } catch (error) {
        console.error("处理失败:", error);
    } finally {
        console.log("处理完成");
    }
}

// 立即执行
(async () => {
    await processData();
})();

// 在类中使用
class DataProcessor {
    async fetchAndProcess() {
        const data = await this.fetchData();
        return this.process(data);
    }
    
    async fetchData() {
        // 获取数据
    }
    
    process(data) {
        // 处理数据
    }
}
```

### 10.4 事件循环

```javascript
console.log("1: 同步代码开始");

setTimeout(() => {
    console.log("2: setTimeout 回调");
}, 0);

Promise.resolve().then(() => {
    console.log("3: Promise.then 回调");
});

queueMicrotask(() => {
    console.log("4: queueMicrotask 回调");
});

process.nextTick(() => {  // Node.js特有
    console.log("5: process.nextTick 回调");
});

console.log("6: 同步代码结束");

// 输出顺序:
// 1: 同步代码开始
// 6: 同步代码结束
// 5: process.nextTick 回调 (Node.js)
// 3: Promise.then 回调
// 4: queueMicrotask 回调
// 2: setTimeout 回调
```

---

## 十一、模块化
### 11.1 CommonJS (Node.js)

```javascript
// math.js
function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

// 导出
module.exports = {
    add,
    multiply
};

// 或者
exports.add = add;
exports.multiply = multiply;

// 默认导出
module.exports = add;

// ============================

// app.js
// 导入
const math = require('./math.js');
console.log(math.add(2, 3));  // 5

// 解构导入
const { add, multiply } = require('./math.js');

// 导入内置模块
const fs = require('fs');
const path = require('path');

// 导入第三方模块
const axios = require('axios');
```

### 11.2 ES6 Modules

```javascript
// math.mjs 或 <script type="module">
// 命名导出
export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

const PI = 3.14159;
export { PI };

// 默认导出
export default function divide(a, b) {
    return a / b;
}

// 重命名导出
export { add as sum };

// ============================

// app.mjs
// 导入命名导出
import { add, multiply, PI } from './math.mjs';
console.log(add(2, 3));  // 5

// 重命名导入
import { add as sum } from './math.mjs';

// 导入默认导出
import divide from './math.mjs';

// 导入所有
import * as math from './math.mjs';
console.log(math.add(2, 3));

// 动态导入
async function loadModule() {
    const module = await import('./math.mjs');
    console.log(module.add(2, 3));
}
```

### 11.3 模块加载

```html
<!-- 浏览器中使用ES6模块 -->
<script type="module">
    import { add } from './math.mjs';
    console.log(add(2, 3));
</script>

<!-- 延迟加载 -->
<script type="module" async src="./app.mjs"></script>
```

---

## 十二、错误处理
### 12.1 错误类型

```javascript
// 内置错误类型
new Error("普通错误");
new SyntaxError("语法错误");
new ReferenceError("引用错误");
new TypeError("类型错误");
new RangeError("范围错误");
new URIError("URI错误");
new EvalError("eval错误");
new AggregateError([error1, error2], "聚合错误");

// 自定义错误
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
        this.date = new Date();
    }
}
```

### 12.2 错误处理机制

```javascript
// try...catch...finally
try {
    // 可能抛出错误的代码
    let result = riskyOperation();
    console.log("结果:", result);
} catch (error) {
    // 处理错误
    if (error instanceof TypeError) {
        console.error("类型错误:", error.message);
    } else if (error instanceof RangeError) {
        console.error("范围错误:", error.message);
    } else {
        console.error("未知错误:", error);
        // 重新抛出
        throw error;
    }
} finally {
    // 无论是否出错都会执行
    console.log("清理资源");
    cleanup();
}

// 可选的catch绑定 (ES2019)
try {
    // 代码
} catch {
    // 不关心错误对象
    console.log("出错了");
}

// window.onerror (浏览器)
window.onerror = function(message, source, lineno, colno, error) {
    console.error("全局错误:", message, error);
    return true;  // 阻止默认错误处理
};

// window.addEventListener('error')
window.addEventListener('error', function(event) {
    console.error("捕获的错误:", event.error);
});

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', function(event) {
    console.error("未处理的Promise拒绝:", event.reason);
});

// Node.js错误处理
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});
```

### 12.3 最佳实践

```javascript
// 防御性编程
function safeParseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("JSON解析失败:", error.message);
        return null;  // 或返回默认值
    }
}

// 验证输入
function calculateArea(width, height) {
    if (typeof width !== 'number' || typeof height !== 'number') {
        throw new TypeError("宽度和高度必须是数字");
    }
    if (width <= 0 || height <= 0) {
        throw new RangeError("宽度和高度必须大于0");
    }
    return width * height;
}

// 错误边界 (React)
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        // 记录错误
        logErrorToService(error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return <h1>出错了</h1>;
        }
        return this.props.children;
    }
}
```

---

## 十三、浏览器API
### 13.1 DOM 操作

```javascript
// 获取元素
document.getElementById("myId");
document.querySelector(".myClass");
document.querySelectorAll("div");
document.getElementsByClassName("myClass");
document.getElementsByTagName("div");

// 创建元素
const div = document.createElement("div");
const text = document.createTextNode("Hello");
const fragment = document.createDocumentFragment();

// 修改元素
div.id = "myDiv";
div.className = "container";
div.classList.add("active");
div.classList.remove("inactive");
div.classList.toggle("hidden");
div.setAttribute("data-id", "123");
div.getAttribute("data-id");
div.removeAttribute("data-id");
div.style.color = "red";
div.style.backgroundColor = "#fff";
div.textContent = "文本内容";
div.innerHTML = "<span>HTML内容</span>";

// 添加/移除元素
parent.appendChild(child);
parent.insertBefore(newNode, referenceNode);
parent.replaceChild(newNode, oldNode);
parent.removeChild(child);
child.remove();

// 遍历DOM
parent.children;
parent.firstElementChild;
parent.lastElementChild;
parent.previousElementSibling;
parent.nextElementSibling;
element.parentElement;
element.closest(".selector");

// 事件
element.addEventListener("click", handler, options);
element.removeEventListener("click", handler);
element.dispatchEvent(new Event("click"));

// 事件委托
document.addEventListener("click", function(event) {
    if (event.target.matches(".btn")) {
        console.log("按钮被点击");
    }
});
```

### 13.2 BOM

```javascript
// window对象
window.innerWidth;      // 视口宽度
window.innerHeight;     // 视口高度
window.outerWidth;      // 窗口宽度
window.outerHeight;     // 窗口高度
window.screenX;         // 窗口X坐标
window.screenY;         // 窗口Y坐标
window.scrollX;         // 水平滚动
window.scrollY;         // 垂直滚动
window.location;        // 地址信息
window.navigator;       // 浏览器信息
window.history;         // 历史记录
window.localStorage;    // 本地存储
window.sessionStorage;  // 会话存储
window.console;         // 控制台
window.alert("消息");   // 警告框
window.confirm("确认?");// 确认框
window.prompt("输入");  // 输入框
window.open(url, name, specs);  // 打开窗口
window.close();         // 关闭窗口
window.setTimeout(callback, delay);
window.setInterval(callback, delay);
window.requestAnimationFrame(callback);

// location对象
location.href;          // 完整URL
location.protocol;      // 协议
location.host;          // 主机和端口
location.hostname;      // 主机名
location.port;          // 端口
location.pathname;      // 路径
location.search;        // 查询参数
location.hash;          // 锚点
location.origin;        // 源
location.assign(url);   // 跳转
location.replace(url);  // 替换（无历史记录）
location.reload();      // 重新加载

// navigator对象
navigator.userAgent;    // 用户代理
navigator.platform;     // 平台
navigator.language;     // 语言
navigator.languages;    // 支持的语言
navigator.cookieEnabled;// Cookie是否启用
navigator.onLine;       // 是否在线
navigator.geolocation;  // 地理位置
navigator.mediaDevices; // 媒体设备
navigator.clipboard;    // 剪贴板
```

### 13.3 存储

```javascript
// localStorage
localStorage.setItem("key", "value");
let value = localStorage.getItem("key");
localStorage.removeItem("key");
localStorage.clear();
let length = localStorage.length;
let key = localStorage.key(0);

// sessionStorage
sessionStorage.setItem("key", "value");
let data = sessionStorage.getItem("key");

// Cookie
document.cookie = "name=value; max-age=3600; path=/; secure; samesite=strict";
document.cookie = "user=john; expires=" + new Date(Date.now() + 86400000).toUTCString();

// IndexedDB
let request = indexedDB.open("myDatabase", 1);
request.onupgradeneeded = function(event) {
    let db = event.target.result;
    let store = db.createObjectStore("users", { keyPath: "id" });
    store.createIndex("name", "name", { unique: false });
};
request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction("users", "readwrite");
    let store = transaction.objectStore("users");
    store.add({ id: 1, name: "张三", age: 25 });
};
```

### 13.4 网络请求

```javascript
// XMLHttpRequest
let xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.example.com/data", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log(JSON.parse(xhr.responseText));
        } else {
            console.error("请求失败:", xhr.status);
        }
    }
};
xhr.send();

// Fetch API
fetch("https://api.example.com/data", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    },
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin"
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
    }
    return response.json();
})
.then(data => console.log(data))
.catch(error => console.error("错误:", error));

// Fetch with async/await
async function fetchData() {
    try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("错误:", error);
    }
}

// Fetch上传文件
async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });
    return response.json();
}

// WebSocket
const socket = new WebSocket("wss://example.com/socket");
socket.onopen = function(event) {
    console.log("连接已打开");
    socket.send("Hello Server!");
};
socket.onmessage = function(event) {
    console.log("收到消息:", event.data);
};
socket.onclose = function(event) {
    console.log("连接已关闭:", event.code, event.reason);
};
socket.onerror = function(error) {
    console.error("WebSocket错误:", error);
};
```

---

## 十四、Node.js
### 14.1 核心模块

```javascript
// fs 文件系统
const fs = require('fs');
const fsPromises = require('fs').promises;

// 同步读取
const data = fs.readFileSync('file.txt', 'utf8');

// 异步读取
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Promise版本
async function readFile() {
    try {
        const data = await fsPromises.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// 写文件
fs.writeFile('file.txt', '内容', err => {
    if (err) throw err;
});

// 路径处理
const path = require('path');
path.join(__dirname, 'file.txt');
path.resolve('src', 'file.txt');
path.basename('/path/to/file.txt');  // file.txt
path.dirname('/path/to/file.txt');   // /path/to
path.extname('file.txt');            // .txt
path.parse('/path/to/file.txt');

// 操作系统信息
const os = require('os');
os.platform();      // 平台
os.arch();          // 架构
os.cpus();          // CPU信息
os.totalmem();      // 总内存
os.freemem();       // 空闲内存
os.homedir();       // 家目录
os.hostname();      // 主机名

// 事件触发器
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (arg) => {
    console.log('事件触发:', arg);
});
myEmitter.emit('event', '参数');

// 流
const { Readable, Writable, Transform, Duplex } = require('stream');
const { pipeline } = require('stream/promises');
```

### 14.2 HTTP 服务器

```javascript
const http = require('http');
const https = require('https');
const url = require('url');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 解析URL
    const parsedUrl = url.parse(req.url, true);
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // 处理不同路由
    if (parsedUrl.pathname === '/api/data' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Hello World' }));
    } else if (parsedUrl.pathname === '/api/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            res.statusCode = 201;
            res.end(JSON.stringify({ id: 1, ...data }));
        });
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});

// HTTPS服务器
const httpsServer = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, (req, res) => {
    res.end('HTTPS服务器');
});
httpsServer.listen(443);
```

### 14.3 Express 框架

```javascript
const express = require('express');
const app = express();

// 中间件
app.use(express.json());  // 解析JSON
app.use(express.urlencoded({ extended: true }));  // 解析表单
app.use(express.static('public'));  // 静态文件
app.use(cors());  // CORS
app.use(helmet());  // 安全头
app.use(morgan('dev'));  // 日志

// 路由
app.get('/', (req, res) => {
    res.send('首页');
});

app.get('/api/users', (req, res) => {
    res.json([{ id: 1, name: '张三' }]);
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ id: userId, name: '张三' });
});

app.post('/api/users', (req, res) => {
    const userData = req.body;
    res.status(201).json({ id: 1, ...userData });
});

app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    res.json({ id: userId, ...userData });
});

app.delete('/api/users/:id', (req, res) => {
    res.status(204).end();
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器错误' });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ error: '未找到' });
});

app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});
```

---

## 十五、现代 JavaScript
### 15.1 ES6+ 新特性

```javascript
// 1. 解构赋值
const [a, b, ...rest] = [1, 2, 3, 4, 5];
const { name, age, ...other } = { name: "张三", age: 25, city: "北京" };

// 2. 扩展运算符
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

// 3. 可选链操作符 ?.
const user = {};
const street = user?.address?.street;  // undefined

// 4. 空值合并运算符 ??
const value = null ?? "默认值";  // "默认值"
const value2 = 0 ?? "默认值";    // 0

// 5. 逻辑赋值运算符
let x = null;
x ||= "默认值";  // x = x || "默认值"
x &&= "新值";    // x = x && "新值"
x ??= "默认值";  // x = x ?? "默认值"

// 6. 全局 this
globalThis.setTimeout(() => {}, 1000);

// 7. 私有字段
class Person {
    #privateField = "私有";
    #privateMethod() {
        return this.#privateField;
    }
}

// 8. 静态字段和方法
class MathUtils {
    static PI = 3.14159;
    static add(a, b) {
        return a + b;
    }
}

// 9. 顶层 await
const data = await fetchData();

// 10. 正则表达式增强
const regex = /(?<year>\d{4})-(?<month>\d{2})/;
const match = "2024-01".match(regex);
console.log(match.groups.year);  // 2024
```

### 15.2 TypeScript

```typescript
// 基本类型
let name: string = "张三";
let age: number = 25;
let isStudent: boolean = true;
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["张三", 25];
let anyValue: any = "任意类型";
let unknownValue: unknown = "未知类型";
let nullValue: null = null;
let undefinedValue: undefined = undefined;
let voidValue: void = undefined;
let neverValue: never = (() => { throw new Error() })();

// 接口
interface Person {
    name: string;
    age: number;
    readonly id: number;
    email?: string;
    [key: string]: any;  // 索引签名
}

// 类型别名
type Point = {
    x: number;
    y: number;
};

// 泛型
function identity<T>(arg: T): T {
    return arg;
}

// 类
class Student {
    private id: number;
    public name: string;
    protected grade: number;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
```

### 15.3 装饰器

```javascript
// 类装饰器
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

// 方法装饰器
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

class Person {
    @enumerable(false)
    greet() {
        console.log("Hello");
    }
}
```

### 15.4 Proxy 和 Reflect

```javascript
// Proxy
const target = {
    message: "hello, world"
};

const handler = {
    get: function(obj, prop) {
        if (prop === "message") {
            return obj[prop] + "!";
        }
        return obj[prop];
    },
    set: function(obj, prop, value) {
        if (prop === "age" && typeof value !== "number") {
            throw new Error("年龄必须是数字");
        }
        obj[prop] = value;
        return true;
    }
};

const proxy = new Proxy(target, handler);
console.log(proxy.message);  // "hello, world!"

// Reflect
const obj = { x: 1, y: 2 };
console.log(Reflect.get(obj, "x"));  // 1
Reflect.set(obj, "z", 3);
console.log(obj);  // { x: 1, y: 2, z: 3 }
```

### 15.5 迭代器和生成器

```javascript
// 迭代器
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;

    const rangeIterator = {
        next: function() {
            let result;
            if (nextIndex < end) {
                result = { value: nextIndex, done: false };
                nextIndex += step;
                iterationCount++;
                return result;
            }
            return { value: iterationCount, done: true };
        }
    };
    return rangeIterator;
}

// 生成器
function* makeRangeGenerator(start = 0, end = Infinity, step = 1) {
    let iterationCount = 0;
    for (let i = start; i < end; i += step) {
        iterationCount++;
        yield i;
    }
    return iterationCount;
}

// 使用 for...of 遍历
for (let value of makeRangeGenerator(1, 5)) {
    console.log(value);  // 1, 2, 3, 4
}
```

### 15.6 异步迭代

```javascript
// 异步迭代器
async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
}

(async () => {
    for await (let value of asyncGenerator()) {
        console.log(value);  // 1, 2, 3
    }
})();
```

### 15.7 Web Workers

```javascript
// 主线程
const worker = new Worker('worker.js');
worker.postMessage('Hello Worker');
worker.onmessage = function(event) {
    console.log('来自Worker的消息:', event.data);
};
worker.onerror = function(error) {
    console.error('Worker错误:', error);
};

// worker.js
self.onmessage = function(event) {
    console.log('来自主线程的消息:', event.data);
    self.postMessage('Hello Main Thread');
};
```

### 15.8 性能优化

```javascript
// 1. 防抖
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 2. 节流
function throttle(func, wait) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            func.apply(this, args);
            lastTime = now;
        }
    };
}

// 3. 使用 requestAnimationFrame 优化动画
function animate() {
    // 动画逻辑
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 4. 使用 Web Workers 进行复杂计算
// 5. 使用 Virtual DOM 减少 DOM 操作
// 6. 代码分割和懒加载
```

---

## 十六、设计模式
### 16.1 创建型模式

```javascript
// 1. 单例模式
class Singleton {
    static instance = null;
    
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
        return this;
    }
}

// 2. 工厂模式
class Product {
    constructor(name) {
        this.name = name;
    }
}

class ProductFactory {
    createProduct(name) {
        return new Product(name);
    }
}

// 3. 建造者模式
class Car {
    constructor() {
        this.wheels = 4;
        this.color = 'white';
    }
}

class CarBuilder {
    constructor() {
        this.car = new Car();
    }
    
    setColor(color) {
        this.car.color = color;
        return this;
    }
    
    setWheels(wheels) {
        this.car.wheels = wheels;
        return this;
    }
    
    build() {
        return this.car;
    }
}
```

### 16.2 结构型模式

```javascript
// 1. 适配器模式
class OldSystem {
    oldRequest() {
        return "旧系统数据";
    }
}

class Adapter {
    constructor(oldSystem) {
        this.oldSystem = oldSystem;
    }
    
    request() {
        const result = this.oldSystem.oldRequest();
        return `适配后的数据: ${result}`;
    }
}

// 2. 装饰器模式
class Coffee {
    cost() {
        return 5;
    }
}

class MilkDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    
    cost() {
        return this.coffee.cost() + 2;
    }
}

// 3. 代理模式
class RealImage {
    display() {
        console.log("显示图片");
    }
}

class ProxyImage {
    constructor() {
        this.realImage = null;
    }
    
    display() {
        if (!this.realImage) {
            this.realImage = new RealImage();
        }
        this.realImage.display();
    }
}
```

### 16.3 行为型模式

```javascript
// 1. 观察者模式
class Subject {
    constructor() {
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class Observer {
    update(data) {
        console.log("收到数据:", data);
    }
}

// 2. 策略模式
class PaymentStrategy {
    pay(amount) {
        throw new Error("必须实现pay方法");
    }
}

class CreditCardStrategy extends PaymentStrategy {
    pay(amount) {
        console.log(`使用信用卡支付 ${amount} 元`);
    }
}

class AlipayStrategy extends PaymentStrategy {
    pay(amount) {
        console.log(`使用支付宝支付 ${amount} 元`);
    }
}

// 3. 命令模式
class Command {
    execute() {
        throw new Error("必须实现execute方法");
    }
}

class LightOnCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }
    
    execute() {
        this.light.turnOn();
    }
}
```

---

## 十七、测试
### 17.1 单元测试

```javascript
// 使用 Jest
// math.js
function add(a, b) {
    return a + b;
}

// math.test.js
test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
});

// 异步测试
test('fetch data', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
});

// 模拟函数
const mockCallback = jest.fn();
mockCallback.mockReturnValue(42);
expect(mockCallback()).toBe(42);
```

### 17.2 端到端测试

```javascript
// 使用 Cypress
describe('登录测试', () => {
    it('成功登录', () => {
        cy.visit('/login');
        cy.get('[data-test=username]').type('user');
        cy.get('[data-test=password]').type('pass');
        cy.get('[data-test=submit]').click();
        cy.url().should('include', '/dashboard');
    });
});
```

---

## 十八、打包和构建
### 18.1 Webpack

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    devServer: {
        static: './dist',
        hot: true,
    },
};
```

### 18.2 Babel

```javascript
// .babelrc
{
    "presets": [
        ["@babel/preset-env", {
            "targets": {
                "browsers": ["last 2 versions"]
            },
            "useBuiltIns": "usage",
            "corejs": 3
        }]
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime"
    ]
}
```

### 18.3 其他构建工具
1.  **Vite**：下一代前端构建工具
2.  **Rollup**：ES模块打包器
3.  **Parcel**：零配置打包器
4.  **esbuild**：极速打包器
5.  **SWC**：Rust编写的编译器

---

## 十九、框架和库
### 19.1 React

```javascript
// 组件
import React, { useState, useEffect } from 'react';

function MyComponent() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = `点击了 ${count} 次`;
    }, [count]);
    
    return (
        <div>
            <p>点击次数: {count}</p>
            <button onClick={() => setCount(count + 1)}>点击</button>
        </div>
    );
}
```

### 19.2 Vue

```javascript
// Vue 3
import { createApp, ref, onMounted } from 'vue';

const app = createApp({
    setup() {
        const count = ref(0);
        
        onMounted(() => {
            console.log('组件已挂载');
        });
        
        return {
            count,
            increment: () => count.value++
        };
    },
    template: `
        <div>
            <p>点击次数: {{ count }}</p>
            <button @click="increment">点击</button>
        </div>
    `
});
```

### 19.3 Angular

```typescript
// 组件
import { Component } from '@angular/core';

@Component({
    selector: 'app-my-component',
    template: `
        <div>
            <p>点击次数: {{ count }}</p>
            <button (click)="increment()">点击</button>
        </div>
    `
})
export class MyComponent {
    count = 0;
    
    increment() {
        this.count++;
    }
}
```

### 19.4 其他流行框架
1.  **Svelte**：编译时框架
2.  **Solid.js**：响应式框架
3.  **Preact**：轻量级 React
4.  **Next.js**：React 全栈框架
5.  **Nuxt.js**：Vue 全栈框架
6.  **Remix**：全栈 Web 框架
7.  **Astro**：静态站点生成器
8.  **Qwik**：可恢复框架

### 19.5 UI 库
1.  **Material-UI**：Material Design
2.  **Ant Design**：企业级 UI
3.  **Bootstrap**：响应式框架
4.  **Tailwind CSS**：工具类优先
5.  **Chakra UI**：可访问性组件
6.  **Element Plus**：Vue 3 组件库
7.  **PrimeReact**：丰富组件库

---

## 二十、工具链
### 20.1 包管理器
1.  **npm**：Node.js 默认包管理器
2.  **yarn**：快速可靠依赖管理
3.  **pnpm**：节省磁盘空间
4.  **Bun**：一体化工具链

### 20.2 代码质量工具
1.  **ESLint**：JavaScript 代码检查
2.  **Prettier**：代码格式化
3.  **Stylelint**：CSS 代码检查
4.  **TypeScript**：类型检查
5.  **Husky**：Git 钩子
6.  **lint-staged**：暂存文件检查
7.  **Commitlint**：提交信息检查

### 20.3 开发工具
1.  **VS Code**：代码编辑器
2.  **WebStorm**：IDE
3.  **Chrome DevTools**：浏览器调试
4.  **Postman**：API 测试
5.  **Fiddler**：网络调试
6.  **Charles**：代理工具
7.  **Docker**：容器化
8.  **Git**：版本控制

### 20.4 监控与性能
1.  **Lighthouse**：网站质量审计
2.  **WebPageTest**：性能测试
3.  **Sentry**：错误监控
4.  **New Relic**：应用性能监控
5.  **Datadog**：监控分析
6.  **LogRocket**：用户体验分析
7.  **Hotjar**：用户行为分析

---

## 二十一、学习资源
### 21.1 官方文档
*   **MDN Web Docs**：最全面的 JavaScript 文档
*   **ECMAScript 规范**：语言标准
*   **Node.js 文档**：服务器端 JavaScript
*   **TypeScript 文档**：类型安全的 JavaScript 超集
*   **V8 引擎文档**：底层实现
*   **TC39 提案**：新特性草案

### 21.2 在线学习
*   **freeCodeCamp**：免费编程课程
*   **Codecademy**：交互式学习
*   **JavaScript.info**：现代 JavaScript 教程
*   **Frontend Masters**：深度前端课程
*   **Udemy/Coursera**：付费课程
*   **Pluralsight**：技术课程
*   **Egghead.io**：短视频教程
*   **Scrimba**：交互式编码平台

### 21.3 书籍推荐
1.  **入门书籍**
    *   《JavaScript高级程序设计》（红宝书）
    *   《JavaScript DOM 编程艺术》
    *   《Head First JavaScript》
2.  **进阶书籍**
    *   《你不知道的 JavaScript》系列
    *   《JavaScript 语言精粹》
    *   《JavaScript 设计模式》
    *   《JavaScript 函数式编程》
3.  **框架书籍**
    *   《React 设计模式与最佳实践》
    *   《Vue.js 设计与实现》
    *   《Angular 权威教程》
4.  **底层书籍**
    *   《V8 引擎》
    *   《浏览器工作原理与实践》
    *   《WebKit 技术内幕》

### 21.4 社区与论坛
*   **Stack Overflow**：问题解答
*   **GitHub**：开源项目
*   **Reddit**：r/javascript, r/node, r/reactjs
*   **Dev.to**：开发者社区
*   **掘金/思否**：中文社区
*   **SegmentFault**：技术问答
*   **知乎**：技术讨论
*   **Twitter**：关注技术大佬

### 21.5 博客与资讯
*   **JavaScript Weekly**：每周通讯
*   **Node Weekly**：Node.js 通讯
*   **React Status**：React 资讯
*   **CSS-Tricks**：前端技巧
*   **Smashing Magazine**：Web 设计开发
*   **web.dev**：Google Web 开发
*   **Chrome Developers**：Chrome 开发者
*   **Mozilla Hacks**：Mozilla 技术博客

### 21.6 视频教程
*   **YouTube 频道**：
    *   Traversy Media
    *   Web Dev Simplified
    *   Fireship
    *   The Net Ninja
    *   Academind
    *   freeCodeCamp
*   **Bilibili 频道**：
    *   技术胖
    *   尚硅谷
    *   李立超
    *   黑马程序员
*   **会议视频**：
    *   JSConf
    *   React Conf
    *   Vue Conf
    *   Chrome Dev Summit

### 21.7 练习平台
*   **LeetCode**：算法练习
*   **Codewars**：编程挑战
*   **HackerRank**：技能测试
*   **Exercism**：编程练习
*   **Frontend Mentor**：前端项目
*   **Codepen Challenges**：创意编码
*   **CSS Battle**：CSS 挑战
*   **Advent of Code**：编程谜题

### 21.8 开发工具资源
*   **CodeSandbox**：在线编辑器
*   **StackBlitz**：在线 IDE
*   **Glitch**：快速原型
*   **Replit**：编程环境
*   **JSFiddle**：代码测试
*   **CodePen**：前端作品展示
*   **Can I Use**：兼容性查询
*   **BundlePhobia**：包大小分析
*   **npm trends**：包流行度

### 21.9 进阶方向
1.  **前端工程化**：构建工具、自动化
2.  **性能优化**：加载性能、运行时优化
3.  **跨端开发**：React Native, Flutter, Electron
4.  **微前端架构**：qiankun, single-spa
5.  **Serverless**：无服务器架构
6.  **WebAssembly**：高性能计算
7.  **低代码平台**：可视化开发
8.  **数据可视化**：D3.js, ECharts
9.  **游戏开发**：Three.js, Phaser
10. **人工智能**：TensorFlow.js, Brain.js
11. **区块链**：Web3.js, Ethers.js
12. **物联网**：Node-RED, Johnny-Five
13. **桌面应用**：Electron, Tauri
14. **移动应用**：React Native, Capacitor
15. **全栈开发**：前后端一体化

### 21.10 学习建议
1.  **从基础开始**：掌握核心概念，不要急于求成
2.  **实践为主**：多写代码，多做项目，从模仿开始
3.  **阅读源码**：学习优秀开源项目的代码结构
4.  **参与社区**：回答问题，参与讨论，分享知识
5.  **持续学习**：JavaScript 生态快速发展，保持更新
6.  **深入原理**：理解语言底层机制，不只会用
7.  **关注新特性**：ES 标准每年更新，学习新语法
8.  **全栈发展**：前后端都了解，拓宽技术栈
9.  **工具熟练**：掌握现代开发工具链
10. **建立作品集**：GitHub 项目，个人网站，技术博客
11. **软技能提升**：沟通能力，团队协作，项目管理
12. **专业深耕**：选择 1-2 个方向深入，成为专家
13. **知识体系化**：整理笔记，构建知识框架
14. **教学相长**：通过写作、演讲巩固知识
15. **保持热情**：对技术保持好奇心和探索欲

### 21.11 职业发展
1.  **初级工程师**：掌握基础，完成需求
2.  **中级工程师**：独立开发，技术选型
3.  **高级工程师**：架构设计，性能优化
4.  **技术专家**：技术攻关，创新研究
5.  **架构师**：系统设计，技术规划
6.  **技术经理**：团队管理，项目管理
7.  **CTO**：技术战略，团队建设
8.  **独立开发者**：产品开发，自由职业
9.  **技术作家**：文档编写，教程制作
10. **技术讲师**：培训授课，知识传播
11. **技术布道师**：技术推广，社区建设
12. **开源贡献者**：项目维护，社区贡献
13. **技术顾问**：方案咨询，架构评审
14. **创业者**：技术创业，产品实现
15. **研究员**：前沿技术，学术研究

### 21.12 认证与考试
1.  **JavaScript 开发者认证**：
    *   W3Schools JavaScript 认证
    *   freeCodeCamp JavaScript 认证
2.  **框架认证**：
    *   React 认证
    *   Vue.js 认证
    *   Angular 认证
3.  **全栈认证**：
    *   freeCodeCamp 全栈开发认证
    *   Microsoft 认证
4.  **云平台认证**：
    *   AWS 认证
    *   Azure 认证
    *   Google Cloud 认证
5.  **大学课程**：
    *   计算机科学相关专业
    *   在线学位课程

### 21.13 学习路线图
1.  **第一阶段：基础**（1-3个月）
    *   HTML/CSS/JavaScript 基础
    *   浏览器 API
    *   版本控制 Git
2.  **第二阶段：进阶**（3-6个月）
    *   ES6+ 新特性
    *   异步编程
    *   模块化
    *   包管理器
3.  **第三阶段：框架**（3-6个月）
    *   选择 1-2 个主流框架深入学习
    *   状态管理
    *   路由
    *   构建工具
4.  **第四阶段：全栈**（6-12个月）
    *   Node.js
    *   数据库
    *   REST API
    *   服务器部署
5.  **第五阶段：专业化**（持续）
    *   选择专业方向深入
    *   性能优化
    *   工程化
    *   架构设计
6.  **第六阶段：扩展**（持续）
    *   学习第二门后端语言
    *   移动端开发
    *   桌面端开发
    *   新兴技术探索