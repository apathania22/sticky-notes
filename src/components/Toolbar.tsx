//The simple top bar with a Create button and hint text.
export function Toolbar({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="toolbar">
      <div>
        <strong className="title">Sticky Notes (simple)</strong>
        <span className="hint">Create → edit text → drag to move → drop on Trash to delete</span>
      </div>
      <div>
        <button className="btn" onClick={onCreate}>Create Note</button>
      </div>
    </div>
  );
}
