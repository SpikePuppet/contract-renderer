export type NodeType = 'block' | 'h1' | 'h4' | 'p' | 'mention' | 'clause' | 'ul' | 'li' | 'lic';

export interface TextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  children?: ContractNode[];
}

export interface ElementNode {
  type: NodeType;
  children: ContractNode[];
  title?: string;
  color?: string;
  variableType?: string;
  id?: string;
  value?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export type ContractNode = TextNode | ElementNode;
