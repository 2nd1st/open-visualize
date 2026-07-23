# open-visualize — catalog router(常驻地图)

给你(AI)一套「能开口说的视觉词汇」:预打包上 CDN 的开源可视化组件 + 面向 AI 的用法描述。**只在原生写得烂/贵/不稳处用**(简单柱线饼/mermaid/tabs/长表单 → 原生手写)。先读 `install.md`(augment 原则 + 4 步)。

> 路径基于**仓库根**(fetch 时 = 给你的根 URL):`data/catalog/…`、`discovery/by-scene/…` 都从根算起,不是相对本文件。

**本文件只有类目、不含条目**(轻)。定位后按需读一片:
- **有数据** → 下方「按数据形态」找 id → 直接读 `data/catalog/<id>.json`(schema + 按载体 boot)。
- **有场景没数据** → 下方「按场景」→ 读 `discovery/by-scene/<scene>.md` 拿该场景条目 → 选 id 读其 JSON。
- **要整包**(一次塞进 knowledge)→ `discovery/llms.txt`(全 257 条)。

## 按数据形态(data-first)→ id
- `tabular` → ag-grid-community, antv-s2, clusterize-js, finos-perspective, fuse-js, gridjs, lit-labs-virtualizer, lucky-canvas, observablehq-plot, papaparse, photoswipe, plotly-js-dist-min, react-custom-roulette, rough-viz, simple-statistics, spin-wheel, sql-js, swiper, vega-lite, virtua, weighteddecisionmatrix, wheel-fortune, winwheel, wordcloud
- `sequence` → algorithm-visualizer, asciinema-player, blocknote-core, chart-js, driver-js, editorjs-editorjs, formkit-drag-and-drop, jsav, sequential-workflow-designer, sortablejs, tone, uplot
- `hierarchy` → d3-flame-graph, d3-hierarchy, docx, jkanban, markmap-lib, mind-elixir, pdfmake, pev2, railroad-diagrams, react-email-components, react-pdf-renderer, satori, simple-mind-map, speedscope, tocbot
- `graph` → antv-x6, chartjs-chart-sankey, cytoscape, d3-graphviz, d3-sankey, elkjs, force-graph, gitgraph-js, graphql-voyager, json-crack, litegraph-js, logicflow-core, loopy, rete, sigma, vis-network, xyflow-react
- `key-value` → alenaksu-json-viewer, andypf-json-viewer, animejs, bpmn-io-form-js, canvas-confetti, canvas-nest-js, cerberus, cursor-effects, dom-confetti, emoji-blast, fireworks-js, flexbox-labs, html-resume-template-owengretzinger, img-comparison-slider, js-confetti, jsbarcode, json-editor-json-editor, json-formatter-js, jsonresume-component, jsonresume-theme-even, jsonresume-themes-panasenco, leva, lil-gui, magic-snowflakes, mojs-core, party-js, qr-code-styling, rapidoc, resumed, sakura-js, split-js, survey-core, tensorflow-playground, tippy-js, tsparticles-confetti, tweakpane, vanilla-jsoneditor, vanta, wokwi-elements, xstate
- `scalar` → cashify, convert, convert-units, countup-js, currency-js, date-fns-tz, decimal-js, dinero-js, financejs, financial, formulajs-formulajs, js-quantities, loanjs, luxon, nouislider, spacetime, tvm-financejs
- `interval-set` → frappe-gantt, fullcalendar-core, html-midi-player, perf-cascade, react-chrono, timelines-chart, toast-ui-calendar, vis-timeline, webaudio-tinysynth
- `grid` → 2048, cal-heatmap, crosswords-js, cssgridgenerator, gridstack, moonwave99-fretboard-js, pathfinding, sabaki-shudan, seatchart, svguitar, x-data-spreadsheet
- `text-span` → ansi-up, codemirror, codemirror-merge, diff, diff-match-patch, diff2html, docx-preview, git-diff-view-react, gpt-tokenizer, jsondiffpatch, littlefoot, node-htmldiff, prismjs, react-diff-viewer-continued, recogito-text-annotator, rough-notation, shiki, speed-highlight-core, xterm-xterm
- `geometry` → 3dmol, animcjk, annotorious-annotorious, complexity-explorables, cropperjs, d3-celestial, d3-geo, drawflow, excalidraw-excalidraw, fabric, floppybird, html-to-image, jspdf, kaplay, leader-line, lottie-web, matter-js, molstar, myphysicslab, p5, pdfjs-dist, phaser, pixi-js, planck, pptxgenjs, signature-pad, t-rex-runner, three, topojson-client, tui-image-editor, us-atlas, world-atlas, zdog, zumer-snapdom
- `notation-string` → abcjs, besogo, chess-gchessboard, chess-js, chessboard-element, cm-chessboard, coderline-alphatab, croner, cronstrue, github-markdown-css, gswap, gutenberg-css, hanzi-writer, hpcc-js-wasm, html-resume-mnjul, js-interpreter, jsme, katex, kifu-for-js, latex-css, latex-js, marp-team-marp-core, mathjax-full, mermaid, mjml-browser, myriaddreamin-typst-ts, nomnoml, openchemlib, opensheetmusicdisplay, pagedjs, paper-css, quizdown-js, rdkit-rdkit, regulex, remark-slides, reveal-js, shower-core, smiles-drawer, tonal, tufte-css, verovio, vexflow, wavedrom, wgo, xiangqiboard-js, zero-md
- `expression` → cfiresim, cindyjs, epidemic-calculator-epcalc, function-plot, jstat, jsxgraph, mafs, mathbox, nerdamer, tangle

## 按场景(intent-first)→ 读对应 slice
- **数据展示与探索**(36)→ `discovery/by-scene/data-explore.md`
- **教学与模拟**(28)→ `discovery/by-scene/teach-sim.md`
- **输入与共创**(31)→ `discovery/by-scene/input-cocreate.md`
- **内容浏览与对照**(27)→ `discovery/by-scene/browse-compare.md`
- **本地工具与推演**(23)→ `discovery/by-scene/local-tools.md`
- **开发者工件**(26)→ `discovery/by-scene/dev-artifacts.md`
- **领域记谱**(27)→ `discovery/by-scene/notation.md`
- **成品交付**(31)→ `discovery/by-scene/deliverables.md`
- **bonus:装饰/横切效果**(28)→ `discovery/by-scene/bonus.md`
