import { create } from 'zustand';
import type { Block, BlockType } from '../types';
import * as db from '../lib/db';
import { v4 as uuidv4 } from 'uuid';

let activeLoadId = 0;

interface BlockState {
    blocks: Block[];
    isLoading: boolean;
    focusedBlockId: string | null;

    loadBlocks: (notebookId: string) => Promise<void>;
    updateBlockContent: (blockId: string, content: string) => Promise<void>;
    updateBlockType: (blockId: string, type: BlockType) => Promise<void>;
    createBlockAfter: (currentBlockId: string) => Promise<void>;
    deleteBlock: (blockId: string) => Promise<void>;
    setFocusedBlock: (blockId: string | null) => void;
    focusPrevious: (currentBlockId: string) => void;
    focusNext: (currentBlockId: string) => void;
}

export const useBlockStore = create<BlockState>((set, get) => ({
    blocks: [],
    isLoading: false,
    focusedBlockId: null,

    loadBlocks: async (notebookId) => {
        const loadId = ++activeLoadId;
        set({ isLoading: true });
        try {
            const notebook = await db.getNotebook(notebookId);
            if (!notebook) throw new Error('Notebook not found');

            // Initialize with an empty block if notebook has none
            let notebookBlocks: Block[] = [];
            if (notebook.blocks.length === 0) {
                const initialBlockId = uuidv4();
                const initialBlock: Block = {
                    id: initialBlockId,
                    notebookId,
                    type: 'text',
                    content: '',
                    properties: {}
                };
                await db.putBlock(initialBlock);

                notebook.blocks = [initialBlockId];
                await db.updateNotebook(notebook);
                notebookBlocks = [initialBlock];
            } else {
                const blocksProms = notebook.blocks.map(id => db.getBlocksByNotebook(notebookId).then(all => all.find(b => b.id === id)));
                const resolvedBlocks = await Promise.all(blocksProms);
                notebookBlocks = resolvedBlocks.filter((b): b is Block => b !== undefined);
            }

            if (loadId === activeLoadId) {
                set({ blocks: notebookBlocks, isLoading: false, focusedBlockId: null });
            }
        } catch (e) {
            if (loadId === activeLoadId) {
                set({ isLoading: false });
            }
            console.error(e);
        }
    },

    updateBlockContent: async (blockId, content) => {
        const { blocks } = get();
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return;

        const newBlocks = [...blocks];
        newBlocks[blockIndex] = { ...newBlocks[blockIndex], content };
        set({ blocks: newBlocks });

        await db.putBlock(newBlocks[blockIndex]);
    },

    updateBlockType: async (blockId, type) => {
        const { blocks } = get();
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return;

        const newBlocks = [...blocks];
        newBlocks[blockIndex] = { ...newBlocks[blockIndex], type };
        set({ blocks: newBlocks });

        await db.putBlock(newBlocks[blockIndex]);
    },

    createBlockAfter: async (currentBlockId) => {
        const { blocks } = get();
        const currentIndex = blocks.findIndex(b => b.id === currentBlockId);
        if (currentIndex === -1) return;

        const notebookId = blocks[currentIndex].notebookId;
        const newBlockId = uuidv4();
        const newBlock: Block = {
            id: newBlockId,
            notebookId,
            type: 'text',
            content: '',
            properties: {}
        };

        const newBlocks = [...blocks];
        newBlocks.splice(currentIndex + 1, 0, newBlock);

        set({ blocks: newBlocks, focusedBlockId: newBlockId });

        // Update DB
        await db.putBlock(newBlock);
        const notebook = await db.getNotebook(notebookId);
        if (notebook) {
            notebook.blocks.splice(currentIndex + 1, 0, newBlockId);
            await db.updateNotebook(notebook);
        }
    },

    deleteBlock: async (blockId) => {
        const { blocks } = get();
        if (blocks.length <= 1) return; // Can't delete the last block

        const currentIndex = blocks.findIndex(b => b.id === blockId);
        if (currentIndex === -1) return;

        const prevIndex = currentIndex - 1;
        const blockToFocus = prevIndex >= 0 ? blocks[prevIndex].id : blocks[currentIndex + 1].id;

        const newBlocks = blocks.filter(b => b.id !== blockId);
        set({ blocks: newBlocks, focusedBlockId: blockToFocus });

        const notebookId = blocks[currentIndex].notebookId;
        await db.deleteBlock(blockId);

        // Update the notebook's block list
        const notebook = await db.getNotebook(notebookId);
        if (notebook) {
            notebook.blocks = notebook.blocks.filter(id => id !== blockId);
            await db.updateNotebook(notebook);
        }
    },

    setFocusedBlock: (blockId) => {
        set({ focusedBlockId: blockId });
    },

    focusPrevious: (currentBlockId) => {
        const { blocks } = get();
        const currentIndex = blocks.findIndex(b => b.id === currentBlockId);
        if (currentIndex > 0) {
            set({ focusedBlockId: blocks[currentIndex - 1].id });
        }
    },

    focusNext: (currentBlockId) => {
        const { blocks } = get();
        const currentIndex = blocks.findIndex(b => b.id === currentBlockId);
        if (currentIndex !== -1 && currentIndex < blocks.length - 1) {
            set({ focusedBlockId: blocks[currentIndex + 1].id });
        }
    }
}));
