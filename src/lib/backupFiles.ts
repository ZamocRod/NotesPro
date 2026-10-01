import { isTauri } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

const filters = [{ name: 'NotesPro JSON', extensions: ['json'] }];

export async function saveBackup(text: string): Promise<void> {
    const filename = `notespro_backup_${new Date().toISOString().split('T')[0]}.json`;
    if (isTauri()) {
        const path = await save({ defaultPath: filename, filters });
        if (path) await writeTextFile(path, text);
        return;
    }
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readBackup(): Promise<string | null> {
    if (isTauri()) {
        const path = await open({ multiple: false, directory: false, filters });
        return path ? readTextFile(path) : null;
    }
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.oncancel = () => resolve(null);
        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) resolve(null);
            else void file.text().then(resolve, reject);
        };
        input.click();
    });
}
