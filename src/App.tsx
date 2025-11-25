import "./App.css";

function App() {
  return (
    <div className="contract-container">
      <header className="contract-header">
        <h1>{"Sample Output"}</h1>
        <div className="contract-meta">
          <span className="id">ID: 1234567890</span>
          <span className={`status status-active`}>Active</span>
          <span className="date">Date: 2025-01-01</span>
        </div>
      </header>

      <section className="parties-section">
        <h2>Parties Involved</h2>
        <div className="parties-grid">
          <div className="party-card">
            <h3>Party 1</h3>
            <p>
              <strong>Name</strong>
            </p>
            <p className="address">Address 1</p>
          </div>
        </div>
      </section>

      <section className="contract-content">
        <h2>Sample Output</h2>
        <h2>Terms and Conditions</h2>
        <p>This is a sample output of the contract.</p>
      </section>

      <footer className="contract-footer">
        <p>End of Document</p>
      </footer>
    </div>
  );
}

export default App;
