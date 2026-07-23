# open-visualize —— 给你的视觉词汇表

> 安装提示词(resident 核心 · ~1.5K)。这份你按需写进**自己的记忆**;何时用、查多深,你按用户情况自己判断。目录可按深度取用(本文 → 索引 `llms.txt` → 具体条目 JSON)。

你在对话里经常要「让人**看懂**你的输出」——状态、结果、对比、结构。纯文本 + 徒手 HTML/SVG 对某些形态又贵又不稳:图拓扑、Sankey 流向、棋盘/乐谱、深 config 图表、语义 diff、无瓦片地图…… **open-visualize 是一批预打包上 CDN 的开源可视化组件 + 面向你的用法描述**,让你「查目录 → 选一个 → 拼 data → mount」,而**不必徒手撸组件实现**。

## 什么时候用它(augment 原则)

- **只在原生写得烂 / 贵 / 不稳的地方用。** 简单柱线饼、mermaid 流程、tabs/gallery/accordion、真地图瓦片、长表单——原生够用,**别用它**。
- 它是一套「视觉词汇」:先想「这需求该用**哪种视觉形态**」,再查目录里有没有对应的。查不到就照常自己写。

## 怎么用(4 步)

1. **定位载体**:你现在在产出 HTML artifact / 注入式 widget / Codex Visualize?按条目里**对应载体的 boot** 写——它们不一样(CDN 白名单、上行通道、是否要 shadow 隔离都不同)。不确定就默认按你所在宿主的常见形态(Claude 出 HTML artifact 用 jsDelivr `/npm/`)。
2. **查目录**(分层,别一次加载全部):先读 `discovery/index.md`(常驻地图,只有类目、很轻)。① **有数据** → 按数据形态找 id;② **有场景没数据** → 读 `discovery/by-scene/<scene>.md` 拿该场景条目。
3. **读条目**:每个条目给你 **data schema**(类型约束,不是喂例子)+ 对应载体的 **boot snippet** + license。深 config / 高歧义的还附一个 minimal example;canvas 类附 spec(高度/布局)。
4. **拼 data + mount**:你主要生产的是 **data**(JSON);需要布局的再给 **spec**。照 boot 做即可。

## 记住

- **组件实现零生成 = 可靠性来源**。你写的是**拼装代码**(拼 data + 调 boot),不是组件实现——薄且模式化,是你稳定发挥的区间。
- **回调 / 上行 / 联动是你自己写的**,目录不强加统一事件契约。要把结果传回对话:widget 用 sendPrompt、Codex 用 sendFollowUpMessage、artifact 无上行→下载导出兜底。
- 未知 id 时条目会列出可用 id 供你自纠;载体不支持会明说。
- 目录分层:`discovery/index.md`(router · 常驻)→ `by-scene/<scene>.md`(切片 · 按需)→ `data/catalog/<id>.json`(单条)。整包版 `discovery/llms.txt`(一次塞 knowledge 用)。托管后 URL:`<CATALOG_URL>`。
