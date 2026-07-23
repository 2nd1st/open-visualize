import { register, mount, listIds, OVError } from '@ov/runtime'
import type { Adapter, AdapterContext, MountOptions, EventDetail } from '@ov/runtime'
import GAMES from './games.json'

/**
 * Data accepted by the retroemu adapter.
 *
 * romUrl takes precedence over gameName. An absent or unmatched gameName opens
 * the searchable picker. height is the emulator screen height in CSS pixels.
 */
export interface RetroEmuData {
  romUrl?: string
  gameName?: string
  height?: number
}

interface Game {
  name: string
  file: string
}

interface ResolvedGame {
  gameName: string
  romUrl: string
}

const DEFAULT_HEIGHT = 360
const RESULT_LIMIT = 40
// ROM 走 jsDelivr /gh(AI 宿主白名单认;github raw 不认)。GBA ROM 多在 20MB 内(jsDelivr /gh 单文件上限)。
const ROM_BASE = 'https://cdn.jsdelivr.net/gh/vbaemulator/GBA-Roms@master/'
// 全 jsDelivr 版(AI 宿主白名单认 jsDelivr):
// frontend 走 @emulatorjs/emulatorjs /npm;核心用 EJS_paths 重定向到 @emulatorjs/core-mgba
// /npm(emulatorjs 包不含 cores,不重定向会 failsafe 掉 cdn.emulatorjs.org=非白名单)。
const EMULATOR_DATA = 'https://cdn.jsdelivr.net/npm/@emulatorjs/emulatorjs@4.2.3/data/'
const CORE_BASE = 'https://cdn.jsdelivr.net/npm/@emulatorjs/core-mgba@4.2.3/'
const EMULATOR_LOADER = `${EMULATOR_DATA}loader.js`
const GAME_LIST: readonly Game[] = GAMES

