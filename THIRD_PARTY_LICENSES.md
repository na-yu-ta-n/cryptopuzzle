# Third-Party Licenses

cryptopuzzle uses the following open-source libraries. All selected licenses are permissive and do not require source-code disclosure or impose copyleft obligations.

## Frontend / JavaScript

| Library | License | Notes |
|---------|---------|-------|
| React | MIT | UI library |
| React DOM | MIT | UI library |
| @mui/material | MIT | UI component library |
| @mui/icons-material | MIT | Icon set |
| @emotion/react / @emotion/styled | MIT | CSS-in-JS for MUI |
| framer-motion | MIT | Animations |
| canvas-confetti | ISC | Confetti effects |
| zustand | MIT | State management |
| date-fns | MIT | Date utilities |
| howler | MIT | Audio (currently unused at runtime; Web Audio API is used) |
| @fontsource/inter / @fontsource/poppins | OFL-1.1 | Open font licenses |
| @tauri-apps/api / plugins | MIT OR Apache-2.0 | Tauri JavaScript bindings |

## Rust / Tauri

| Library | License | Notes |
|---------|---------|-------|
| tauri | Apache-2.0 OR MIT | Application framework |
| tauri-plugin-opener | Apache-2.0 OR MIT | URL opener |
| tauri-plugin-store | Apache-2.0 OR MIT | Persistent storage |
| serde / serde_json | MIT OR Apache-2.0 | Serialization |

## Build tools

| Library | License |
|---------|---------|
| vite | MIT |
| @vitejs/plugin-react | MIT |
| typescript | Apache-2.0 |

All dependencies were chosen to avoid copyleft (GPL, LGPL, AGPL, MPL, etc.) and source-disclosure requirements.
