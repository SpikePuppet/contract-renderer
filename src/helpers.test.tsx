import { describe, it, expect } from "vitest";
import { extractMentions, isTextNode, applyMarks } from "./helpers.tsx";
import type { ContractNode } from "./types";
import { render, screen } from "@testing-library/react";

describe("applyMarks", () => {
  it("returns content as is if no marks are present", () => {
    const content = "Hello";
    const result = applyMarks(content, {});
    render(<>{result}</>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByRole("strong")).not.toBeInTheDocument(); // bold -> strong
    expect(screen.queryByRole("emphasis")).not.toBeInTheDocument(); // italic -> em (role might be generic, checking tag is better usually)
  });

  it("wraps content in strong tag if bold is true", () => {
    const content = "Bold Text";
    const result = applyMarks(content, { bold: true });
    render(<>{result}</>);
    const el = screen.getByText("Bold Text");
    expect(el.tagName).toBe("STRONG");
  });

  it("wraps content in em tag if italic is true", () => {
    const content = "Italic Text";
    const result = applyMarks(content, { italic: true });
    render(<>{result}</>);
    const el = screen.getByText("Italic Text");
    expect(el.tagName).toBe("EM");
  });

  it("wraps content in u tag if underline is true", () => {
    const content = "Underline Text";
    const result = applyMarks(content, { underline: true });
    render(<>{result}</>);
    const el = screen.getByText("Underline Text");
    expect(el.tagName).toBe("U");
  });

  it("wraps content nestedly if multiple marks are present", () => {
    const content = "Multi Text";
    const result = applyMarks(content, { bold: true, italic: true });
    render(<>{result}</>);
    const el = screen.getByText("Multi Text");
    // Based on implementation order: bold checks first (wraps), then italic checks (wraps the bold).
    // Code:
    // if (marks.bold) wrapped = <strong>{wrapped}</strong>;
    // if (marks.italic) wrapped = <em>{wrapped}</em>;
    // So structure should be: <em><strong>content</strong></em>

    expect(el.tagName).toBe("STRONG");
    expect(el.parentElement?.tagName).toBe("EM");
  });
});

describe("extractMentions", () => {
  it("returns empty object for empty input", () => {
    expect(extractMentions([])).toEqual({});
  });

  it("extracts a single mention", () => {
    const data: ContractNode[] = [
      {
        type: "mention",
        id: "testId",
        value: "testValue",
        children: [{ text: "testValue" }],
      },
    ];
    expect(extractMentions(data)).toEqual({ testId: "testValue" });
  });

  it("extracts mentions from nested children", () => {
    const data: ContractNode[] = [
      {
        type: "block",
        children: [
          {
            type: "p",
            children: [
              {
                type: "mention",
                id: "nestedId",
                value: "nestedValue",
                children: [{ text: "nestedValue" }],
              },
            ],
          },
        ],
      },
    ];
    expect(extractMentions(data)).toEqual({ nestedId: "nestedValue" });
  });

  it("extracts mentions from TextNode children", () => {
    const data: ContractNode[] = [
      {
        text: "Some text",
        children: [
          {
            type: "mention",
            id: "childId",
            value: "childValue",
            children: [{ text: "childValue" }],
          },
        ],
      },
    ];
    expect(extractMentions(data)).toEqual({ childId: "childValue" });
  });

  it("ignores mentions without id or value", () => {
    const data: ContractNode[] = [
      {
        type: "mention",
        children: [{ text: "No ID" }],
      },
      {
        type: "mention",
        id: "idOnly",
        children: [{ text: "No Value" }],
      },
    ];
    expect(extractMentions(data)).toEqual({});
  });

  it("uses the first value encountered for duplicate ids", () => {
    const data: ContractNode[] = [
      {
        type: "mention",
        id: "dupId",
        value: "firstValue",
        children: [{ text: "firstValue" }],
      },
      {
        type: "mention",
        id: "dupId",
        value: "secondValue",
        children: [{ text: "secondValue" }],
      },
    ];
    expect(extractMentions(data)).toEqual({ dupId: "firstValue" });
  });
});

describe("isTextNode", () => {
  it("returns true for nodes with text and no type", () => {
    expect(isTextNode({ text: "hello" })).toBe(true);
    expect(isTextNode({ text: "hello", bold: true })).toBe(true);
  });

  it("returns false for nodes with type", () => {
    expect(isTextNode({ type: "p", children: [] })).toBe(false);
    expect(isTextNode({ type: "mention", children: [] })).toBe(false);
  });

  it("returns false if text property is missing (though type check usually handles this at compile time, runtime check relies on keys)", () => {
    // @ts-expect-error testing runtime behavior
    expect(isTextNode({ bold: true })).toBe(false);
  });
});
