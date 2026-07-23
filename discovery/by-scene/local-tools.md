# 本地工具与推演(scene: local-tools,23 条)

每条:`id` — 何时用 · 数据形态 · supply_form · license。选中读 `data/catalog/<id>.json`。

- `cashify` — 需要基于调用方提供的汇率快照做多币种换算时用它 · scalar · headless-primitive · MIT
- `cfiresim` — 应用态 · expression · app-needs-fork · Apache-2.0 ⚠blocked(需fork)
- `convert` — 需要类型安全、可摇树且覆盖物理量与数据单位的现代单位换算核时用它 · scalar · headless-primitive · MIT
- `convert-units` — 需要在长度、面积、质量、体积、温度、时间等单位间可靠换算时用它 · scalar · headless-primitive · MIT
- `currency-js` — 需要小体积的单币种金额运算、分摊与格式化时用它 · scalar · headless-primitive · MIT
- `date-fns-tz` — 需要用纯函数把 instant 格式化到指定 IANA 时区、或在 wall-clock 与 UTC… · scalar · headless-primitive · MIT
- `decimal-js` — 需要复利、分期或高精度小数链式运算时用它 · scalar · headless-primitive · MIT
- `dinero-js` — 需要带 ISO 币种与 scale 的不可变金额对象或严格比例分配时用它 · scalar · headless-primitive · MIT
- `epidemic-calculator-epcalc` — 应用态 · expression · app-needs-fork · unverified ⚠blocked(需fork)
- `financejs` — 需要复算 PV/FV/NPV/IRR、分期付款、CAGR 或复利等经典金融公式时用它 · scalar · headless-primitive · MIT
- `financial` — 需要零依赖且对齐 numpy-financial 语义的贷款、净现值或收益率计算核时用它 · scalar · headless-primitive · MIT
- `formulajs-formulajs` — 需要在 JavaScript 里复算 Excel 风格的财务与统计函数时用它 · scalar · headless-primitive · MIT
- `js-quantities` — 需要解析复合单位、做量纲一致性检查或换算 km/h、N·m、kWh 等带量纲数量时用它 · scalar · headless-primitive · MIT
- `leva` — 已有 React 组件树且需要把声明式 schema 变成实时调参面板时用它 · key-value · component L1 · MIT
- `lil-gui` — 需要用紧凑面板实时调数值、布尔、颜色和枚举参数时用它 · key-value · component L1 · MIT
- `loanjs` — 需要生成等额本息、期初等额本息或等额本金的完整贷款分期表时用它 · scalar · headless-primitive · MIT
- `loopy` — 应用态 · graph · app-needs-fork · CC0-1.0 ⚠blocked(需fork)
- `luxon` — 需要把带来源时区的本地时间可靠换到另一 IANA 时区、跨越 DST 边界或计算 duration … · scalar · headless-primitive · MIT
- `papaparse` — 需要把用户粘贴的带引号、换行、自动分隔符与坏行的 CSV 稳定变成记录表时用它 · tabular · headless-primitive · MIT
- `simple-statistics` — 需要百分位、样本方差、相关性或一元回归的可复算统计核时用它 · tabular · headless-primitive · ISC
- `spacetime` — 需要跨 IANA 时区换算、DST 边界日期算术或口语化日期格式时用它 · scalar · headless-primitive · Apache-2.0
- `tvm-financejs` — 需要按 Excel 参数语义复算 PV/FV/PMT/NPER/RATE 等货币时间价值函数时用它 · scalar · headless-primitive · MIT
- `weighteddecisionmatrix` — 应用态 · tabular · app-needs-fork · MIT ⚠blocked(需fork)
