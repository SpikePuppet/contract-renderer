import type { ContractNode } from "../types";
import { ClauseContext } from "../contexts/ClauseContext";
import { MentionContext } from "../contexts/MentionContext";
import { useMentionValues } from "../hooks/useMentionValues";
import { NodeRenderer } from "./renderers/NodeRenderer";

export const ContractRenderer = ({ data }: { data: ContractNode[] }) => {
  const { values, updateValue } = useMentionValues(data);

  return (
    <div className="contract-renderer">
      <MentionContext.Provider value={{ values, updateValue }}>
        <ClauseContext.Provider value={0}>
          {data.map((node, index) => (
            <NodeRenderer key={index} node={node} />
          ))}
        </ClauseContext.Provider>
      </MentionContext.Provider>
    </div>
  );
};
