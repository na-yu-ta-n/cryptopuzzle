# Agent Notes

## Project

- React + Vite + TypeScript frontend
- Tauri v2 desktop wrapper
- State: Zustand with `persist` via `src/utils/storage.ts`
- UI: MUI (Material UI) + Framer Motion
- Package manager: pnpm

## Verification

- Type check: `npx tsc --noEmit`
- Production build: `pnpm run build` (runs `tsc && vite build`)

## Structure

- `src/components/` — screen-level React components
  - `puzzle/` — `PuzzleGame` subcomponents (`PuzzleHeader`, `PuzzleBoard`, `PuzzleKeyboard`, `WinOverlay`)
- `src/hooks/` — shared React hooks (`usePuzzleKeyboard`, `useWinCelebration`)
- `src/stores/` — Zustand store (`useAppStore`)
- `src/utils/` — domain utilities (`cipher`, `materials`, `puzzle`, `labels`, `life`, `srs`, `stats`, `date`, etc.)
- `src/data/` — course/lesson data

## Notes

- No unit tests or linter are currently configured.
- `src/App.css` is not imported anywhere; it appears to be leftover from the Vite template.
