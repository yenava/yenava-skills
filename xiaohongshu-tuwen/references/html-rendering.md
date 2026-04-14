# HTML Rendering

## 目录

- 什么时候直接走 HTML 渲染
- 页数自动决定规则
- 产物结构
- 共享 CSS 要求
- 单页 HTML 要求
- 渲染前检查
- 渲染输出要求

这个 skill 在需要最终图片时，不停留在导演稿阶段，而是继续生成 HTML/CSS 页面，再通过浏览器渲染成 PNG。

## 一、什么时候直接走 HTML 渲染

满足任一条件就直接进入 HTML/CSS 出图：

- 用户说“最终输出图片”
- 用户说“生成整套轮播”
- 用户说“不要只是文案”
- 用户说“生成 html 和 css 后渲染”

如果用户只说“先给我方案”，那就先停在导演稿。

## 二、页数自动决定规则

不要预设固定 6 页。先统计信息块，再决定页数。

### 推荐映射

- 轻量观点：3 到 4 页
- 常规分析：5 到 7 页
- 重信息拆解：7 到 9 页

### 压缩原则

- 能合并的弱信息合并
- 同类数据不要拆成太多页
- 一页只保留一个信息动作
- 超过 9 页时，优先删掉重复解释页，而不是继续加页

## 三、产物结构

默认目录：

- `output/xiaohongshu-tuwen/<topic-slug>/index.json`
- `output/xiaohongshu-tuwen/<topic-slug>/styles.css`
- `output/xiaohongshu-tuwen/<topic-slug>/page-01.html`
- `output/xiaohongshu-tuwen/<topic-slug>/page-01.png`

其中：

- `index.json` 记录主题、页数、文件名和视觉变量
- `styles.css` 放共享变量和组件样式
- 每页一个独立 `page-xx.html`
- 每页一个对应 `page-xx.png`

## 四、HTML 生成规则

### 1. 先锁定设计变量

所有页面共享同一组 CSS 变量，至少包括：

- `--bg`
- `--text`
- `--muted`
- `--accent`
- `--accent-soft`
- `--card-bg`
- `--card-radius`
- `--page-padding`
- `--shadow`

这组变量先从已选主模板推导，再在个别页面做最小幅度调整，不要每页重造一套视觉变量。

### 2. 每页使用一致的根结构

建议结构：

```html
<body>
  <main class="xhs-page page-cover">
    <header class="page-header">
      <div class="page-kicker"></div>
      <div class="page-author"></div>
    </header>
    <section class="page-body"></section>
    <footer class="page-footer"></footer>
  </main>
</body>
```

要求：

- 根容器固定为 `1080x1440`
- 使用语义类名，不要靠一堆匿名 `div`
- 能复用的模块抽成统一 class，例如 `stat-card`、`compare-table`、`section-title`
- 所有文字必须是真实文本节点，不要用背景图伪造
- 右上角位置用于作者名；如果用户没提供作者名，保留空位，不要默认写媒体名
- 主要内容模块建议加 `data-block`
- 装饰元素建议加 `data-decorative="true"`

### 3. 图表优先用 CSS 组件而不是外部库

优先使用：

- CSS 条形图
- CSS 进度条
- 简单折线的 SVG 内嵌
- 环形图的 conic-gradient
- 双列表格和 KPI 卡片

除非必须，不要引入重型图表依赖。

## 五、渲染规则

使用本 skill 自带的渲染脚本：

```bash
node scripts/render-pages.mjs output/xiaohongshu-tuwen/<topic-slug>
```

脚本会：

- 先自动执行布局检查
- 自动寻找该目录下的 `page-*.html`
- 使用 Playwright 打开本地文件
- 等待 `.xhs-page` 出现
- 以 `1080x1440` 视口截图
- 将 PNG 写回同目录

如果你只想单独做启发式布局体检，可先运行：

```bash
node scripts/check-layout.mjs output/xiaohongshu-tuwen/<topic-slug>
```

## 六、一致性检查

每页渲染后检查：

- 标题层级是否和前页一致
- 强调色是否只突出重要信息
- 数字是否够大
- 卡片样式是否统一
- 页底注释区是否保留
- 底部留白是否异常
- 主要内容块是否重叠

如果有问题，优先改 HTML 结构或共享 CSS，而不是局部打补丁。

## 七、失败时怎么处理

- 某一页太挤：拆页，或把说明收缩成标签
- 某一页层级不清：增加 section title、分组卡片、留白
- 某一页不够像同一系列：回到 `styles.css` 统一变量
- 某一页截图不完整：确认根容器尺寸固定且溢出控制正确
