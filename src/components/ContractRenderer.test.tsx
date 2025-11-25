import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContractRenderer } from "./ContractRenderer";
import type { ContractNode } from "../types";

describe("ContractRenderer", () => {
  it("renders simple text", () => {
    const data: ContractNode[] = [{ text: "Hello World" }];
    render(<ContractRenderer data={data} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders text with formatting", () => {
    const data: ContractNode[] = [
      { text: "Bold Text", bold: true },
      { text: "Italic Text", italic: true },
      { text: "Underlined Text", underline: true },
      { text: "Colored Text", color: "red" },
    ];
    render(<ContractRenderer data={data} />);

    const bold = screen.getByText("Bold Text");
    // With semantic tags, the text is inside a strong/em/u tag.
    // screen.getByText returns the element containing the text.
    expect(bold.tagName).toBe("STRONG");

    const italic = screen.getByText("Italic Text");
    expect(italic.tagName).toBe("EM");

    const underline = screen.getByText("Underlined Text");
    expect(underline.tagName).toBe("U");

    const colored = screen.getByText("Colored Text");

    // Color needs to be an inline style
    expect(colored).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("renders h1 block with children", () => {
    const data: ContractNode[] = [
      {
        type: "h1",
        children: [{ text: "Title" }],
      },
    ];
    render(<ContractRenderer data={data} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Title");
    expect(heading).toHaveClass("contract-title");
  });

  it("renders p block with children", () => {
    const data: ContractNode[] = [
      {
        type: "p",
        children: [{ text: "Paragraph text" }],
      },
    ];
    render(<ContractRenderer data={data} />);
    const p = screen.getByText("Paragraph text");
    // It might match the span inside the p or the p itself depending on exact structure
    // But checking if it's in the document is a good start.
    // To check tag name:
    expect(p.tagName).toMatch(/^(P|SPAN)$/);
    expect(p).toBeInTheDocument();
  });

  it("renders mention block with specific styling", () => {
    const data: ContractNode[] = [
      {
        type: "mention",
        color: "blue",
        children: [{ text: "Mentioned Entity" }],
      },
    ];
    render(<ContractRenderer data={data} />);
    const mention = screen.getByText("Mentioned Entity");
    // The text is inside the span. The span has the style.
    // Let's find the parent element of the text which should be the mention span.
    // Or since mention renders children, the text 'Mentioned Entity' is a child text node.
    // The span wraps it.
    // screen.getByText returns the element containing the text. If TextRenderer returns a span, and Mention returns a span wrapping it.
    // Actually TextRenderer returns a span. Mention returns a span.
    // So: <span class="contract-mention" ...><span ...>Mentioned Entity</span></span>

    // Let's find by class name to be safe about structural checks
    const mentionEl = document.querySelector(".contract-mention");
    expect(mentionEl).toHaveTextContent("Mentioned Entity");
    expect(mentionEl).toHaveStyle({
      backgroundColor: "rgb(0, 0, 255)",
      color: "rgb(255, 255, 255)",
    });
  });

  it("applies marks to block elements (inheritance)", () => {
    const data: ContractNode[] = [
      {
        type: "block",
        bold: true,
        italic: true,
        underline: true,
        children: [
          {
            type: "p",
            children: [{ text: "Inherited Styles" }],
          },
        ],
      },
    ];
    render(<ContractRenderer data={data} />);

    // Now we expect semantic tags instead of styles on the block
    // The structure should be <div class="contract-block"><u><em><strong>...</strong></em></u></div>
    const block = document.querySelector(".contract-block");
    expect(block).toBeInTheDocument();

    // Check that the block contains the semantic tags
    // Note: The order of wrapping depends on the implementation.
    // Current impl: bold -> strong, italic -> em, underline -> u.
    // So wrapped: <u><em><strong>...</strong></em></u>

    // We can check if the text is inside these tags
    const text = screen.getByText("Inherited Styles");
    const strong = text.closest("strong");
    const em = text.closest("em");
    const u = text.closest("u");

    expect(strong).toBeInTheDocument();
    expect(em).toBeInTheDocument();
    expect(u).toBeInTheDocument();
  });

  it("handles nested list structure", () => {
    const data: ContractNode[] = [
      {
        type: "ul",
        children: [
          {
            type: "li",
            children: [
              {
                type: "lic",
                children: [{ text: "List Item" }],
              },
            ],
          },
        ],
      },
    ];
    render(<ContractRenderer data={data} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent("List Item");
  });

  it("renders nested clauses correctly", () => {
    const data: ContractNode[] = [
      {
        type: "clause",
        children: [
          {
            type: "clause",
            children: [{ text: "Nested Clause" }],
          },
        ],
      },
    ];
    const { container } = render(<ContractRenderer data={data} />);
    const clauses = container.querySelectorAll(".contract-clause");
    expect(clauses.length).toBe(2);
  });
});
