# Project Status

本文档用于记录当前 `Lets-PingDou` 项目的实现状态、关键设计、已完成的改动、存在的差距，以及后续建议。下次继续开发时，优先先读这份文件，再读相关代码。

## 1. 项目定位

当前项目是一个基于 Next.js 14 App Router 的纯前端拼豆图纸工具，目标是：

- 用户可选择两种创建路径：
  - 自己创建空白图纸
  - 上传图片自动转换
- 在浏览器端完成图像转拼豆图或手动上色
- 进入图纸编辑器
- 按颜色高亮、标记完成、导出 JSON / PNG
- 尽量保留后续扩展到更强“图像处理工作台”的能力

当前仓库路径：

- `/Users/wwkong/Documents/Lets-PingDou`

参考项目路径：

- `/Users/wwkong/Documents/perler-beads-master`

本项目已经有意识地吸收了参考项目里一部分关键能力，但还没有完全达到参考项目那种“图像工作台”级别。

## 2. 当前已完成的核心能力

### 2.1 基础项目结构

已经搭建完整的 Next.js 前端项目，包括：

- App Router
- TypeScript
- Tailwind CSS
- Zustand
- 基础 PWA manifest + service worker
- 示例图纸和编辑器页面

关键文件：

- [package.json](/Users/wwkong/Documents/Lets-PingDou/package.json)
- [src/app/layout.tsx](/Users/wwkong/Documents/Lets-PingDou/src/app/layout.tsx)
- [src/app/page.tsx](/Users/wwkong/Documents/Lets-PingDou/src/app/page.tsx)
- [src/app/editor/page.tsx](/Users/wwkong/Documents/Lets-PingDou/src/app/editor/page.tsx)
- [src/app/patterns/page.tsx](/Users/wwkong/Documents/Lets-PingDou/src/app/patterns/page.tsx)

### 2.2 图片上传转图纸

当前上传流程已经支持：

- 图片上传：PNG / JPG / JPEG / WEBP
- 文件大小校验
- 纯浏览器端读取和处理
- 目标宽度设置
- 目标高度设置
  - 留空则按原图比例自动计算
  - 手动填写则可生成非正方形、非等比网格图纸
- 最大颜色数设置
- 取样模式：
  - `average`
  - `dominant`
- 多品牌色库选择：
  - `default`
  - `MARD`
  - `COCO`
  - `漫漫`
  - `盼盼`
  - `咪小窝`
- 颜色合并阈值设置

关键文件：

- [src/components/UploadPanel.tsx](/Users/wwkong/Documents/Lets-PinDou/src/components/UploadPanel.tsx)
- [src/lib/imageToPattern.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/imageToPattern.ts)

### 2.3 当前图像处理算法

当前算法并不是最简的“整图缩小后逐像素映射”，而是已经升级到更接近参考项目的结构：

1. 读入原图
2. 按目标网格 `width x height` 计算每个格子在原图中对应的区域
3. 为每个格子提取代表色
   - `average`: 区域平均色
   - `dominant`: 区域主导色
4. 对所有代表色做自适应量化，裁出 `maxColors`
5. 将量化结果映射到所选品牌色库
6. 生成最终图纸
7. 根据 `similarityThreshold` 再执行一次相似颜色合并

当前“颜色合并”是一个全局频率优先合并，不是参考项目里更复杂的 BFS 连通区域合并。也就是说：

- 当前实现：
  - 统计颜色出现频率
  - 高频颜色优先
  - 把 RGB 距离小于阈值的低频颜色合并到高频颜色
- 参考项目：
  - 更强调基于区域连通性的相似色块合并
  - 结果通常对“杂色清理”更稳定

关键文件：

- [src/lib/imageToPattern.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/imageToPattern.ts)
- [src/lib/color.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/color.ts)

### 2.4 多品牌色号系统

已经从参考项目复制并接入完整品牌色号映射表：

- 数据来源：
  - `/Users/wwkong/Documents/perler-beads-master/src/app/colorSystemMapping.json`
- 当前项目使用副本：
  - [src/lib/data/colorSystemMapping.json](/Users/wwkong/Documents/Lets-PingDou/src/lib/data/colorSystemMapping.json)

封装文件：

- [src/lib/colorSystems.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/colorSystems.ts)

当前实现方式：

- 从 `colorSystemMapping.json` 里读取 hex -> 多品牌 code 映射
- 动态生成目标品牌的 `BeadColor[]`
- 上传时可直接选择品牌色库

注意：