const COMPONENT_CSS = `
:host{display:block;width:100%}
*{box-sizing:border-box}
.retroemu{
  width:100%;
  max-width:760px;
  margin:0 auto;
  overflow:hidden;
  border:1px solid #252a35;
  border-radius:10px;
  background:#090b10;
  box-shadow:0 8px 24px rgba(0,0,0,.22);
}
.screen{
  display:block;
  width:100%;
  height:var(--retroemu-height,360px);
  border:0;
  background:#000;
}
.picker{
  width:100%;
  padding:8px;
  background:#10141c;
}
.search{
  display:block;
  width:100%;
  height:42px;
  margin:0 0 7px;
  padding:0 12px;
  border:1px solid #343b49;
  border-radius:7px;
  outline:0;
  background:#090c12;
  color:#eef1f6;
  font:14px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.search::placeholder{color:#7f8796}
.search:focus-visible{border-color:#8099ed;box-shadow:0 0 0 2px rgba(128,153,237,.24)}
.results{
  max-height:calc(var(--retroemu-height,360px) - 57px);
  min-height:132px;
  overflow:auto;
  overscroll-behavior:contain;
  border:1px solid #282e39;
  border-radius:7px;
  background:#0b0e14;
}
.result{
  display:block;
  width:100%;
  min-height:44px;
  padding:9px 11px;
  border:0;
  border-bottom:1px solid #202530;
  border-radius:0;
  background:transparent;
  color:#e8ebf1;
  font:13px/1.25 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  text-align:left;
  cursor:pointer;
  touch-action:manipulation;
  -webkit-tap-highlight-color:transparent;
}
.result:last-child{border-bottom:0}
.result:hover,.result:focus-visible{outline:0;background:#1b2230}
.result:active{background:#263147}
.no-results{
  display:grid;
  min-height:132px;
  place-items:center;
  padding:16px;
  color:#858d9b;
  font:13px/1.3 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.controller{
  display:flex;
  flex-direction:column;
  gap:8px;
  width:100%;
  min-width:0;
  padding:10px 12px 12px;
  border-top:1px solid #1d222c;
  background:linear-gradient(180deg,#171b24,#0e1118);
  touch-action:none;
  user-select:none;
  -webkit-user-select:none;
}
.shoulders{
  display:flex;
  justify-content:space-between;
  gap:8px;
}
.shoulders .control{
  width:96px;
  min-height:34px;
  border-radius:8px;
  font-size:13px;
  color:#cbd1dc;
}
.main-controls{
  display:grid;
  grid-template-columns:132px minmax(56px,1fr) auto;
  align-items:center;
  gap:8px;
}
.dpad{
  display:grid;
  grid-template-columns:repeat(3,44px);
  grid-template-rows:repeat(3,44px);
}
.dpad [data-index="4"]{grid-column:2;grid-row:1}
.dpad [data-index="6"]{grid-column:1;grid-row:2}
.dpad [data-index="7"]{grid-column:3;grid-row:2}
.dpad [data-index="5"]{grid-column:2;grid-row:3}
.system-buttons{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:6px;
  min-width:0;
}
.action-buttons{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:8px;
}
.control{
  display:grid;
  min-width:44px;
  min-height:44px;
  margin:0;
  padding:0;
  place-items:center;
  border:1px solid #414958;
  color:#f4f6f9;
  background:#262c38;
  font:700 18px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  cursor:pointer;
  touch-action:none;
  -webkit-tap-highlight-color:transparent;
}
.control:focus-visible{outline:2px solid #8ca3ff;outline-offset:2px}
.control[data-pressed="true"]{
  transform:translateY(1px) scale(.96);
  border-color:#7b8aa7;
  background:#4b576e;
}
.dpad .control{border-radius:8px}
.system-buttons .control{
  width:58px;
  border-radius:999px;
  color:#cbd1dc;
  font-size:9px;
  letter-spacing:.04em;
  text-transform:uppercase;
}
.action-buttons .control{
  width:52px;
  height:52px;
  border-color:#7d394f;
  border-radius:50%;
  background:#70263f;
}
.action-buttons .control[data-pressed="true"]{
  border-color:#d56a8d;
  background:#a1395d;
}
@media(max-width:420px){
  .controller{
    grid-template-columns:132px minmax(50px,1fr) 52px;
    gap:5px;
    padding:8px 6px 10px;
  }
  .action-buttons{flex-direction:column;gap:6px}
  .action-buttons .control{width:48px;height:48px}
}
`

function asData(value: unknown): RetroEmuData {
  return value as RetroEmuData
}

