import React from "react";
import type { TextNode } from "../../../types";
import { applyMarks } from "../../../helpers.tsx";
import { NodeRenderer } from "../NodeRenderer";

export const TextRenderer = ({ node }: { node: TextNode }) => {
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
