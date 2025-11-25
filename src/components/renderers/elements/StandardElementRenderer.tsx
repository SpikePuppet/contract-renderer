import React from "react";
import type { ElementNode } from "../../../types";
import { applyMarks } from "../../../helpers";
import { NodeRenderer } from "../NodeRenderer";

export const StandardElementRenderer = ({
  node,
  parentType,
}: {
  node: ElementNode;
  parentType?: string;
}) => {
  const { type, children, text } = node;

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
      return (
        <div className="contract-list-content">{applyMarks(content, node)}</div>
      );
    default:
      // @ts-expect-error - exhaustive check
      return <div className={`contract-element-${type}`}>{applyMarks(content, node)}</div>;
  }
};
