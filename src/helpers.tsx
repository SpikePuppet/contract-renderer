import React from "react";
import type { ContractNode, TextNode } from "./types";

export interface Marks {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// In this case, we specifically apply the actual semantic tags to the content,
// to ensure better accessibility.
export const applyMarks = (
  content: React.ReactNode,
  marks: Marks,
): React.ReactNode => {
  let wrapped = content;
  if (marks.bold) {
    wrapped = <strong>{wrapped}</strong>;
  }
  if (marks.italic) {
    wrapped = <em>{wrapped}</em>;
  }
  if (marks.underline) {
    wrapped = <u>{wrapped}</u>;
  }
  return wrapped;
};

export const extractMentions = (
  nodes: ContractNode[],
): Record<string, string> => {
  const mentions: Record<string, string> = {};
  const traverse = (nodes: ContractNode[]) => {
    nodes.forEach((node) => {
      if ("type" in node && node.type === "mention" && node.id && node.value) {
        if (!mentions[node.id]) {
          mentions[node.id] = node.value;
        }
      }
      // Check children for both ElementNode and TextNode (as TextNode now has optional children)
      if ("children" in node && node.children) {
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return mentions;
};

export const isTextNode = (node: ContractNode): node is TextNode => {
  return "text" in node && !("type" in node);
};
