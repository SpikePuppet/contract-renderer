import React, { createContext, useContext, useState, useEffect } from "react";
import type { ContractNode, ElementNode, TextNode } from "../types";
import { extractMentions, isTextNode, applyMarks } from "../helpers.tsx";
import type { MentionContextType } from "../types";

// Context to track clause nesting level
const ClauseContext = createContext<number>(0);

const MentionContext = createContext<MentionContextType>({
  values: {},
  updateValue: () => {},
});

// Both in TextRenderer and ElementRenderer, we want to apply semantic tags where possible.
// This assists in accessibility for things like screen readers.
const TextRenderer = ({ node }: { node: TextNode }) => {
  let content: React.ReactNode = node.text;

  // Handle styles that don't have semantic tags (color, whitespace)
  const style: React.CSSProperties = {};
  if (node.color) {
    style.color = node.color;
  }
  if (node.text.includes("\n")) {
    style.whiteSpace = "pre-wrap";
  }

  // If children exist, render them after the text
  let childrenContent: React.ReactNode = null;
  if (node.children && node.children.length > 0) {
    childrenContent = node.children.map((child, index) => (
      <NodeRenderer key={index} node={child} />
    ));
  }

  if (childrenContent) {
    content = (
      <>
        {content}
        {childrenContent}
      </>
    );
  }

  // If there are styles, wrap in a span
  if (Object.keys(style).length > 0) {
    content = <span style={style}>{content}</span>;
  } else {
    content = <span>{content}</span>;
  }

  // Apply semantic marks
  content = applyMarks(content, node);

  return <>{content}</>;
};

const ElementRenderer = ({
  node,
  parentType,
}: {
  node: ElementNode;
  parentType?: string;
}) => {
  const { type, children, text, color } = node;
  const clauseDepth = useContext(ClauseContext);
  const { values, updateValue } = useContext(MentionContext);

  const renderChildren = () => {
    if (children) {
      return children.map((child, index) => (
        <NodeRenderer key={index} node={child} parentType={type} />
      ));
    }
    if (text) {
      return <span className="element-text">{text}</span>;
    }
    return null;
  };

  const content = renderChildren();

  switch (type) {
    case "block":
      return <div className="contract-block">{applyMarks(content, node)}</div>;
    case "h1":
      return <h1 className="contract-title">{applyMarks(content, node)}</h1>;
    case "h4":
      return <h4 className="contract-subtitle">{applyMarks(content, node)}</h4>;
    case "p":
      // If a paragraph is nested inside another paragraph, render it as a span to avoid invalid HTML
      // and broken layout.
      if (parentType === "p") {
        return (
          <span className="contract-text-inline">
            {applyMarks(content, node)}
          </span>
        );
      }
      return <p className="contract-text">{applyMarks(content, node)}</p>;
    case "ul":
      return <ul className="contract-list">{applyMarks(content, node)}</ul>;
    case "li":
      return (
        <li className="contract-list-item">{applyMarks(content, node)}</li>
      );
    case "lic":
      // List item content
      return (
        <div className="contract-list-content">{applyMarks(content, node)}</div>
      );
    case "clause":
      return (
        <ClauseContext.Provider value={clauseDepth + 1}>
          <section className="contract-clause" data-depth={clauseDepth}>
            {applyMarks(content, node)}
          </section>
        </ClauseContext.Provider>
      );
    case "mention":
      // If it has an ID, it's a variable mention
      if (node.id) {
        const currentValue = values[node.id] || node.value || "";
        return (
          <span
            className="contract-mention"
            style={{
              backgroundColor: color,
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
                width: `${Math.max(currentValue.length, 1)}ch`, // Simple auto-width
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
            backgroundColor: color,
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          {applyMarks(content, node)}
        </span>
      );
    default:
      return (
        <div className={`contract-element-${type}`}>
          {applyMarks(content, node)}
        </div>
      );
  }
};

const NodeRenderer = ({
  node,
  parentType,
}: {
  node: ContractNode;
  parentType?: string;
}) => {
  if (isTextNode(node)) {
    return <TextRenderer node={node as TextNode} />;
  }
  return <ElementRenderer node={node} parentType={parentType} />;
};

export const ContractRenderer = ({ data }: { data: ContractNode[] }) => {
  const [mentionValues, setMentionValues] = useState<Record<string, string>>(
    () => extractMentions(data),
  );

  // Update state if data prop changes (optional, but good practice if data can be swapped)
  useEffect(() => {
    setMentionValues(extractMentions(data));
  }, [data]);

  const updateValue = (id: string, value: string) => {
    setMentionValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="contract-renderer">
      <MentionContext.Provider value={{ values: mentionValues, updateValue }}>
        <ClauseContext.Provider value={0}>
          {data.map((node, index) => (
            <NodeRenderer key={index} node={node} />
          ))}
        </ClauseContext.Provider>
      </MentionContext.Provider>
    </div>
  );
};
