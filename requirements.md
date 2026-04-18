# 拼豆图纸网站（Perler Bead Web App）超强开发 Prompt（纯前端计算版）

你现在是一名资深全栈工程师 + 前端工程师 + 图像处理工程师。  
请为我生成一个**完整可运行的前端项目代码（Next.js）**。

⚠️ 核心要求：  
本项目是 **纯前端计算型网站** —— 所有“图片转拼豆图”逻辑必须在浏览器端完成，**不能依赖后端计算**。

---

# 一、项目核心架构（必须遵守）

本项目必须符合以下架构：

## ✅ 前端负责
- 图片上传（浏览器读取）
- 图像处理（Canvas + JS）
- 颜色量化
- 拼豆色号匹配
- grid 生成
- 拼图交互（高亮、标记完成等）
- 导出 PNG / JSON

## ✅ 服务器只负责
- 托管 Next.js 页面
- 返回静态资源（HTML / JS / CSS / JSON）

## ❌ 不允许
- 不允许依赖后端 API 做图片处理
- 不允许上传图片到服务器再计算
- 不需要数据库
- 不需要用户系统（MVP 阶段）

---

# 二、技术栈要求

- Next.js 14+（App Router）
- TypeScript
- Tailwind CSS
- Zustand（状态管理）
- Canvas（渲染 grid 和图像处理）
- 不使用后端 API（或仅用于静态数据）
- 项目应可直接部署到 Vercel

---

# 三、产品目标

请实现一个拼豆图纸网站，用户可以：

1. 浏览预置拼豆图纸
2. 上传自己的图片并在浏览器中转换成拼豆图
3. 在网站里进行交互式拼图辅助
4. 按颜色查看拼豆位置
5. 标记已完成的位置
6. 导出图纸数据与预览图

这个项目的重点不是普通图片展示，而是：

- **图片转拼豆图算法**
- **颜色映射到指定拼豆色库**
- **交互式拼图辅助体验**
- **完全浏览器本地计算**

---

# 四、核心功能

---

## 1. 首页

首页包含两个主入口：

### 模块 A：上传图片转拼豆图
用户可以：
- 上传图片
- 设置目标宽度（例如 16 / 32 / 48 / 64）
- 高度按原图比例自动计算
- 选择最大颜色数（例如 8 / 12 / 16 / 24 / 32）
- 点击按钮开始转换

### 模块 B：浏览预置图纸
展示一些内置图纸卡片：
- 标题
- 预览图
- 尺寸
- 点击后进入图纸详情页或编辑页

---

## 2. 图片转拼豆核心逻辑（必须全部在浏览器中实现）

### Step 1：读取上传图片
- 支持 png / jpg / jpeg / webp
- 做基本校验
- 限制文件大小，例如 10MB
- 使用 FileReader 或 URL.createObjectURL 在浏览器端读取

### Step 2：按目标宽度缩放
- 高度自动按原图比例计算
- 使用 Canvas 绘制缩放后的图像
- 最终形成一个 `width x height` 的像素网格

### Step 3：颜色简化 / 量化
要求：
- 必须让颜色数量受到 `maxColors` 控制
- 优先做一个**务实可运行版本**
- 不要求复杂 k-means，但结构必须可扩展

可接受的简化实现：
- 降低色彩分辨率（quantization by bucket）
- 或先从图中采样颜色，再做有限映射
- 或组合使用“粗量化 + 映射到色库”

### Step 4：映射到拼豆色库（关键点）
请在代码里内置一个默认拼豆色库。

每个色库颜色结构如下：

```ts
type BeadColor = {
  id: string;
  code: string;
  name: string;
  rgb: [number, number, number];
};
```

请内置至少 20 个基础颜色，例如：
- black
- white
- red
- orange
- yellow
- green
- blue
- purple
- pink
- brown
- gray
- skin-tone-light
- skin-tone-medium
- skin-tone-dark
- teal
- magenta
等

