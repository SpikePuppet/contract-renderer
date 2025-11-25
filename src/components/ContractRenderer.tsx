import React, { createContext, useContext } from "react";
import type { ContractNode, ElementNode, TextNode } from "../types";

// Context to track clause nesting level
const ClauseContext = createContext<number>(0);

const isTextNode = (node: ContractNode): node is TextNode => {
  return "text" in node && !("type" in node);
};

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

  // Combine text and children
  // NOTE: In standard DOM/React, if we wrap 'content' in a span/strong/em, we usually want the children to be OUTSIDE or INSIDE depending on semantics.
  // Given the JSON structure { text: "...", children: [...] }, it implies the node is a container that HAS text AND children.
  // If formatting is applied (bold: true), does it apply to the text only or the children too?
  // The prompt says "If a JSON object has a mark applied to it, that entire block should be rendered with the applied mark, including any nested elements."
  // So the children should ALSO be wrapped in the formatting tags.
  
  if (childrenContent) {
      content = <>{content}{childrenContent}</>;
  }

  // If there are styles, wrap in a span
  if (Object.keys(style).length > 0) {
    content = <span style={style}>{content}</span>;
  }

  // Apply semantic marks
  if (node.bold) {
    content = <strong>{content}</strong>;
  }
  if (node.italic) {
    content = <em>{content}</em>;
  }
  if (node.underline) {
    content = <u>{content}</u>;
  }

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

  // Helper to wrap content with semantic tags based on marks
  const wrapWithMarks = (content: React.ReactNode) => {
    let wrapped = content;
    if (node.bold) {
      wrapped = <strong>{wrapped}</strong>;
    }
    if (node.italic) {
      wrapped = <em>{wrapped}</em>;
    }
    if (node.underline) {
      wrapped = <u>{wrapped}</u>;
    }
    return wrapped;
  };

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
      return <div className="contract-block">{wrapWithMarks(content)}</div>;
    case "h1":
      return <h1 className="contract-title">{wrapWithMarks(content)}</h1>;
    case "h4":
      return <h4 className="contract-subtitle">{wrapWithMarks(content)}</h4>;
    case "p":
      // If a paragraph is nested inside another paragraph, render it as a span to avoid invalid HTML
      // and broken layout.
      if (parentType === "p") {
        return (
          <span className="contract-text-inline">{wrapWithMarks(content)}</span>
        );
      }
      return <p className="contract-text">{wrapWithMarks(content)}</p>;
    case "ul":
      return <ul className="contract-list">{wrapWithMarks(content)}</ul>;
    case "li":
      return <li className="contract-list-item">{wrapWithMarks(content)}</li>;
    case "lic":
      // List item content
      return (
        <div className="contract-list-content">{wrapWithMarks(content)}</div>
      );
    case "clause":
      return (
        <ClauseContext.Provider value={clauseDepth + 1}>
          <section className={clauseDepth === 0 ? "contract-clause-main" : "contract-clause-sub"}>
            {wrapWithMarks(content)}
          </section>
        </ClauseContext.Provider>
      );
    case "mention":
      // For mentions, we might want to keep the style on the span itself or wrap inside.
      // The requirement is semantic tags.
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
          {wrapWithMarks(content)}
        </span>
      );
    default:
      return (
        <div className={`contract-element-${type}`}>
          {wrapWithMarks(content)}
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
    return <TextRenderer node={node} />;
  }
  return <ElementRenderer node={node} parentType={parentType} />;
};

export const ContractRenderer = ({ data }: { data: ContractNode[] }) => {
  return (
    <div className="contract-renderer">
      <ClauseContext.Provider value={0}>
        {data.map((node, index) => (
          <NodeRenderer key={index} node={node} />
        ))}
      </ClauseContext.Provider>
    </div>
  );
};
