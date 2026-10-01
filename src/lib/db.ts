import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Notebook, Block } from '../types';
import { DATABASE_NAME } from './environment';

interface NotesProDB extends DBSchema {
    notebooks: {
        key: string;
        value: Notebook;
        indexes: { 'by-updated': number };
    };
    blocks: {
        key: string;
        value: Block;
        indexes: { 'by-notebook': string };
    };
}

const DB_NAME = DATABASE_NAME;
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NotesProDB>> | null = null;

export const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<NotesProDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('notebooks')) {
                    const notebookStore = db.createObjectStore('notebooks', { keyPath: 'id' });
                    notebookStore.createIndex('by-updated', 'updatedAt');
                }
                if (!db.objectStoreNames.contains('blocks')) {
                    const blockStore = db.createObjectStore('blocks', { keyPath: 'id' });
                    blockStore.createIndex('by-notebook', 'notebookId');
                }
            },
        });
    }
    return dbPromise;
};

// --- Notebook Operations ---

export async function createNotebook(notebook: Notebook): Promise<void> {
    const db = await getDB();
    await db.put('notebooks', notebook);
}

export async function getNotebooks(): Promise<Notebook[]> {
    const db = await getDB();
    return db.getAllFromIndex('notebooks', 'by-updated');
}

export async function getNotebook(id: string): Promise<Notebook | undefined> {
    const db = await getDB();
    return db.get('notebooks', id);
}

export async function updateNotebook(notebook: Notebook): Promise<void> {
    const db = await getDB();
    await db.put('notebooks', notebook);
}

export async function deleteNotebook(id: string): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(['notebooks', 'blocks'], 'readwrite');

    await tx.objectStore('notebooks').delete(id);

    // Cascade delete blocks
    const blocksStore = tx.objectStore('blocks');
    const index = blocksStore.index('by-notebook');
    const blockKeys = await index.getAllKeys(id);
    for (const blockId of blockKeys) {
        await blocksStore.delete(blockId);
    }

    await tx.done;
}

// --- Block Operations ---

export async function getBlocksByNotebook(notebookId: string): Promise<Block[]> {
    const db = await getDB();
    return db.getAllFromIndex('blocks', 'by-notebook', notebookId);
}

export async function getAllBlocks(): Promise<Block[]> {
    const db = await getDB();
    return db.getAll('blocks');
}

export async function putBlock(block: Block): Promise<void> {
    const db = await getDB();
    await db.put('blocks', block);
}

export async function putBlocks(blocks: Block[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('blocks', 'readwrite');
    for (const block of blocks) {
        await tx.store.put(block);
    }
    await tx.done;
}

export async function deleteBlock(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('blocks', id);
}

export async function clearAll(): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(['notebooks', 'blocks'], 'readwrite');
    await tx.objectStore('notebooks').clear();
    await tx.objectStore('blocks').clear();
    await tx.done;
}
