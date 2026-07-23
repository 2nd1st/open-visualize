# open-visualize

**Give your AI a vocabulary of visual forms.**

open-visualize is a catalog of open-source visualization / interaction components, pre-packaged for CDN loading and described *for AI consumption*. When an AI assistant needs to render something that is hard or unreliable to hand-write — a graph, a Sankey, a chessboard, a deep-config chart, a semantic diff, a no-tile map — it looks up the catalog, picks a component, and writes **assembly code** (produce the data + mount the component) instead of implementing the component from scratch.

It **augments** native AI visualization (Claude artifacts, Codex Visualize); it does not replace it. Use it only where hand-writing is bad / expensive / unstable. For a simple bar chart, a mermaid flowchart, tabs, or a long form, native output is fine — the catalog even tells the AI to *not* reach for it there.

Why this helps: raising the ceiling of what an AI can render, spending fewer tokens, and rendering more reliably — these emerge from good packaging + clean schemas, not from a heavy framework. Component implementations are never generated; the AI only writes the thin, patterned assembly layer.

## How an AI uses it

1. **Install** — read [`discovery/install.md`](discovery/install.md) (the concept + the augment principle + the 4 steps) into memory.
2. **Discover** — read [`discovery/index.md`](discovery/index.md) (a lightweight router, categories only). Two directions:
   - *have data* → find an `id` by data-shape,
   - *have an intent* → open a scene slice [`discovery/by-scene/<scene>.md`](discovery/by-scene/).
3. **Read the entry** — [`data/catalog/<id>.json`](data/catalog/) gives a trimmed data schema, a per-carrier boot snippet, and the license.
4. **Assemble** — produce the `data` (JSON), add `spec` if layout is needed, and mount the component via the boot snippet.

The discovery layer is tiered so an AI never has to load all 406 entries at once: the router is tiny, scene slices are loaded on demand, and full entries are read one at a time. `discovery/llms.txt` is the single-file dump for pasting the whole catalog into a knowledge base.

## What's inside

| path | what |
|---|---|
| `discovery/install.md` | the install prompt (resident concept + 4 steps) |
| `discovery/index.md` | the router: data-shape → id index + scene directory |
| `discovery/by-scene/*.md` | per-scene entry slices (load on demand) |
| `discovery/llms.txt` | full single-file index of all entries |
| `data/catalog/*.json` | 406 catalog entries, one JSON per component |
| `data/data-shapes.json` | the 18-word data-shape vocabulary for data-first discovery |

## Carriers

Components load from jsDelivr `/npm/`:

```js
import cytoscape from 'https://cdn.jsdelivr.net/npm/cytoscape@3/+esm';
```

which is on the CDN allow-list of Claude HTML artifacts, Claude widgets, and Codex Visualize. Each entry's `boot` is keyed by carrier (`artifact` / `widget` / `codex`) because their constraints differ (CSP allow-lists, shadow-DOM isolation, uplink channels). Where a live artifact-CSP probe has not been run, the `artifact` column is honestly marked `inferred-not-tested`.

## Entry format

Each entry is a thin JSON object: always-present fields (`id`, `name`, `when_to_use`, `why_valuable`, `supply_form`, `data_in` schema, `upstream`, `license`) plus applicable-only fields (`boot`, `spec`, `example`, `carriers`, …). `supply_form` selects the skeleton: `component` (mount it), `headless-primitive` (provides data/logic, no rendering), `data-asset` (a pinned data package), or `app-needs-fork` (blocked until forked).

## Status

Early. **406 entries** — 384 directly consumable (`component` / `headless-primitive` / `data-asset`) plus 22 `app-needs-fork` application stubs. Component APIs and CDN paths are verified against upstream; per-entry artifact-carrier behavior is being confirmed. Cataloged components retain their own upstream licenses (recorded per entry; copyleft flagged; a few unverified licenses are marked).

## License

MIT (this catalog and its description files). Each cataloged component is governed by its own upstream license, recorded in its entry.
