# Contract Renderer

This project is a React-based contract rendering engine built with TypeScript and Vite. It takes a JSON representation of a legal document and renders it into a styled, interactive web page.

## Features

- **Recursive Rendering**: Handles deeply nested document structures including blocks, lists, and paragraphs.
- **Rich Text Formatting**: Supports bold, italic, and underlined text, including nested formatting.
- **Clauses & Numbering**: Implements complex legal numbering logic (e.g., 1., 1(a), 1(a)(i)) that persists across the document.
- **Interactive Mentions**: Supports "variable" fields (Mentions) that are synchronized across the document. Updating one instance updates all other instances of the same variable in real-time.
- **Modular Architecture**: Built with a clear separation of concerns using Context API for state management and specialized sub-renderers.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

1.  Clone the repository.
2.  Install dependencies:

```bash
npm install
```

### Running the Application

To start the local development server:

```bash
npm run dev
```

The application will load the sample contract defined in `src/input.json`.

## Development & Testing

### Storybook

We use Storybook for component development and visual testing. It provides isolated environments to view different states of the renderer (e.g., lists, nested clauses, formatting), and we've also done some tests to verify what is in the notion doc is being displayed.

To start Storybook:

```bash
npm run storybook
```

### Unit & Integration Tests

The project uses **Vitest** and **React Testing Library** for testing. The test suite covers:

- Unit tests for helper functions.
- Component tests for renderers.
- Interaction tests for the Mentions feature.
- Visual structure tests for Clause numbering.

To run the tests:

```bash
npm test
```

## Architecture

The rendering logic is split into specialized components found in `src/components/renderers/`:

- **`ContractRenderer`**: The entry point that initializes the `MentionContext` and `ClauseContext`, and turns out JSON into a series of nodes.
- **`NodeRenderer`**: Dispatches rendering to specific sub-renderers based on node type.
- **`ElementRenderer`**: Handles structural elements (`block`, `ul`, `li`, etc.).
- **`ClauseRenderer`**: Manages the CSS counters for legal numbering logic.
- **`MentionRenderer`**: Handles the interactive input fields for variables - this looks after mentions
- **`TextRenderer`**: Renders text nodes with applied formatting marks.

State management for mentions and clause nesting depth is handled via React Contexts to avoid prop drilling.