### Step 5：最近颜色匹配
请为每个像素找到最近的拼豆颜色。

先用 RGB 欧氏距离即可：

```ts
distance = (r1-r2)^2 + (g1-g2)^2 + (b1-b2)^2
```

请把这部分代码封装清楚，后续方便替换成 Lab / DeltaE。

### Step 6：生成标准结果
请输出统一数据结构：

```ts
type PatternData = {
  id?: string;
  title?: string;
  width: number;
  height: number;
  grid: string[][]; // colorId matrix
  palette: BeadColor[];
  usage: Record<string, number>; // colorId => count
  previewDataUrl?: string;
};
```

### Step 7：材料统计
必须统计每种颜色需要多少颗，并在 UI 中展示。

---

## 3. 图纸详情页 / 编辑页

这是最重要的页面。

进入后应展示：

### 左侧 / 上方区域
- 拼豆网格 Canvas
- 支持缩放
- 支持显示网格线
- 支持 hover 某个格子时显示坐标与颜色信息

### 右侧 / 下方区域
- 颜色列表
- 每种颜色显示：
  - 颜色块
  - 名称
  - 色号
  - 使用数量

---

## 4. 拼豆辅助模式（核心差异化功能，必须实现）

### 功能 A：按颜色高亮
- 用户点击某个颜色
- 画布中属于该颜色的格子高亮
- 其他颜色变暗（例如 opacity 降低，或覆盖半透明遮罩）

### 功能 B：只看当前颜色
- 提供一个 toggle
- 开启后只显示当前颜色
- 其他颜色显示为空白、淡色，或明显弱化

### 功能 C：显示 / 隐藏格子坐标
- 提供 toggle
- 打开后每个格子可显示小号坐标或编号（仅在足够放大时）

### 功能 D：显示 / 隐藏网格线
- 提供 toggle

### 功能 E：点击格子标记完成
- 用户可以点击格子，标记自己已经拼完
- 状态：
  - 未完成
  - 已完成
- 已完成格子应有明显视觉状态
- 再点一次可取消

### 功能 F：只看未完成的当前颜色
- 当选择某个颜色后，可筛选只显示该颜色中还未完成的位置
- 对真实拼图非常有帮助
- 这是优先级很高的功能，务必实现

### 功能 G：缩放
- 支持放大 / 缩小
- 支持重置缩放
- 缩放后点击与 hover 逻辑仍然正确

---

## 5. 导出功能

至少实现以下两个：

### 导出 JSON
- 导出当前图纸数据（PatternData）

### 导出 PNG
- 导出当前图纸预览图
- 可基于离屏 Canvas 或当前 Canvas 导出

如果有余力，再加：
- 导出打印版 PNG
- 导出 PDF

但前两个优先级最高。

---

## 6. 预置图纸

项目中请内置至少两个示例图纸：
- heart
- star

这些图纸放在静态 JSON 中，供首页和编辑器加载。

---

# 五、必须生成的项目结构

请严格按照这种结构输出代码：

```bash
perler-bead-app/
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ postcss.config.js
├─ tailwind.config.ts
├─ .eslintrc.json
├─ public/
│  ├─ manifest.json
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  └─ patterns/
│     ├─ heart.json
│     └─ star.json
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ globals.css
│  │  ├─ editor/
│  │  │  └─ page.tsx
│  │  ├─ patterns/
│  │  │  ├─ page.tsx
│  │  │  └─ [id]/
│  │  │     └─ page.tsx
│  │  └─ offline/
│  │     └─ page.tsx
│  ├─ components/
│  │  ├─ UploadPanel.tsx
│  │  ├─ PatternCanvas.tsx
│  │  ├─ PaletteSidebar.tsx
│  │  ├─ Toolbar.tsx
│  │  ├─ PatternCard.tsx
│  │  ├─ StatusBar.tsx
│  │  └─ PatternPreview.tsx
│  ├─ lib/
│  │  ├─ beadPalette.ts
│  │  ├─ color.ts
│  │  ├─ imageToPattern.ts
│  │  ├─ export.ts
│  │  ├─ localStorage.ts
│  │  ├─ samplePatterns.ts
│  │  └─ utils.ts
│  ├─ store/
│  │  └─ usePatternStore.ts
│  ├─ types/
│  │  └─ pattern.ts
│  ├─ hooks/
│  │  ├─ useCanvasRenderer.ts
│  │  └─ usePwaInstallPrompt.ts
│  └─ components/pwa/
│     └─ ServiceWorkerRegister.tsx
└─ README.md
```

