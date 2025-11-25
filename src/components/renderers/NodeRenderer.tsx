import type { ContractNode, TextNode } from "../../types";
import { isTextNode } from "../../helpers";
import { TextRenderer } from "./elements/TextRenderer";
import { ElementRenderer } from "./ElementRenderer";

export const NodeRenderer = ({
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
