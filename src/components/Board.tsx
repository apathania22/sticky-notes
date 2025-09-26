// The stateful “engine”: notes state, drag-to-move, trash-to-delete,
// create button handler, and localStorage load/save.
import React, { useEffect, useRef, useState } from "react";
import { Note } from "../components/Note";
import { Toolbar } from "../components/Toolbar";
import { Trash } from "../components/Trash";
import { clamp, rectsOverlap } from "../utils/geometry";
import type { NoteType, Rect } from "../types/models";
import { STORAGE_KEY,NOTE_H, NOTE_W, COLORS } from "../constants/constants";

function nextIdFrom(notes: NoteType[]) {
  return notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
}

export function Board() {
  // Lazy-init from localStorage so we start with persisted notes immediately.
  const [notes, setNotes] = useState<NoteType[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const boardRef = useRef<HTMLDivElement | null>(null);
  const trashRef = useRef<HTMLDivElement | null>(null);

  // Current drag action (only “move”), kept in a ref to avoid re-rendering every mousemove.
  const actionRef = useRef<null | { type: "move"; id: number; offsetX: number; offsetY: number }>(null);

  // Save whenever notes change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch(err){
      console.log(err)
    }
  }, [notes]);

  // Global mouse handlers so the drag keeps working outside the note element.
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!actionRef.current) return;
      const board = boardRef.current;
      if (!board) return;

      const box = board.getBoundingClientRect();
      const mouseX = e.clientX - box.left;
      const mouseY = e.clientY - box.top;

      const { id, offsetX, offsetY } = actionRef.current;
      setNotes((old) =>
        old.map((n) =>
          n.id === id
            ? {
                ...n,
                x: clamp(mouseX - offsetX, 0, Math.max(0, box.width - n.w)),
                y: clamp(mouseY - offsetY, 0, Math.max(0, box.height - n.h)),
              }
            : n
        )
      );
    }

    function onMouseUp() {
      if (!actionRef.current) return;
      const act = actionRef.current;
      actionRef.current = null;

      // On drop, delete if overlapping Trash (compare in screen coords).
      const board = boardRef.current;
      const trash = trashRef.current;
      if (!board || !trash) return;

      const b = board.getBoundingClientRect();
      const t = trash.getBoundingClientRect();
      const n = notes.find((n) => n.id === act.id);
      if (!n) return;

      const noteOnScreen: Rect = { x: b.left + n.x, y: b.top + n.y, w: n.w, h: n.h };
      const trashRect: Rect = { x: t.left, y: t.top, w: t.width, h: t.height };
      if (rectsOverlap(noteOnScreen, trashRect)) {
        setNotes((old) => old.filter((x) => x.id !== n.id));
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [notes]);

  // Create a new fixed-size note with random color.
  function createNote() {
    const board = boardRef.current;
    const box = board?.getBoundingClientRect();
    const boardW = box?.width ?? window.innerWidth;
    const boardH = box?.height ?? window.innerHeight;

    const n = notes.length;
    const baseX = 24 + (n * 18) % Math.max(24, boardW - NOTE_W - 24);
    const baseY = 24 + (n * 18) % Math.max(24, boardH - NOTE_H - 24);

    const newNote: NoteType = {
      id: nextIdFrom(notes),
      x: baseX,
      y: baseY,
      w: NOTE_W,
      h: NOTE_H,
      text: "",
      color: COLORS[n % COLORS.length],
    };
    setNotes((old) => [...old, newNote]);
  }

  // Begin moving a note.
  function startMove(e: React.MouseEvent, id: number) {
    if (e.button !== 0) return;
    e.stopPropagation();
    const board = boardRef.current!;
    const box = board.getBoundingClientRect();
    const n = notes.find((n) => n.id === id)!;
    const mouseX = e.clientX - box.left;
    const mouseY = e.clientY - box.top;
    actionRef.current = {
      type: "move",
      id,
      offsetX: mouseX - n.x,
      offsetY: mouseY - n.y,
    };
  }

  // True when the currently dragged note overlaps the Trash (for visual feedback).
  function trashHot(): boolean {
    const act = actionRef.current;
    if (!act) return false;
    const board = boardRef.current;
    const trash = trashRef.current;
    if (!board || !trash) return false;

    const b = board.getBoundingClientRect();
    const t = trash.getBoundingClientRect();
    const n = notes.find((n) => n.id === act.id);
    if (!n) return false;

    const noteOnScreen: Rect = { x: b.left + n.x, y: b.top + n.y, w: n.w, h: n.h };
    const trashRect: Rect = { x: t.left, y: t.top, w: t.width, h: t.height };
    return rectsOverlap(noteOnScreen, trashRect);
  }

  return (
    <div>
      <Toolbar onCreate={createNote} />
      <div className="board" ref={boardRef}>
        {notes.map((n) => (
          <Note
            key={n.id}
            note={n}
            onMoveStart={startMove}
            onTextChange={(id, text) =>
              setNotes((old) => old.map((m) => (m.id === id ? { ...m, text } : m)))
            }
          />
        ))}
      </div>
      <Trash ref={trashRef} hot={trashHot()} />
    </div>
  );
}