---

# 六、每个文件应该做什么

请不要只创建空文件，请把每个文件都写成**可运行版本**。

## `src/types/pattern.ts`
定义所有核心类型：
- `BeadColor`
- `PatternData`
- `PatternCellState`
- `EditorSettings`
- `PatternSummary`

## `src/lib/beadPalette.ts`
内置默认拼豆色库。

## `src/lib/color.ts`
实现：
- RGB 距离函数
- 最近颜色匹配函数
- hex/rgb 转换辅助函数
- 颜色转 CSS 字符串函数

## `src/lib/imageToPattern.ts`
实现图片转拼豆图核心逻辑（全部浏览器端）：
- 读取图片
- resize
- 获取像素
- 颜色限制
- 映射到 palette
- 返回 `PatternData`

## `src/lib/export.ts`
实现：
- 导出 JSON
- 导出 PNG
- 下载文件的工具函数

## `src/lib/localStorage.ts`
实现：
- 保存当前 pattern
- 保存编辑器状态
- 恢复 pattern 和设置
- 需处理 SSR 场景，避免直接访问 `window` 报错

## `src/store/usePatternStore.ts`
使用 Zustand 管理：
- 当前 pattern
- 当前选中的颜色
- 已完成格子集合
- 是否只显示当前颜色
- 是否只显示当前颜色未完成格子
- 是否显示网格线
- 是否显示坐标
- 缩放倍率
- hover 信息
- actions

## `src/components/PatternCanvas.tsx`
最重要组件。要求：
- 使用 Canvas 渲染 grid
- 根据 store 中状态决定渲染效果
- 支持颜色高亮、非当前颜色变暗、完成状态渲染
- 支持点击格子切换完成状态
- 支持 hover 显示坐标和颜色信息
- 支持缩放
- 支持重绘优化
- 响应式适配

## `src/components/PaletteSidebar.tsx`
展示颜色列表，并可点击某个颜色进行高亮筛选。

## `src/components/Toolbar.tsx`
包含：
- 放大 / 缩小
- 重置缩放
- toggle 网格线
- toggle 坐标
- toggle 只显示当前颜色
- toggle 只显示未完成当前颜色
- 导出 JSON
- 导出 PNG
- 清空完成状态

## `src/components/UploadPanel.tsx`
实现上传交互表单：
- 文件选择
- 宽度选择
- 最大颜色数选择
- 浏览器端生成图纸
- 成功后进入编辑状态

## `src/components/PatternCard.tsx`
图纸卡片展示。

## `src/components/StatusBar.tsx`
显示：
- 当前 hover 坐标
- 当前颜色
- 当前缩放
- 图纸尺寸

## `src/components/PatternPreview.tsx`
生成小型预览图，可用于首页或图纸卡片。

## `src/hooks/useCanvasRenderer.ts`
封装部分 Canvas 绘制逻辑或坐标换算逻辑。

## `src/hooks/usePwaInstallPrompt.ts`
封装 PWA 安装提示逻辑（如可安装则给状态）。

## `src/components/pwa/ServiceWorkerRegister.tsx`
注册 service worker，保证 PWA 缓存可用。

## `src/app/page.tsx`
首页，整合上传面板和图纸入口。

## `src/app/editor/page.tsx`
编辑器页面，展示：
- Toolbar
- PatternCanvas
- PaletteSidebar
- StatusBar

