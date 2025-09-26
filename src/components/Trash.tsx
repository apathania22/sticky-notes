// The fixed trash dropzone (turns “hot” when a dragging note overlaps).
import React from "react";

export const Trash = React.forwardRef<HTMLDivElement, { hot: boolean }>(
  ({ hot }, ref) => <div ref={ref} className={`trash ${hot ? "hot" : ""}`}>🗑️ Trash</div>
);

Trash.displayName = "Trash";
