import "./App.css";
import { ContractRenderer } from "./components/ContractRenderer";
import inputData from "./input.json";
import type { ContractNode } from "./types";

function App() {
  return (
    <div className="app-container">
      <ContractRenderer data={inputData as unknown as ContractNode[]} />
    </div>
  );
}

export default App;