## `src/app/patterns/page.tsx`
图纸列表页。

## `src/app/patterns/[id]/page.tsx`
加载某个预置图纸并进入编辑状态。

## `public/patterns/*.json`
给出至少两个示例图纸。

## `public/manifest.json`
提供基础 PWA manifest。

## `README.md`
必须写清楚：
- 安装命令
- 启动方式
- 构建方式
- 部署方式（Vercel）
- 项目结构说明
- 后续可扩展方向

---

# 七、UI 和交互要求

## 视觉风格
- 简洁
- 清晰
- 偏创作者工具
- 不要过度炫技
- 尽量像一个真实可用的 SaaS 小工具

## 布局建议

### 桌面端
- 左边：画布
- 右边：颜色侧边栏
- 顶部：工具栏

### 移动端
- 顶部工具栏横向滚动
- 画布居中
- 颜色栏放到底部抽屉或下方列表

## 交互细节
- 当前选中的颜色要有明显边框
- hover 的格子要有状态提示
- 空状态要处理好
- 上传中有 loading
- 转换失败要有错误提示
- 没有选中颜色时应有默认展示逻辑
- 编辑状态要尽量保存到 localStorage，刷新后尽量能恢复

---

# 八、PWA 要求（加分但希望实现）

项目应带基础 PWA 能力：

- `manifest.json`
- Service Worker 注册
- 静态资源缓存
- 弱网下基础页面可访问
- 首页与编辑器能离线打开最近一次缓存的内容更好

注意：
- 不需要非常复杂的离线同步
- 只需要做基础可安装、基础缓存即可
- 实现应尽量简单可运行，不要过度设计

---

# 九、代码质量要求

请生成的代码满足以下要求：

1. **不要只写伪代码**
2. **不要省略关键逻辑**
3. 所有 import/export 都要正确
4. 项目应尽量可以直接运行
5. TypeScript 类型尽量完整
6. 适当拆分函数，保证可维护性
7. 添加必要注释，但不要满屏废话注释
8. 优先保证 MVP 可运行，其次再追求高级优化
9. 所有浏览器专属 API 的使用要考虑 Next.js App Router 环境，避免 SSR 报错
10. 所有 Client Component 记得正确添加 `"use client"`

---

# 十、实现策略要求

请按下面顺序生成代码：

## 第一步：先输出完整项目目录树
## 第二步：逐个文件输出完整代码

每个文件请用下面格式：

```txt
// FILE: src/lib/color.ts
...代码...
```

不要把多个文件混在一个代码块里。  
请一个文件一个代码块清晰输出。

---

# 十一、算法实现要求（务实版）

请注意：我现在更需要一个**能跑起来的 MVP**，而不是学术上最完美的算法。

所以你应优先做到：

- 可上传
- 可转换
- 可显示
- 可高亮
- 可标记完成
- 可导出
- 可本地恢复状态

## 可以接受的简化
- 颜色量化可以先用较简单方法
- 最近颜色匹配先用 RGB 距离
- 不需要一开始就做抖动算法
- 不需要一开始就做 Lab / DeltaE

但代码结构必须可扩展，方便后面升级。

---

# 十二、额外增强项（有余力再做）

如果你有余力，可以额外加入：

1. localStorage 自动保存编辑状态
2. 支持从 URL 参数加载图纸
3. 支持下载打印版图纸
4. 支持键盘快捷键
5. 支持图纸预览缩略图生成
6. 支持自动推荐下一个颜色（按剩余数量排序）
7. 支持切换“完成状态”视觉样式

但这些都排在 MVP 之后。

---

# 十三、绝对不能忽略的重点

这个项目最核心的差异化功能是：

## 1. 当前颜色高亮
用户点某个颜色时：
- 该颜色的位置非常清晰
- 其他颜色明显变暗

## 2. 拼图进度标记
用户能一边看图一边点格子，标记已完成

