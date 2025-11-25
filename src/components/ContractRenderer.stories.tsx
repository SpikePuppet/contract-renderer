import type { Meta, StoryObj } from "@storybook/react";
import { ContractRenderer } from "./ContractRenderer";
import type { ContractNode } from "../types";

const meta = {
  title: "Components/ContractRenderer",
  component: ContractRenderer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContractRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper data
const sampleInputData: ContractNode[] = [
  {
    type: "block",
    title: "Sample Contract",
    children: [
      {
        type: "h1",
        children: [{ text: "Service Agreement" }],
      },
      {
        type: "p",
        children: [
          { text: "This agreement is made on " },
          {
            type: "mention",
            id: "date",
            value: "2023-10-27",
            color: "rgb(20, 170, 245)",
            children: [{ text: "2023-10-27" }],
          },
          { text: "." },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    data: sampleInputData,
  },
};

export const SimpleText: Story = {
  args: {
    data: [
      {
        type: "p",
        children: [{ text: "This is a simple paragraph of text." }],
      },
    ],
  },
};

export const Formatting: Story = {
  args: {
    data: [
      {
        type: "p",
        children: [
          { text: "This text is " },
          { text: "bold", bold: true },
          { text: ", " },
          { text: "italic", italic: true },
          { text: ", and " },
          { text: "underlined", underline: true },
          { text: "." },
        ],
      },
      {
        type: "block",
        bold: true,
        children: [
          {
            type: "p",
            children: [{ text: "This entire block is bold." }],
          },
        ],
      },
    ],
  },
};

export const Mentions: Story = {
  args: {
    data: [
      {
        type: "p",
        children: [
          { text: "Hello, " },
          {
            type: "mention",
            id: "name",
            value: "John Doe",
            color: "#8e44ad",
            children: [{ text: "John Doe" }],
          },
          { text: "! Your ID is " },
          {
            type: "mention",
            id: "userId",
            value: "12345",
            color: "#27ae60",
            children: [{ text: "12345" }],
          },
          { text: "." },
        ],
      },
      {
        type: "p",
        children: [
          { text: "Repeated mention: " },
          {
            type: "mention",
            id: "name",
            value: "John Doe",
            color: "#8e44ad",
            children: [{ text: "John Doe" }],
          },
        ],
      },
    ],
  },
};

export const NestedClauses: Story = {
  args: {
    data: [
      {
        type: "clause",
        children: [
          {
            type: "p",
            children: [{ text: "Clause 1 (Top Level)" }],
          },
          {
            type: "clause",
            children: [
              {
                type: "p",
                children: [{ text: "Clause 1(a) (First Nested)" }],
              },
              {
                type: "clause",
                children: [
                  {
                    type: "p",
                    children: [{ text: "Clause 1(a)(i) (Second Nested)" }],
                  },
                ],
              },
            ],
          },
          {
            type: "clause",
            children: [
              {
                type: "p",
                children: [{ text: "Clause 1(b) (Sibling Nested)" }],
              },
            ],
          },
        ],
      },
      {
        type: "clause",
        children: [
          {
            type: "p",
            children: [{ text: "Clause 2 (Top Level)" }],
          },
        ],
      },
    ],
  },
};

export const Lists: Story = {
    args: {
        data: [
            {
                type: "ul",
                children: [
                    {
                        type: "li",
                        children: [
                            {
                                type: "lic",
                                children: [{ text: "Item 1" }]
                            }
                        ]
                    },
                    {
                        type: "li",
                        children: [
                            {
                                type: "lic",
                                children: [{ text: "Item 2" }]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

export const ContinuousNumbering: Story = {
  args: {
    data: [
      {
        type: "clause",
        children: [
          {
            type: "p",
            children: [{ text: "Clause 1 (Should be '1.')" }]
          }
        ]
      },
      {
        type: "p",
        children: [{ text: "This is a non-clause paragraph breaking the sequence." }]
      },
      {
        type: "clause",
        children: [
          {
            type: "p",
            children: [{ text: "Clause 2 (Should be '2.')" }]
          }
        ]
      },
      {
        type: "clause",
        children: [
          {
            type: "p",
            children: [{ text: "Clause 3 (Should be '3.')" }]
          },
          {
            type: "clause",
            children: [
              {
                type: "p",
                children: [{ text: "Nested 3(a)" }]
              }
            ]
          },
          {
            type: "clause",
            children: [
              {
                type: "p",
                children: [{ text: "Nested 3(b)" }]
              }
            ]
          }
        ]
      },
      {
        type: "p",
        children: [{ text: "Another break." }]
      },
      {
        type: "clause",
        children: [
          {
            type: "p",
            children: [{ text: "Clause 4 (Should be '4.')" }]
          }
        ]
      }
    ]
  }
};
