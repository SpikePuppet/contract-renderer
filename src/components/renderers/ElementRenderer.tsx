import type { ElementNode } from "../../types";
import { ClauseRenderer } from "./elements/ClauseRenderer";
import { MentionRenderer } from "./elements/MentionRenderer";
import { StandardElementRenderer } from "./elements/StandardElementRenderer";

export const ElementRenderer = ({
  node,
  parentType,
}: {
  node: ElementNode;
  parentType?: string;
}) => {
  switch (node.type) {
    case "clause":
      return <ClauseRenderer node={node} />;
    case "mention":
      return <MentionRenderer node={node} />;
    default:
      return <StandardElementRenderer node={node} parentType={parentType} />;
  }
};
