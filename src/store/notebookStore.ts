import { create } from 'zustand';
import type { Notebook } from '../types';
import * as db from '../lib/db';
import { v4 as uuidv4 } from 'uuid';

interface NotebookState {
    notebooks: Notebook[];
    activeNotebookId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadNotebooks: () => Promise<void>;
    setActiveNotebook: (id: string | null) => void;
    createNotebook: (title: string, parentId?: string) => Promise<string>;
    renameNotebook: (id: string, newTitle: string) => Promise<void>;
    deleteNotebook: (id: string) => Promise<void>;
}

export const useNotebookStore = create<NotebookState>((set, get) => ({
    notebooks: [],
    activeNotebookId: null,
    isLoading: false,
    error: null,

    loadNotebooks: async () => {
        set({ isLoading: true, error: null });
        try {
            const notebooks = await db.getNotebooks();
            // Sort by updatedAt descending
            notebooks.sort((a, b) => b.updatedAt - a.updatedAt);
            set({ notebooks, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to load notebooks', isLoading: false });
        }
    },

    setActiveNotebook: (id) => {
        set({ activeNotebookId: id });
    },

    createNotebook: async (title, parentId) => {
        const id = uuidv4();
        const now = Date.now();
        const newNotebook: Notebook = {
            id,
            title,
            createdAt: now,
            updatedAt: now,
            blocks: [],
            parentId,
        };

        try {
            await db.createNotebook(newNotebook);
            set((state) => ({
                notebooks: [newNotebook, ...state.notebooks],
                activeNotebookId: id,
            }));
            return id;
        } catch (error) {
            set({ error: 'Failed to create notebook' });
            throw error;
        }
    },

    renameNotebook: async (id, newTitle) => {
        try {
            const notebook = await db.getNotebook(id);
            if (!notebook) throw new Error('Notebook not found');

            const updatedNotebook = { ...notebook, title: newTitle, updatedAt: Date.now() };
            await db.updateNotebook(updatedNotebook);

            set((state) => ({
                notebooks: state.notebooks.map((nb) =>
                    nb.id === id ? updatedNotebook : nb
                ),
            }));
        } catch (error) {
            set({ error: 'Failed to rename notebook' });
            throw error;
        }
    },

    deleteNotebook: async (id) => {
        try {
            await db.deleteNotebook(id);
            set((state) => ({
                notebooks: state.notebooks.filter((nb) => nb.id !== id),
                activeNotebookId: state.activeNotebookId === id ? null : state.activeNotebookId,
            }));
        } catch (error) {
            set({ error: 'Failed to delete notebook' });
            throw error;
        }
    },
}));
