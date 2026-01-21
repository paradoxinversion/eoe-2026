import React from "react";

type Agent = {
  id: string;
  name: string;
  agentType?: string;
};

export default function AgentList({
  agents,
  onFocus,
  onActivate,
}: {
  agents: Agent[];
  // kept for backwards compatibility
  onFocus?: (a: Agent) => void;
  // preferred explicit handler for activation
  onActivate?: (a: Agent) => void;
}) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    // reset focus index when agents change
    setFocusedIndex(() => (agents && agents.length > 0 ? 0 : null));
  }, [agents]);

  function focusIndex(i: number) {
    setFocusedIndex(i);
    const container = listRef.current;
    if (!container) return;
    const item = container.querySelectorAll("[data-agent-row]")[i] as
      | HTMLDivElement
      | undefined;
    if (item) item.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, i: number, a: Agent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onFocus) onFocus(a);
      if (onActivate) onActivate(a);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(agents.length - 1, i + 1);
      focusIndex(next);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(0, i - 1);
      focusIndex(prev);
      return;
    }
  }

  return (
    <div role="list" aria-label="Personnel list" ref={listRef}>
      {agents.map((a, i) => {
        const isFocused = focusedIndex === i;
        return (
          <div
            key={a.id}
            data-agent-row
            role="listitem"
            tabIndex={0}
            aria-selected={isFocused}
            onFocus={() => setFocusedIndex(i)}
            onKeyDown={(e) => handleKeyDown(e, i, a)}
            style={{
              padding: 8,
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              outline: isFocused ? "2px solid #2E86AB" : "none",
              background: isFocused ? "rgba(46,134,171,0.06)" : "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() => {
              if (onFocus) onFocus(a);
              if (onActivate) onActivate(a);
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{a.agentType}</div>
            </div>
            <div>
              <button
                aria-label={`Focus ${a.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onFocus) onFocus(a);
                  if (onActivate) onActivate(a);
                }}
                onKeyDown={(e) => {
                  // keep keyboard behaviour simple: Enter on button also focuses
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (onFocus) onFocus(a);
                    if (onActivate) onActivate(a);
                  }
                }}
                style={{
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Focus
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