function normalized(value: string): string {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

function romUrlFor(game: Game): string {
  return ROM_BASE + encodeURIComponent(game.file)
}

function findGame(query: string): Game | undefined {
  const needle = normalized(query.trim())
  if (!needle) return undefined

  let best: { game: Game; rank: number } | undefined
  for (const game of GAME_LIST) {
    const candidate = normalized(game.name)
    const rank = candidate === needle
      ? 3
      : candidate.includes(needle)
        ? 2
        : needle.includes(candidate)
          ? 1
          : 0
    if (!rank) continue

    if (
      !best ||
      rank > best.rank ||
      (rank === best.rank && game.name.length < best.game.name.length)
    ) {
      best = { game, rank }
    }
  }
  return best?.game
}

function resolveGame(data: RetroEmuData): ResolvedGame | undefined {
  const directUrl = data.romUrl?.trim()
  if (directUrl) {
    return {
      gameName: data.gameName?.trim() || 'Game Boy Advance',
      romUrl: directUrl,
    }
  }

  const match = data.gameName ? findGame(data.gameName) : undefined
  return match
    ? { gameName: match.name, romUrl: romUrlFor(match) }
    : undefined
}

function scriptValue(value: string): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function emulatorSrcdoc(game: ResolvedGame): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
html,body,#game{width:100%;height:100%;margin:0;overflow:hidden;background:#000}
*{box-sizing:border-box}
.ejs_virtualGamepad_parent,.ejs_virtualGamepad_top,.ejs_virtualGamepad_left,
.ejs_virtualGamepad_right,.ejs_virtualGamepad_bottom,
[class*="ejs_virtualGamepad"],[class*="virtual-gamepad"]{display:none!important}
</style>
</head>
<body>
<div id="game"></div>
<script>
window.EJS_player = '#game';
window.EJS_core = 'gba';
window.EJS_pathtodata = ${scriptValue(EMULATOR_DATA)};
// EJS_paths(=config.filePaths):按文件名把 mGBA 核心重定向到 jsDelivr @emulatorjs/core-mgba,
// 摆脱 cdn.emulatorjs.org failsafe → 全链路 jsDelivr,兼容 AI 宿主白名单。
window.EJS_paths = {
  'mgba.json': ${scriptValue(CORE_BASE + 'reports/mgba.json')},
  'mgba-legacy-wasm.data': ${scriptValue(CORE_BASE + 'mgba-legacy-wasm.data')},
  'mgba-wasm.data': ${scriptValue(CORE_BASE + 'mgba-wasm.data')},
  'mgba-thread-wasm.data': ${scriptValue(CORE_BASE + 'mgba-thread-wasm.data')},
  'mgba-thread-legacy-wasm.data': ${scriptValue(CORE_BASE + 'mgba-thread-legacy-wasm.data')}
};
window.EJS_gameUrl = ${scriptValue(game.romUrl)};
window.EJS_gameName = ${scriptValue(game.gameName)};
window.EJS_startOnLoaded = true;
window.EJS_Buttons = { gamepad: false };

const ovKeys = {
  0: { key: 'x', code: 'KeyX', keyCode: 88 },
  2: { key: 'v', code: 'KeyV', keyCode: 86 },
  3: { key: 'Enter', code: 'Enter', keyCode: 13 },
  4: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
  5: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
  6: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
  7: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
  8: { key: 'z', code: 'KeyZ', keyCode: 90 },
  10: { key: 'a', code: 'KeyA', keyCode: 65 },
  11: { key: 's', code: 'KeyS', keyCode: 83 }
};

function ovKeyboardFallback(index, value) {
  const mapping = ovKeys[index];
  if (!mapping) return;
  const keyboardEvent = new KeyboardEvent(value ? 'keydown' : 'keyup', {
    key: mapping.key,
    code: mapping.code,
    bubbles: true,
    cancelable: true
  });
  try {
    Object.defineProperties(keyboardEvent, {
      keyCode: { get: () => mapping.keyCode },
      which: { get: () => mapping.keyCode }
    });
  } catch (_) {}
  document.dispatchEvent(keyboardEvent);
}

window.addEventListener('message', (event) => {
  const message = event.data;
  if (!message || message.type !== 'ov-input') return;

  const index = Number(message.index);
  const value = message.value ? 1 : 0;
  let handled = false;
  try {
    const functions = window.EJS_emulator &&
      window.EJS_emulator.gameManager &&
      window.EJS_emulator.gameManager.functions;
    if (functions && typeof functions.simulateInput === 'function') {
      functions.simulateInput(0, index, value);
      handled = true;
    }
  } catch (_) {}

  if (!handled) ovKeyboardFallback(index, value);
});
</script>
<script src="${EMULATOR_LOADER}"></script>
</body>
</html>`
}

function makeControl(label: string, index: number, visibleLabel = label): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'control'
  button.textContent = visibleLabel
  button.dataset.index = String(index)
  button.dataset.pressed = 'false'
  button.setAttribute('aria-label', label)
  return button
}

class RetroemuComponent {
  private readonly root: ShadowRoot
  private readonly context: AdapterContext
  private frame: HTMLIFrameElement | null = null
  private renderAbort: AbortController | null = null
  private releaseInputs: Array<() => void> = []
  private state: { gameName: string | null; romUrl: string | null } = {
    gameName: null,
    romUrl: null,
  }

  constructor(context: AdapterContext) {
    this.root = context.root
    this.context = context
    this.render(context.data)
  }

  update(data: unknown): void {
    this.render(data)
  }

  getState(): unknown {
    return { ...this.state }
  }

  destroy(): void {
    this.teardownRender()
    this.root.replaceChildren()
  }

  private teardownRender(): void {
    for (const release of this.releaseInputs) release()
    this.releaseInputs = []
    this.renderAbort?.abort()
    this.renderAbort = null
    if (this.frame) {
      this.frame.src = 'about:blank'
      this.frame.removeAttribute('srcdoc')
      this.frame = null
    }
  }

  private render(value: unknown): void {
    this.teardownRender()

    const data = asData(value)
    const game = resolveGame(data)
    const height = Math.round(data.height ?? DEFAULT_HEIGHT)
    const abort = new AbortController()
    this.renderAbort = abort

    const style = document.createElement('style')
    style.textContent = COMPONENT_CSS

    const wrapper = document.createElement('div')
    wrapper.className = 'retroemu'
    wrapper.style.setProperty('--retroemu-height', `${height}px`)

    if (game) {
      const iframe = document.createElement('iframe')
      iframe.className = 'screen'
      iframe.title = `${game.gameName} GBA emulator`
      iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad')
      iframe.srcdoc = emulatorSrcdoc(game)
      this.frame = iframe

      wrapper.append(iframe, this.createController(abort.signal))
      this.state = { gameName: game.gameName, romUrl: game.romUrl }
    } else {
      wrapper.appendChild(this.createPicker(height, abort.signal))
      this.state = { gameName: null, romUrl: null }
    }

    this.root.replaceChildren(style, wrapper)
  }

  private createPicker(height: number, signal: AbortSignal): HTMLDivElement {
    const picker = document.createElement('div')
    picker.className = 'picker'

    const search = document.createElement('input')
    search.className = 'search'
    search.type = 'search'
    search.placeholder = 'Search games'
    search.autocomplete = 'off'
    search.spellcheck = false
    search.setAttribute('aria-label', 'Search Game Boy Advance games')

    const results = document.createElement('div')
    results.className = 'results'
    results.setAttribute('role', 'listbox')
    results.setAttribute('aria-label', 'Game Boy Advance games')

    const choose = (game: Game): void => {
      this.context.emit('select', {
        gameName: game.name,
        romUrl: romUrlFor(game),
      })
      this.render({
        gameName: game.name,
        romUrl: romUrlFor(game),
        height,
      })
    }

    const showResults = (): void => {
      const needle = normalized(search.value.trim())
      const matches = needle
        ? GAME_LIST.filter((game) => normalized(game.name).includes(needle)).slice(0, RESULT_LIMIT)
        : GAME_LIST.slice(0, RESULT_LIMIT)

      results.replaceChildren()
      if (!matches.length) {
        const empty = document.createElement('div')
        empty.className = 'no-results'
        empty.textContent = 'No matches'
        results.appendChild(empty)
        return
      }

      const fragment = document.createDocumentFragment()
      for (const game of matches) {
        const row = document.createElement('button')
        row.type = 'button'
        row.className = 'result'
        row.textContent = game.name
        row.setAttribute('role', 'option')
        row.addEventListener('click', () => choose(game), { signal })
        fragment.appendChild(row)
      }
      results.appendChild(fragment)
    }

    search.addEventListener('input', showResults, { signal })
    picker.append(search, results)
    showResults()
    queueMicrotask(() => {
      if (!signal.aborted) search.focus({ preventScroll: true })
    })
    return picker
  }

  private createController(signal: AbortSignal): HTMLDivElement {
    const controller = document.createElement('div')
    controller.className = 'controller'
    controller.setAttribute('aria-label', 'Game Boy Advance controls')

    // 肩键行(GBA L/R)—— 索引 10/11
    const shoulders = document.createElement('div')
    shoulders.className = 'shoulders'
    shoulders.append(
      makeControl('L', 10),
      makeControl('R', 11),
    )

    const dpad = document.createElement('div')
    dpad.className = 'dpad'
    dpad.append(
      makeControl('Up', 4, '↑'),
      makeControl('Left', 6, '←'),
      makeControl('Right', 7, '→'),
      makeControl('Down', 5, '↓'),
    )

    const systemButtons = document.createElement('div')
    systemButtons.className = 'system-buttons'
    systemButtons.append(
      makeControl('Select', 2),
      makeControl('Start', 3),
    )

    const actionButtons = document.createElement('div')
    actionButtons.className = 'action-buttons'
    actionButtons.append(
      makeControl('B', 0),
      makeControl('A', 8),
    )

    const main = document.createElement('div')
    main.className = 'main-controls'
    main.append(dpad, systemButtons, actionButtons)

    controller.append(shoulders, main)
    for (const button of controller.querySelectorAll<HTMLButtonElement>('.control')) {
      this.bindInput(button, Number(button.dataset.index), signal)
    }
    return controller
  }

  private bindInput(button: HTMLButtonElement, index: number, signal: AbortSignal): void {
    let pressed = false
    const send = (value: 0 | 1): void => {
      if (pressed === Boolean(value)) return
      pressed = Boolean(value)
      button.dataset.pressed = String(pressed)
      this.frame?.contentWindow?.postMessage({ type: 'ov-input', index, value }, '*')
    }
    const down = (event: Event): void => {
      event.preventDefault()
      if (typeof PointerEvent !== 'undefined' && event instanceof PointerEvent) {
        try {
          button.setPointerCapture(event.pointerId)
        } catch {
          // Pointer capture is best effort.
        }
      }
      send(1)
    }
    const up = (event: Event): void => {
      event.preventDefault()
      send(0)
    }
    const keyDown = (event: KeyboardEvent): void => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      send(1)
    }
    const keyUp = (event: KeyboardEvent): void => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      send(0)
    }

    button.addEventListener('pointerdown', down, { signal })
    button.addEventListener('pointerup', up, { signal })
    button.addEventListener('pointerleave', up, { signal })
    button.addEventListener('pointercancel', up, { signal })
    button.addEventListener('touchstart', down, { passive: false, signal })
    button.addEventListener('touchend', up, { passive: false, signal })
    button.addEventListener('touchcancel', up, { passive: false, signal })
    button.addEventListener('keydown', keyDown, { signal })
    button.addEventListener('keyup', keyUp, { signal })
    button.addEventListener('contextmenu', (event) => event.preventDefault(), { signal })

    this.releaseInputs.push(() => send(0))
  }
}

function validateData(value: unknown): OVError | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return new OVError({
      code: 'schema-invalid',
      plane: 'data',
      path: '$',
      expected: '{ romUrl?: string, gameName?: string, height?: number }',
      got: value,
      message_ai: 'retroemu data must be an object.',
    })
  }

  const data = value as Record<string, unknown>
  if (data.romUrl !== undefined && typeof data.romUrl !== 'string') {
    return new OVError({
      code: 'schema-invalid',
      plane: 'data',
      path: '$.romUrl',
      expected: 'string',
      got: data.romUrl,
      message_ai: 'retroemu data.romUrl must be a string.',
    })
  }
  if (data.gameName !== undefined && typeof data.gameName !== 'string') {
    return new OVError({
      code: 'schema-invalid',
      plane: 'data',
      path: '$.gameName',
      expected: 'string',
      got: data.gameName,
      message_ai: 'retroemu data.gameName must be a string.',
    })
  }
  if (
    data.height !== undefined &&
    (typeof data.height !== 'number' || !Number.isFinite(data.height) || data.height <= 0)
  ) {
    return new OVError({
      code: 'schema-invalid',
      plane: 'data',
      path: '$.height',
      expected: 'positive finite number',
      got: data.height,
      message_ai: 'retroemu data.height must be a positive finite number.',
    })
  }
  return null
}

const retroemuAdapter: Adapter = {
  id: 'retroemu',
  validateData,
  create: (context) => new RetroemuComponent(context),
}

register(retroemuAdapter)

export { mount, listIds, OVError }
export type { Adapter, MountOptions, EventDetail }
