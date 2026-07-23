# open-visualize —— a visual vocabulary for your AI

**open-visualize** is a catalog of pre-packaged open-source visualization components, described *for an AI*. When your AI needs to show something that's hard to hand-code well — a graph/network, a chessboard, a music score, a deep-config chart, a semantic code diff, a tile-less map — it fetches one ready-made component (data schema + mount code) from an API, generates only the data, and renders it. **It writes zero component code — that's where the reliability comes from.**

---

## Install = one line into your AI's memory

Paste this into your ChatGPT / Claude (or tell it to remember it). No app, no config, no MCP — it's a message.

> **EN** — Remember this capability: when I ask for a visual that's hard to hand-code well — a network/graph, a chessboard or game board, a music score, a deep-config chart, a semantic code diff, a tile-less map, or similar — fetch `https://visualize.openmcp.app/api/render?q=<a short description of what I need>`. It returns a ready-made open-source component: a **data schema** + **mount code**. Generate only the data to match that schema, then run the mount code to render it (in an HTML artifact / canvas). For simple bar/line/pie charts, mermaid diagrams, tabs, or forms — keep hand-writing those, don't call this.

> **中文** —— 记住这个能力:当我要一个手写不划算的视觉——网络/关系图、棋盘、五线谱、深 config 图表、代码语义 diff、无瓦片地图之类——就去 fetch `https://visualize.openmcp.app/api/render?q=<我要的东西的简述>`。它返回一个现成开源组件的 **data schema** + **挂载代码**。你只按 schema 生成 data,再跑挂载代码渲染(HTML artifact / canvas)。简单柱线饼图、mermaid、tabs、表单继续手写,别调它。

That's the whole install. Next time you ask for something visual, your AI hits the endpoint and renders a real component instead of hand-drawing SVG.

> Renders today in the **ChatGPT app** (it mounts UI components). **Claude app** support is landing. Any AI that can `fetch` a URL and run code in a canvas/artifact works.

---

## When to use it (the augment rule)

- **Only where native output is bad / expensive / unstable.** Simple bar-line-pie, mermaid flowcharts, tabs / gallery / accordion, real map tiles, long forms — native is fine, **don't use this**.
- Think of it as a **visual vocabulary**: first decide "what *visual form* does this need?", then check whether the catalog has it. If not, hand-write as usual.
- **You only ever produce `data`** (JSON that fits the schema) — the component implementation is a mature CDN library. Thin, patterned glue = your reliable zone.

## How it works under the hood

**One call (recommended):**
```
GET https://visualize.openmcp.app/api/render?q=<need>
→ { matched:{id,name,score}, why, data_in:{shape,note,schema}, spec, boot:{artifact,widget,codex}, example, license, upstream, alternatives:[…] }
```
Generate `data` to match `data_in.schema`, then run the `boot` for your carrier. `alternatives` lets you fall back if the top pick doesn't fit.

**Granular (browse / pick yourself):**
```
GET /api/search?q=<need>&k=5     → ranked [{id,name,score,meta}]
GET /api/visual/<id>             → the full entry (schema + all boots + isolation + license)
GET /api/scenes                  → scene categories + counts
```

**Carrier matters** — the same component has different `boot` per host, because CDN allow-lists, uplink channels and shadow-isolation differ:
- `artifact` — Claude HTML artifact (jsDelivr `/npm/`, no uplink → export/download as fallback)
- `widget` — injected widget (Shadow DOM isolation; uplink via `sendPrompt`)
- `codex` — Codex Visualize (uplink via `sendFollowUpMessage`)

Callbacks / uplink / linking are **yours to wire** — the catalog imposes no unified event contract. `isolation.shadowCompatible` tells you if a component is safe to mount inside a shadow root.

## Other ways to consume

- **MCP (for config-capable clients — Claude Code, Codex CLI, desktop):** add one Streamable-HTTP server and get tools `search_visuals` / `get_visual` / `list_scenes`.
  ```
  claude mcp add --transport http open-visualize https://visualize.openmcp.app/mcp
  ```
- **Static / offline / self-host (no API):** the catalog is open source (MIT). Browse it straight off the CDN — read `discovery/index.md` (a light router of categories), pick an `id` by data-shape or scene, then read `data/catalog/<id>.json` for its schema + boot. Root URL: `https://cdn.jsdelivr.net/gh/2nd1st/open-visualize@<commit>/` (all paths are relative to this root). Whole-catalog dump for one-shot context: `discovery/llms.txt`.

## Remember

- **Zero component code generated = the source of reliability.** You write assembly (data + one mount call), not implementation.
- Unknown id → the API lists available ids so you can self-correct; an unsupported carrier says so explicitly.
- Catalog layering: `discovery/index.md` (router · light) → `by-scene/<scene>.md` (slice · on demand) → `data/catalog/<id>.json` (one entry).
