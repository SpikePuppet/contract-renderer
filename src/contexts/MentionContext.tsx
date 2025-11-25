import { createContext } from "react";
import type { MentionContextType } from "../types";

export const MentionContext = createContext<MentionContextType>({
  values: {},
  updateValue: () => {},
});
