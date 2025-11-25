import type { ElementNode } from "../../../types";
import { ClauseContext } from "../../../contexts/ClauseContext";
import { applyMarks } from "../../../helpers.tsx";
import { NodeRenderer } from "../NodeRenderer";
import { useContext } from "react";

export const ClauseRenderer = ({ node }: { node: ElementNode }) => {
  const clauseDepth = useContext(ClauseContext);

  const content = node.children.map((child, index) => (
    <NodeRenderer key={index} node={child} parentType={node.type} />
  ));

  return (
    <ClauseContext.Provider value={clauseDepth + 1}>
      <section className="contract-clause" data-depth={clauseDepth}>
        {applyMarks(content, node)}
      </section>
    </ClauseContext.Provider>
  );
};
