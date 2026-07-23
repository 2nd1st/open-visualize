# retroemu

An inline Game Boy Advance emulator component for `@ov/runtime`, powered by
EmulatorJS. Importing the built ES module automatically registers the
`retroemu` adapter.

## Data

```ts
interface RetroEmuData {
  romUrl?: string
  gameName?: string
  height?: number
}
```

- `romUrl` loads that ROM directly and takes precedence over `gameName`.
- `gameName` is matched case-insensitively against the complete embedded
  `games.json` catalog using substring matching in both directions. The
  shortest name wins ties. An unmatched name opens the picker.
- With neither value, the component opens a compact searchable picker showing
  at most 40 results.
- `height` sets the emulator iframe height in CSS pixels and defaults to `360`.

```ts
import { mount } from './dist/index.mjs'

const handle = mount(host, 'retroemu', { gameName: 'Advance Wars' })
await handle.ready
```

The on-screen controller sits below the emulator iframe so it never covers the
game. It sends libretro inputs for D-pad, A, B, Start, and Select. EmulatorJS
and ROM files are loaded by the browser; they are not copied into this package.

## Build

```sh
npm run build
```

The ES build bundles `@ov/runtime`, so the emitted module has no runtime CDN
dependency.
