# 拼豆像素工坊（PingDou Studio）

一个纯前端拼豆图纸工作台，基于 Next.js App Router、TypeScript、Tailwind CSS、Zustand 和 Canvas。

核心目标：**不依赖后端图像处理 API**，在浏览器中完成“创建/转换/编辑/导出”闭环。

---

## 当前功能概览

### 1) 两种创建方式

- **自己创建**：手动设置尺寸和色库，生成空白图纸后直接上色。
- **照片转换**：上传图片后自动转换为拼豆图纸。

### 2) 照片转换能力

- 多品牌色库：`default / MARD / COCO / 漫漫 / 盼盼 / 咪小窝`
- 取样模式：`average` / `dominant`
- 支持非正方形图纸（可指定高度，或按原图比例）
- 颜色合并阈值（降低杂色）

### 3) 编辑器能力

- 画布缩放、网格线、坐标显示
- 当前颜色高亮、只看当前颜色、只看当前颜色未完成
- 点击格子标记完成；当选中颜色时可直接点击上色
- 颜色合并（先选源色，再选目标色）
- 导出 `JSON / PNG`

### 4) 颜色选择体验优化

- 颜色按大类分组：空白/擦除、红粉系、橙黄系、绿色系、蓝紫系、棕肤系、中性色
- 先选大类，再在类内选色，减少长列表滚动
- 最近使用颜色栏（最多 8 个），支持快速回选
- 色板独立滚动，不影响图板视口
- 色板缩放滑杆（小/中/大）

### 5) 交互细节

- “开始制作图纸”从首页进入编辑器时支持**从 0 开始**（清理历史缓存）
- 转换相关面板默认可折叠，减少对拼豆过程的干扰

---

## 典型流程

```txt
方式 A：自己创建
  -> 选择「自己创建」
  -> 设置标题/尺寸/色库
  -> 创建空白图纸
  -> 选颜色并点击画布上色
  -> 导出 JSON / PNG

方式 B：照片转换
  -> 选择「照片转换」
  -> 上传图片并设置参数
  -> 浏览器端转换图纸
  -> 进入编辑器微调
  -> 导出 JSON / PNG
```

---

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

打开：`http://localhost:3000`

### 构建

```bash
npm run build
npm run start
```

---

## 项目结构（核心）

```txt
Lets-PingDou/
├─ public/
│  └─ patterns/
│     ├─ heart.json
│     └─ star.json
├─ src/
│  ├─ app/
│  │  ├─ page.tsx
│  │  ├─ editor/page.tsx
│  │  ├─ patterns/page.tsx
│  │  ├─ patterns/[id]/page.tsx
│  │  └─ offline/page.tsx
│  ├─ components/
│  │  ├─ UploadPanel.tsx
│  │  ├─ CreatePatternPanel.tsx
│  │  ├─ PatternCanvas.tsx
│  │  ├─ PaletteSidebar.tsx
│  │  ├─ Toolbar.tsx
│  │  └─ ...
│  ├─ lib/
│  │  ├─ imageToPattern.ts
│  │  ├─ beadPalette.ts
│  │  ├─ colorSystems.ts
│  │  ├─ localStorage.ts
│  │  └─ ...
│  ├─ store/usePatternStore.ts
│  └─ types/pattern.ts
└─ README.md
```

---

## 已知后续方向

- 颜色排除与自动重映射
- 背景识别与外部区域处理
- 更强的手动修图工具（区域填充、吸管、批量替换等）
- 更完善的打印版导出

更详细记录可见：[`PROJECT_STATUS.md`](PROJECT_STATUS.md)
