// A single note: fixed-size box with title and text area, draggable via onMouseDown.
import React from "react";
import type { NoteType } from "../types/models";

type Props = {
  note: NoteType;
  onMoveStart: (e: React.MouseEvent, id: number) => void;
  onTextChange: (id: number, text: string) => void;
};

export function Note({ note, onMoveStart, onTextChange }: Props) {
  return (
    <div
      className="note"
      onMouseDown={(e) => onMoveStart(e, note.id)}
      style={{ left: note.x, top: note.y, width: note.w, height: note.h, background: note.color }}
    >
      <div className="titlebar">Note #{note.id}</div>
      <textarea
        className="textarea"
        value={note.text}
        onChange={(e) => onTextChange(note.id, e.target.value)}
        // typing shouldn’t start a drag
        onMouseDown={(e) => e.stopPropagation()}  
        placeholder="Type..."
        aria-label={`Note ${note.id} text`}
      />
    </div>
  );
}
