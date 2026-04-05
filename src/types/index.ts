export type BlockType = 'text' | 'h1' | 'h2' | 'h3' | 'list_item' | 'reference' | 'code';

export interface BlockProperties {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  [key: string]: any;
}

export interface Block {
  id: string;
  notebookId: string;
  type: BlockType;
  content: string; // The text content or notebook reference ID
  properties: BlockProperties;
}

export interface Notebook {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  blocks: string[]; // Order of blocks via UUIDs
  parentId?: string;
}
