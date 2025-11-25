import { useContext } from "react";
import type { ElementNode } from "../../../types";
import { MentionContext } from "../../../contexts/MentionContext";
import { applyMarks } from "../../../helpers.tsx";
import { NodeRenderer } from "../NodeRenderer";

export const MentionRenderer = ({ node }: { node: ElementNode }) => {
  const { values, updateValue } = useContext(MentionContext);

  const content = node.children.map((child, index) => (
    <NodeRenderer key={index} node={child} parentType={node.type} />
  ));

  // If it has an ID, it's a variable mention
  if (node.id) {
    const currentValue = values[node.id] || node.value || "";
    return (
      <span
        className="contract-mention"
        style={{
          backgroundColor: node.color,
          color: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          display: "inline-block",
        }}
      >
        <input
          value={currentValue}
          onChange={(e) => updateValue(node.id!, e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            font: "inherit",
            outline: "none",
            width: `${Math.max(currentValue.length, 1)}ch`,
            minWidth: "20px",
            padding: 0,
            margin: 0,
          }}
        />
      </span>
    );
  }

  // Fallback if no ID
  return (
    <span
      className="contract-mention"
      style={{
        backgroundColor: node.color,
        color: "white",
        padding: "2px 6px",
        borderRadius: "4px",
        display: "inline-block",
      }}
    >
      {applyMarks(content, node)}
    </span>
  );
};
