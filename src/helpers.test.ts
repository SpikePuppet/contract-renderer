import { describe, it, expect } from "vitest";
import { extractMentions, isTextNode } from "./helpers";
import type { ContractNode } from "./types";

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
