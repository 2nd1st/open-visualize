# open-visualize — catalog router(常驻地图)

给你(AI)一套「能开口说的视觉词汇」:预打包上 CDN 的开源可视化组件 + 面向 AI 的用法描述。**只在原生写得烂/贵/不稳处用**(简单柱线饼/mermaid/tabs/长表单 → 原生手写)。先读 `install.md`(augment 原则 + 4 步 / 或直接调 hosted `/api/render`)。

> 路径基于**仓库根**(fetch 时 = 给你的根 URL):`data/catalog/…`、`discovery/by-scene/…` 都从根算起,不是相对本文件。

**本文件只有类目、不含条目**(轻)。定位后按需读一片:
- **有数据** → 下方「按数据形态」找 id → 直接读 `data/catalog/<id>.json`(schema + 按载体 boot)。
- **有场景没数据** → 下方「按场景」→ 读 `discovery/by-scene/<scene>.md` 拿该场景条目 → 选 id 读其 JSON。
- **要整包**(一次塞进 knowledge)→ `discovery/llms.txt`(全 406 条)。

## 按数据形态(data-first)→ id
- `tabular` → ag-grid-community, antv-s2, before-after-metrics, checklist-coverage, clusterize-js, crossfilter2, finos-perspective, fuse-js, gridjs, hyperformula, jspdf-autotable, lit-labs-virtualizer, lucky-canvas, ml-hclust, observablehq-plot, papaparse, photoswipe, plotly-js-dist-min, react-custom-roulette, regression, rough-viz, simple-statistics, skmeans, spin-wheel, sql-js, swiper, vega-lite, virtua, wheel-fortune, winwheel, wordcloud, xirr
- `sequence` → activity-feed, asciinema-player, blocknote-core, changelog, chart-js, chat-transcript, driver-js, editorjs-editorjs, formkit-drag-and-drop, jsav, milestone-tracker, sequential-workflow-designer, seqviz, sortablejs, step-guide, stepper, tone, uplot
- `hierarchy` → d3-flame-graph, d3-hierarchy, docx, jkanban, markmap-lib, mind-elixir, pdfmake, pev2, railroad-diagrams, react-email-components, react-pdf-renderer, satori, simple-mind-map, speedscope, sunburst-chart, tocbot
- `graph` → 3d-force-graph, antv-x6, chartjs-chart-sankey, cytoscape, d3-graphviz, d3-sankey, elkjs, force-graph, gitgraph-js, graphql-voyager, json-crack, litegraph-js, logicflow-core, rete, sigma, vis-network, xyflow-react
- `key-value` → alenaksu-json-viewer, andypf-json-viewer, animejs, bpmn-io-form-js, canvas-confetti, canvas-nest-js, cursor-effects, dom-confetti, emoji-blast, empty-state, event-card, fireworks-js, glossary-list, img-comparison-slider, js-confetti, jsbarcode, json-editor-json-editor, json-formatter-js, jsonresume-component, jsonresume-theme-even, jsonresume-themes-panasenco, leva, lil-gui, magic-snowflakes, mojs-core, party-js, progress-dashboard, pros-cons, qr-code-styling, rapidoc, recipe-card, resumed, review-scorecard, sakura-js, spec-sheet, split-js, survey-core, swot-grid, tippy-js, tsparticles-confetti, tweakpane, vanilla-jsoneditor, vanta, verdict-summary, weather-card, wokwi-elements, xstate
- `scalar` → achievement-badges, black-scholes, cashify, convert, convert-units, countup-js, currency-js, date-fns-tz, decimal-js, dinero-js, financejs, financial, formulajs-formulajs, js-quantities, loanjs, luxon, metric-delta, nouislider, rating-display, spacetime, tvm-financejs
- `interval-set` → frappe-gantt, fullcalendar-core, html-midi-player, perf-cascade, react-chrono, timeline-vertical, timelines-chart, toast-ui-calendar, vis-timeline, webaudio-tinysynth
- `grid` → cal-heatmap, crosswords-js, d3-contour, gridstack, moonwave99-fretboard-js, pathfinding, sabaki-shudan, seatchart, svguitar, x-data-spreadsheet
- `text-span` → ansi-up, callout, codemirror, codemirror-merge, diff, diff-match-patch, diff2html, docx-preview, git-diff-view-react, gpt-tokenizer, jsondiffpatch, littlefoot, node-htmldiff, prismjs, react-diff-viewer-continued, recogito-text-annotator, rough-notation, shiki, speed-highlight-core, xterm-xterm
- `geometry` → 3dmol, animcjk, annotorious-annotorious, cropperjs, d3-celestial, d3-geo, drawflow, excalidraw-excalidraw, fabric, html-to-image, jspdf, kaplay, leader-line, lottie-web, makerjs, matter-js, molstar, p5, pdfjs-dist, phaser, pixi-js, planck, pptxgenjs, roughjs, signature-pad, three, topojson-client, tui-image-editor, us-atlas, world-atlas, zdog, zumer-snapdom
- `notation-string` → abcjs, besogo, chess-gchessboard, chess-js, chessboard-element, cm-chessboard, coderline-alphatab, croner, cronstrue, github-markdown-css, gutenberg-css, hanzi-writer, hpcc-js-wasm, html-resume-mnjul, js-interpreter, jsme, katex, kifu-for-js, latex-css, latex-js, marp-team-marp-core, mathjax-full, mathsteps, mermaid, mjml-browser, mscgenjs, myriaddreamin-typst-ts, nomnoml, openchemlib, opensheetmusicdisplay, pagedjs, paper-css, quizdown-js, rdkit-rdkit, regulex, remark-slides, reveal-js, shower-core, smiles-drawer, softwaretechnik-dbml-renderer, tonal, tufte-css, verovio, vexflow, wavedrom, wgo, xiangqiboard-js, zenuml-core, zero-md
- `expression` → cindyjs, function-plot, jstat, jsxgraph, mafs, mathbox, nerdamer, tangle
- `matrix` → ahp, d3-chord, decision-matrix, ml-matrix, ml-pca, rubric-grid, scorecard-bars
- `config` → aos, ldrs, nprogress, rellax, vanilla-tilt, webgl-fluid
- `board` → draughtsboard
- `scene-graph` → konva
- `isometric-scene` → fossflow
- `text` → opentype-js, splitting
- `?` → 2048, algorithm-visualizer, cerberus, cfiresim, complexity-explorables, cssgridgenerator, epidemic-calculator-epcalc, flexbox-labs, floppybird, gswap, html-resume-template-owengretzinger, loopy, myphysicslab, t-rex-runner, tensorflow-playground, weighteddecisionmatrix
- `alignment` → nightingale-msa
- `array` → fft-js
- `audio-signal` → wavesurfer-js
- `bitmap` → resemblejs
- `ca-rule` → thi-ng-cellular
- `categorical` → tabulator-tables
- `chord-chart` → chordsheetjs
- `code-string` → bwip-js, code-snippet, highlight-js
- `code-text` → monaco-editor
- `color-value` → jaames-iro
- `comparison-matrix` → comparison-table, feature-matrix, head-to-head, pricing-table
- `component-tree` → grapesjs
- `compute-engine` → mathjs
- `config-object` → echarts
- `date-range` → flatpickr
- `diagram-spec` → penrose-core
- `docx-document` → mammoth
- `dom-element` → panzoom-panzoom
- `dom-interaction` → interactjs
- `dom-target` → formkit-auto-animate, powerglitch
- `dom-text` → mark-js
- `emoji-catalog` → emoji-picker-element
- `epub-document` → epubjs
- `events` → ics
- `feature-track` → nightingale-track
- `field-array` → bit-field
- `generative-config` → trianglify
- `genomic-annotations` → ideogram
- `genomic-track` → igv
- `geospatial` → deck-gl
- `globe` → globe-gl
- `gradient` → granim
- `html` → turbodocx-html-to-docx
- `markdown-string` → toast-ui-editor
- `molecule` → kekule
- `multidimensional` → parcoord-es
- `netlist-json` → netlistsvg
- `nodes-links` → d3-force
- `notation-xml` → bpmn-js, dmn-js
- `number` → odometer
- `ohlc` → lightweight-charts
- `option-list` → tom-select
- `path-strings` → flubber
- `pdf-document` → pdf-lib
- `pixel-buffer` → pixelmatch
- `point-cloud` → regl-scatterplot
- `points` → d3-delaunay, heatmap-js, quadrant-2x2
- `program-image` → avr8js
- `proportion` → radial-progress, wired-gauge
- `ranking` → leaderboard, tier-list
- `raster-image` → openseadragon
- `receipt-markup` → receiptline
- `records` → avatar-group, bento-grid, citation-cards, faq-accordion, masonry-grid, product-cards, profile-cards, testimonial-quote
- `rewrite-rules` → lindenmayer
- `rich-text-delta` → quill
- `scene` → cannon-es, dimforge-rapier2d-compat
- `schema` → dineug-erd-editor
- `set-membership` → upsetjs-bundle
- `single-metric` → stat-cards
- `stroke-points` → perfect-freehand
- `svg` → svg2pdf-js, vivus
- `tag-list` → status-pills, yaireo-tagify
- `template` → docxtemplater
- `template-schema` → pdfme-generator
- `temporal` → suncalc
- `timeline-tree` → flame-chart-js
- `tree` → d3-org-chart, phylocanvas-gl, react-arborist
- `workbook` → exceljs, xlsx

## 按场景(intent-first)→ 读对应 slice
- **数据展示与探索**(72)→ `discovery/by-scene/data-explore.md`
- **教学与模拟**(45)→ `discovery/by-scene/teach-sim.md`
- **输入与共创**(47)→ `discovery/by-scene/input-cocreate.md`
- **内容浏览与对照**(47)→ `discovery/by-scene/browse-compare.md`
- **本地工具与推演**(39)→ `discovery/by-scene/local-tools.md`
- **开发者工件**(41)→ `discovery/by-scene/dev-artifacts.md`
- **领域记谱**(39)→ `discovery/by-scene/notation.md`
- **成品交付**(71)→ `discovery/by-scene/deliverables.md`
- **装饰/横切效果**(50)→ `discovery/by-scene/bonus.md`
