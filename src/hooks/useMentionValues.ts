import { useState, useEffect, useCallback } from "react";
import type { ContractNode } from "../types";
import { extractMentions } from "../helpers";

export const useMentionValues = (data: ContractNode[]) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    extractMentions(data)
  );

  useEffect(() => {
    setValues(extractMentions(data));
  }, [data]);

  const updateValue = useCallback((id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  return { values, updateValue };
};
