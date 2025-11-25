import React from 'react';
import type { ContractNode, ElementNode, TextNode } from '../types';

const isTextNode = (node: ContractNode): node is TextNode => {
  return 'text' in node && !('type' in node);
};

const TextRenderer = ({ node }: { node: TextNode }) => {
  const style: React.CSSProperties = {};
  if (node.bold) style.fontWeight = 'bold';
  if (node.italic) style.fontStyle = 'italic';
  if (node.underline) style.textDecoration = 'underline';
  if (node.color) style.color = node.color;

  // Handle newline characters in text
  if (node.text.includes('\n')) {
     return <span style={{ whiteSpace: 'pre-wrap', ...style }}>{node.text}</span>;
  }

  return <span style={style}>{node.text}</span>;
};

const ElementRenderer = ({ node, parentType }: { node: ElementNode; parentType?: string }) => {
  const { type, children, text, color } = node;

  const markStyle: React.CSSProperties = {};
  if (node.bold) markStyle.fontWeight = 'bold';
  if (node.italic) markStyle.fontStyle = 'italic';
  if (node.underline) markStyle.textDecoration = 'underline';

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

  switch (type) {
    case 'block':
      return <div className="contract-block" style={markStyle}>{renderChildren()}</div>;
    case 'h1':
      return <h1 className="contract-title" style={markStyle}>{renderChildren()}</h1>;
    case 'h4':
      return <h4 className="contract-subtitle" style={markStyle}>{renderChildren()}</h4>;
    case 'p':
      // If a paragraph is nested inside another paragraph, render it as a span to avoid invalid HTML
      // and broken layout.
      if (parentType === 'p') {
         return <span className="contract-text-inline" style={markStyle}>{renderChildren()}</span>;
      }
      return <p className="contract-text" style={markStyle}>{renderChildren()}</p>;
    case 'ul':
      return <ul className="contract-list" style={markStyle}>{renderChildren()}</ul>;
    case 'li':
      return <li className="contract-list-item" style={markStyle}>{renderChildren()}</li>;
    case 'lic':
        // List item content
        return <div className="contract-list-content" style={markStyle}>{renderChildren()}</div>;
    case 'clause':
        return <section className="contract-clause" style={markStyle}>{renderChildren()}</section>;
    case 'mention':
        return (
            <span 
                className="contract-mention" 
                style={{ 
                    backgroundColor: color,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    ...markStyle
                }}
            >
                {renderChildren()}
            </span>
        );
    default:
      return <div className={`contract-element-${type}`} style={markStyle}>{renderChildren()}</div>;
  }
};

const NodeRenderer = ({ node, parentType }: { node: ContractNode; parentType?: string }) => {
  if (isTextNode(node)) {
    return <TextRenderer node={node} />;
  }
  return <ElementRenderer node={node} parentType={parentType} />;
};

export const ContractRenderer = ({ data }: { data: ContractNode[] }) => {
  return (
    <div className="contract-renderer">
      {data.map((node, index) => (
        <NodeRenderer key={index} node={node} />
      ))}
    </div>
  );
};