## 3. 只看“当前颜色的未完成格子”
这个功能对真实用户非常实用，请务必做

## 4. 完全浏览器本地算图
不要偷换成后端接口计算  
必须让上传图片后在前端直接生成拼豆图

---

# 十四、最终输出格式要求

请直接开始生成：

1. 项目目录树
2. 所有文件代码
3. README

不要再重复需求分析，不要只讲思路。  
我要的是**完整代码生成结果**。

---

# 十五、默认示例色库

请先在代码中内置一个默认色库，例如：

```ts
export const DEFAULT_BEAD_PALETTE = [
  { id: "black", code: "C01", name: "Black", rgb: [30, 30, 30] },
  { id: "white", code: "C02", name: "White", rgb: [245, 245, 245] },
  { id: "red", code: "C03", name: "Red", rgb: [220, 40, 40] },
  { id: "pink", code: "C04", name: "Pink", rgb: [255, 140, 180] },
  { id: "orange", code: "C05", name: "Orange", rgb: [245, 140, 40] },
  { id: "yellow", code: "C06", name: "Yellow", rgb: [250, 220, 70] },
  { id: "light-green", code: "C07", name: "Light Green", rgb: [150, 210, 90] },
  { id: "green", code: "C08", name: "Green", rgb: [70, 160, 70] },
  { id: "light-blue", code: "C09", name: "Light Blue", rgb: [120, 190, 255] },
  { id: "blue", code: "C10", name: "Blue", rgb: [60, 110, 220] },
  { id: "purple", code: "C11", name: "Purple", rgb: [130, 80, 190] },
  { id: "brown", code: "C12", name: "Brown", rgb: [120, 75, 45] },
  { id: "gray", code: "C13", name: "Gray", rgb: [140, 140, 140] },
  { id: "dark-gray", code: "C14", name: "Dark Gray", rgb: [90, 90, 90] },
  { id: "cream", code: "C15", name: "Cream", rgb: [250, 235, 200] },
  { id: "skin-light", code: "C16", name: "Skin Light", rgb: [240, 200, 170] },
  { id: "skin-medium", code: "C17", name: "Skin Medium", rgb: [210, 160, 120] },
  { id: "skin-dark", code: "C18", name: "Skin Dark", rgb: [140, 95, 70] },
  { id: "teal", code: "C19", name: "Teal", rgb: [40, 150, 150] },
  { id: "magenta", code: "C20", name: "Magenta", rgb: [200, 60, 160] }
];
```

---

# 十六、示例图纸格式

请在 `public/patterns/heart.json` 和 `public/patterns/star.json` 中给出示例数据，格式如下：

```json
{
  "id": "heart",
  "title": "Heart",
  "width": 8,
  "height": 8,
  "grid": [
    ["white","red","red","white","white","red","red","white"],
    ["red","red","red","red","red","red","red","red"],
    ["red","red","red","red","red","red","red","red"],
    ["white","red","red","red","red","red","red","white"],
    ["white","white","red","red","red","red","white","white"],
    ["white","white","white","red","red","white","white","white"],
    ["white","white","white","white","white","white","white","white"],
    ["white","white","white","white","white","white","white","white"]
  ],
  "palette": ["white", "red"]
}
```

---

# 十七、部署要求

项目必须适合直接部署到 Vercel。

请在 README 中明确写出：
- 如何本地运行
- 如何 build
- 如何部署到 Vercel
- 为什么本项目不需要后端服务器
- 本项目的计算主要在浏览器端完成

---

# 十八、请优先避免的问题

请避免这些常见问题：

- 只给我部分文件
- 省略 package.json
- 省略样式文件
- Canvas 只画图但不能点击交互
- store 不完整
- 类型定义缺失
- 上传逻辑不可用
- 忘记处理 Client Component
- 在 SSR 环境直接调用 window / localStorage / FileReader / document
- 没有真正实现浏览器端图片处理逻辑

---

现在请直接开始生成完整项目代码。