- 当前项目是“完整品牌色库直接参与映射”
- 还没有做“品牌内多套子色板（如 168 色 / 96 色 / 144 色）切换”
- 也还没有做“自定义可用色板”

### 2.5 编辑器基本能力

编辑器已具备：

- Canvas 渲染图纸
- 缩放
- 网格线开关
- 坐标显示开关
- hover 显示格子坐标和颜色信息
- 点击格子标记完成
- 选中颜色后点击格子直接上色（手动绘制）
- 导出 JSON
- 导出 PNG
- localStorage 恢复最近图纸和设置
- 转换/创建面板可折叠，减少拼豆时干扰
- 无图纸时仅展示入口按钮，按需展开创建面板
- 首页进入编辑器支持 fresh start（从 0 开始，不自动恢复旧图）

关键文件：

- [src/components/PatternCanvas.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/PatternCanvas.tsx)
- [src/hooks/useCanvasRenderer.ts](/Users/wwkong/Documents/Lets-PingDou/src/hooks/useCanvasRenderer.ts)
- [src/components/ToolBar.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/ToolBar.tsx)
- [src/components/StatusBar.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/StatusBar.tsx)
- [src/lib/export.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/export.ts)
- [src/lib/localStorage.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/localStorage.ts)

### 2.6 生成后立即展示整图

已经修复过一个关键问题：

- 之前上传成功后，Canvas 首次挂载没有立即触发绘制
- 表现是必须点一下颜色，图纸才显示出来

现在的行为：

- 上传成功后立即进入编辑器
- 直接显示整张图纸
- 默认不选中任何颜色
- 默认使用最小缩放（优先看全局）

关键文件：

- [src/components/PatternCanvas.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/PatternCanvas.tsx)
- [src/store/usePatternStore.ts](/Users/wwkong/Documents/Lets-PingDou/src/store/usePatternStore.ts)

### 2.7 颜色高亮体验

已经按用户要求调整：

- 选中的颜色保持正常显示
- 非选中颜色灰度化并偏白
- 对比更明显，适合拼豆时找位置

关键文件：

- [src/hooks/useCanvasRenderer.ts](/Users/wwkong/Documents/Lets-PingDou/src/hooks/useCanvasRenderer.ts)

### 2.8 颜色合并交互

当前编辑器右侧颜色栏已经增加“颜色合并”模式：

使用方式：

1. 点击“颜色合并”
2. 先选一个源颜色
3. 画布会高亮这个颜色
4. 再点击一个目标颜色
5. 图纸会立即把源颜色全部并入目标颜色
6. 右侧统计和图纸颜色都会立即更新

这部分实现是借鉴参考项目“先选源，再选目标，再立即可视化”的交互思路，但目前是简化版：

- 当前实现：颜色级全局替换
- 参考项目：更完整的替换模式 + 悬浮色板 + 编辑工作流

关键文件：

- [src/components/PaletteSidebar.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/PaletteSidebar.tsx)
- [src/store/usePatternStore.ts](/Users/wwkong/Documents/Lets-PingDou/src/store/usePatternStore.ts)

### 2.9 创建模式与选色体验（最新）

最近一轮已新增并打通以下体验：

- 双创建模式：
  - 自己创建（空白图纸）
  - 照片转换
- “自己创建”模式可设置标题、宽高、品牌色库后直接生成空白画布
- 选色体验升级：
  - 先选颜色大类，再选具体颜色
  - 最近使用颜色栏（最多 8 个）
  - 色板缩放滑杆
  - 色板区独立滚动，不带动画板视口滑动
- 照片转换图纸支持在右侧色板中直接排除某个颜色
  - 被排除颜色会自动重映射到当前图中剩余颜色里的最近色
  - 画布、用量统计和色板会立即同步更新

关键文件：

- [src/components/CreatePatternPanel.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/CreatePatternPanel.tsx)
- [src/app/editor/page.tsx](/Users/wwkong/Documents/Lets-PingDou/src/app/editor/page.tsx)
- [src/components/PaletteSidebar.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/PaletteSidebar.tsx)
- [src/components/PatternCanvas.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/PatternCanvas.tsx)
- [src/store/usePatternStore.ts](/Users/wwkong/Documents/Lets-PingDou/src/store/usePatternStore.ts)

## 3. 当前关键数据结构

核心类型在：

- [src/types/pattern.ts](/Users/wwkong/Documents/Lets-PingDou/src/types/pattern.ts)

重点：

- `BeadColor`
- `PatternData`
- `PixelationMode`
- `BeadPaletteSource`

当前 `PatternData` 以最终图纸视角为主，包含：

