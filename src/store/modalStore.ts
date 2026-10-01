import { create } from 'zustand';

interface ModalOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string | null; // null si no queremos botón de cancelar
    type?: 'danger' | 'info' | 'success';
}

interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string | null;
    type: 'danger' | 'info' | 'success';
    resolve: ((result: boolean) => void) | null;

    // Actions
    showConfirm: (options: ModalOptions) => Promise<boolean>;
    close: (result: boolean) => void;
}


export const useModalStore = create<ModalState>((set, get) => ({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'info',
    resolve: null,

    showConfirm: (options) => {
        return new Promise((resolve) => {
            set({
                isOpen: true,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || 'Aceptar',
                cancelText: options.cancelText === null ? null : (options.cancelText || 'Cancelar'),
                type: options.type || 'info',
                resolve,
            });

        });
    },

    close: (result) => {
        const { resolve } = get();
        if (resolve) {
            resolve(result);
        }
        set({ isOpen: false, resolve: null });
    },
}));
