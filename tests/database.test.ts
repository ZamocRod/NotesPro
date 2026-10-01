import 'fake-indexeddb/auto';
import { describe, it, expect, vi } from 'vitest';

async function loadDatabase(dev: boolean) {
    vi.resetModules();
    vi.stubEnv('DEV', dev);
    const environment = await import('../src/lib/environment');
    const database = await import('../src/lib/db');
    return { ...database, name: environment.DATABASE_NAME };
}

const notebook = { id: 'notebook-1', title: 'Production note', createdAt: 1, updatedAt: 1, blocks: ['block-1'] };
const block = { id: 'block-1', notebookId: notebook.id, type: 'text' as const, content: 'Keep production data', properties: {} };

describe('development and production persistence', () => {
    it('isolates writes, imports and clearAll while retaining data after reopening', async () => {
        const prod = await loadDatabase(false);
        expect(prod.name).toBe('NotesProDB');
        await prod.clearAll();
        await prod.createNotebook(notebook);
        await prod.putBlock(block);

        const dev = await loadDatabase(true);
        expect(dev.name).toBe('NotesProDB-dev');
        await dev.clearAll();
        expect(await dev.getNotebooks()).toEqual([]);
        await dev.updateNotebook({ ...notebook, title: 'Development note' });
        await dev.putBlocks([{ ...block, content: 'Development content' }]);
        expect((await prod.getNotebook(notebook.id))?.title).toBe('Production note');
        expect((await prod.getAllBlocks())[0].content).toBe(block.content);
        await dev.clearAll();
        expect(await prod.getAllBlocks()).toEqual([block]);

        (await prod.getDB()).close();
        const reopened = await loadDatabase(false);
        expect(await reopened.getNotebook(notebook.id)).toEqual(notebook);
        expect(await reopened.getBlocksByNotebook(notebook.id)).toEqual([block]);
        await reopened.deleteNotebook(notebook.id);
        expect(await reopened.getAllBlocks()).toEqual([]);
        (await reopened.getDB()).close();
        (await dev.getDB()).close();
        vi.unstubAllEnvs();
    });
});