- `creationType`（`manual / photo / preset`）
- `width`
- `height`
- `grid`
- `palette`
- `usage`
- `previewDataUrl`

目前还没有把“初始映射图”“合并后图”“排除颜色后的图”“手动编辑图”拆成多个阶段数据。

## 4. 当前状态管理

Zustand store 在：

- [src/store/usePatternStore.ts](/Users/wwkong/Documents/Lets-PingDou/src/store/usePatternStore.ts)

当前 store 管理：

- 当前 pattern
- 当前选中颜色
- 完成状态
- 是否只显示当前颜色
- 是否只显示当前颜色未完成
- 是否显示网格线
- 是否显示坐标
- 缩放
- hover 信息
- 颜色合并 action
- 单格上色 action（`setCellColor`）

当前 store 还没有管理这些高级状态：

- 颜色替换模式的步骤状态
- 排除颜色集合
- 可用色板集合
- 初始图纸颜色集合
- 外部背景单元格标记
- 撤销 / 重做

## 5. 与参考项目相比还缺什么

参考项目更像一个“图像处理工作台”，当前项目还缺以下几个关键层级：

### 5.1 颜色排除与自动重映射

参考项目支持：

- 点击颜色统计项将其排除
- 系统只在“图中原本存在、且未被排除”的颜色中寻找替换色
- 排除后立即刷新画面和统计

当前项目已经实现了一个简化版：

- 右侧颜色列表可直接点击 `✕` 排除颜色
- 系统会在“当前图中仍有使用量的其他颜色”中寻找最近色进行替换
- 排除后画布、颜色统计和色板会立即刷新

当前还缺：

- 显式维护“已排除颜色集合”
- 支持撤销排除或恢复某个被排除颜色
- 让后续其他编辑流程都基于一套统一的排除状态继续工作

建议优先级：中

### 5.2 自定义可用色板

参考项目支持：

- 展开完整色板
- 勾选哪些颜色可用
- 保存并应用
- 后续映射只在这些颜色中发生

当前项目只是“品牌全量色库”或“默认基础色库”，没有用户自定义可用色板。

建议优先级：高

### 5.3 背景移除 / 外部区域识别

参考项目支持：

- 从边界开始 flood fill
- 将边界连通且属于背景色集合的区域标记为 external
- external 不参与统计、不参与导出主图统计

当前项目没有 background removal。

结果：

- 浅色背景可能被计入用量
- 某些图会出现“整块背景色也被当成珠子”

建议优先级：高

### 5.4 BFS 连通区域合并

参考项目在文档里重点强调：

- 颜色相近且连通的区域，按区域主色统一

当前项目只做了“全局频率 + 距离阈值”的颜色合并，不考虑连通区域。

影响：

- 某些颜色虽然整体接近，但分布在不同局部区域时，当前算法可能合并得不够自然
- 清杂色能力弱于参考项目

建议优先级：中高

### 5.5 手动编辑模式

当前项目已具备：

- 手动创建空白图纸
- 选色后点击画布上色
- 使用“空白/擦除”颜色清除格子
- 颜色大类选择 + 最近使用颜色快捷栏

当前仍缺：

- 吸管工具
- 区域填充（洪水填充）
- 框选/局部替换
- 撤销 / 重做完整链路
- 更完整的手动修图工具流

建议优先级：中

### 5.6 上传阶段的即时预览工作台

参考项目不是“填完表单再生成”，而是：

- 上传后持续可调
- 粒度、阈值、色板变化会即时更新结果
- 颜色选择和图纸预览联动非常强

当前项目还是比较标准的：

- 首页填写参数
- 点击转换
- 进入编辑器

建议优先级：中

## 6. 已知实现决策与原因

### 6.1 为什么先做全局颜色合并，而不是 BFS 区域合并

原因：

- 当前项目从空仓快速搭起 MVP，需要先保证“上传 -> 出图 -> 编辑 -> 导出”主链路完整
- 全局颜色合并实现简单、结果稳定、便于先交付
- BFS 区域合并需要引入更多中间数据和算法状态，适合下一阶段做

### 6.2 为什么生成后默认不选中颜色

原因：

- 用户明确要求转换后先看到整图
- 如果默认选中一种颜色，画面会看起来像“被遮罩了”
- 更合理的流程是：
  - 先看整图
  - 再主动点颜色进入辅助拼豆模式

### 6.3 为什么当前颜色合并做在编辑器里

原因：

- 用户想要“边选边看”
- 编辑器的 Canvas 和右侧颜色列表已经具备联动基础
- 比单独加一个复杂的上传设置页更快见效

