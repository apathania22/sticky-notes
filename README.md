**Sticky Notes**

A tiny single-page app for desktop that lets you create and manage sticky notes:
  - Create notes (fixed size) with predefined colors (round-robin).
  - Edit text directly inside the note.
  - Drag to move notes around the board.
  - Delete by dropping a note onto the Trash zone.
  - Persist notes to LocalStorage (restored on reload).

**Architecture**

The app keeps things intentionally small and readable. A single stateful component, Board, owns the entire notes array (Note[]). It handles creation, drag-to-move, trash-to-delete, and persistence (save on change, lazy-load on startup). The drag action is stored in a ref so mousemove events don’t cause constant re-renders; the board converts global mouse coordinates to board-relative ones and clamps positions to keep notes visible.

Presentational components are deliberately dumb: Toolbar (create button + hint), Note (renders one note, raises onMoveStart and onTextChange), and Trash (fixed drop zone that highlights when a dragged note overlaps). Small, pure helpers live in utils/geometry.ts (clamp, rectsOverlap), and shared types in models.ts. Styling is plain CSS in App.css. This split makes each piece easy to skim, swap, or test without introducing frameworks or complex state managers.

***Running locally***
Prereqs
- Node.js 18+ and npm (or pnpm/yarn)

Setup
```
  cd sticky-notes
  npm install
```

Start dev server
```
  npm run dev
```