## 7. 已完成验证

多次执行过：

```bash
npm run build
npm run lint
```

最近一次状态：

- `next build` 通过
- `next lint` 通过
- 最近迭代内容已通过验证：双创建模式、fresh start、折叠转换、分组选色、最近使用色、色板缩放

## 8. 当前主要文件地图

### 上传与算法

- [src/components/UploadPanel.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/UploadPanel.tsx)
- [src/lib/imageToPattern.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/imageToPattern.ts)
- [src/lib/color.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/color.ts)
- [src/lib/beadPalette.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/beadPalette.ts)
- [src/lib/colorSystems.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/colorSystems.ts)
- [src/lib/data/colorSystemMapping.json](/Users/wwkong/Documents/Lets-PingDou/src/lib/data/colorSystemMapping.json)

### 编辑器与交互

- [src/app/editor/page.tsx](/Users/wwkong/Documents/Lets-PingDou/src/app/editor/page.tsx)
- [src/components/PatternCanvas.tsx](/Users/wwkong/Documents/Lets-PinDou/src/components/PatternCanvas.tsx)
- [src/hooks/useCanvasRenderer.ts](/Users/wwkong/Documents/Lets-PingDou/src/hooks/useCanvasRenderer.ts)
- [src/components/PaletteSidebar.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/PaletteSidebar.tsx)
- [src/components/ToolBar.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/ToolBar.tsx)
- [src/components/StatusBar.tsx](/Users/wwkong/Documents/Lets-PinDou/src/components/StatusBar.tsx)
- [src/store/usePatternStore.ts](/Users/wwkong/Documents/Lets-PingDou/src/store/usePatternStore.ts)

### 导出与持久化

- [src/lib/export.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/export.ts)
- [src/lib/localStorage.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/localStorage.ts)

## 9. 推荐的下一步开发顺序

如果继续开发，建议严格按这个顺序做：

### 第一步：自定义可用色板

目标：

- 用户可以勾选本次转换允许使用哪些颜色
- 上传后只在这些颜色中匹配
- 支持完整色板展开和搜索

理由：

- 直接决定结果质量
- 和多品牌色库结合后价值很高

### 第二步：颜色排除状态完善

目标：

- 显式维护排除颜色集合
- 支持撤销排除 / 恢复颜色
- 让排除状态与后续编辑、导出策略保持一致

理由：

- 当前已经有简化版能力
- 补齐状态层后，交互会更稳定，也更接近参考项目

### 第三步：背景移除

目标：

- 从边界 flood fill 标记外部区域
- 外部区域不计数、不参与导出主统计

理由：

- 对真实照片特别重要
- 不做的话，浅背景图很容易误判成大量白色 / 浅色拼豆

### 第四步：BFS 连通区域合并

目标：

- 用连通区域替换当前的全局颜色合并
- 提高去杂色质量

理由：

- 算法质量升级明显
- 但比前三步更复杂

## 10. 如果下次继续开发，建议先看的上下文

下次继续做之前，先按顺序读这些文件：

1. [PROJECT_STATUS.md](/Users/wwkong/Documents/Lets-PingDou/PROJECT_STATUS.md)
2. [src/lib/imageToPattern.ts](/Users/wwkong/Documents/Lets-PingDou/src/lib/imageToPattern.ts)
3. [src/store/usePatternStore.ts](/Users/wwkong/Documents/Lets-PingDou/src/store/usePatternStore.ts)
4. [src/components/PaletteSidebar.tsx](/Users/wwkong/Documents/Lets-PingDou/src/components/PaletteSidebar.tsx)
5. 参考项目的这些文件：
   - `/Users/wwkong/Documents/perler-beads-master/src/utils/pixelation.ts`
   - `/Users/wwkong/Documents/perler-beads-master/src/app/page.tsx`
   - `/Users/wwkong/Documents/perler-beads-master/src/components/ColorPalette.tsx`
   - `/Users/wwkong/Documents/perler-beads-master/src/utils/pixelEditingUtils.ts`
   - `/Users/wwkong/Documents/perler-beads-master/src/utils/floodFillUtils.ts`

## 11. 一句话总结当前状态

当前项目已经从“能上传出图的 MVP”进化到了“支持自己创建/照片转换双模式、品牌色库、非正方形网格、颜色合并阈值、整图即时显示、手动上色、分组选色与最近使用色”的版本；下一阶段最值得补的是“颜色排除重映射、自定义可用色板、背景移除与更完整手动修图工具链”。
