import "./TitleBar.css";
import { BrushCleaning, FileUp, Save, Minus, Square, X } from "lucide-react";
import { useNotebookStore } from "../store/notebookStore";
import { useModalStore } from "../store/modalStore";
import * as db from "../lib/db";
import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import type { MouseEvent } from 'react';
import { readBackup, saveBackup } from '../lib/backupFiles';

export function TitleBar() {
  const { loadNotebooks, setActiveNotebook } = useNotebookStore();

  const handleExport = async () => {
    try {
      const allNotebooks = await db.getNotebooks();
      const allBlocks = await db.getAllBlocks();
      const data = { notebooks: allNotebooks, blocks: allBlocks };
      await saveBackup(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error exporting data:", error);
      await useModalStore.getState().showConfirm({
        title: 'Error de Exportación',
        message: 'No se pudieron exportar los datos correctamente.',
        cancelText: null, // Modo alerta
        type: 'danger'
      });
    }

  };

  const handleImport = async () => {
      try {
        const text = await readBackup();
        if (text === null) return;
        const data = JSON.parse(text);

        if (!Array.isArray(data.notebooks) || !Array.isArray(data.blocks)) {
          throw new Error("Invalid format");
        }

        const confirmed = await useModalStore.getState().showConfirm({
          title: "Importar Respaldo",
          message:
            "¿Deseas importar este respaldo? Se añadirán o actualizarán los cuadernos y bloques existentes.",
          confirmText: "Importar",
        });

        if (!confirmed) {
          return;
        }

        for (const nb of data.notebooks) {
          await db.updateNotebook(nb);
        }
        await db.putBlocks(data.blocks);

        await loadNotebooks();
        await useModalStore.getState().showConfirm({
          title: 'Importación Exitosa',
          message: '¡Tus datos han sido importados con éxito!',
          confirmText: 'Genial',
          cancelText: null, // Modo alerta
          type: 'success'
        });
      } catch (error) {
        console.error("Error importing data:", error);
        await useModalStore.getState().showConfirm({
          title: 'Error de Importación',
          message: 'Verifica que el archivo sea un JSON válido de NotesPro.',
          cancelText: null,
          type: 'danger'
        });
      }

  };

  const handleClearAll = async () => {
    const confirmed = await useModalStore.getState().showConfirm({
      title: "ACCIÓN IRREVERSIBLE",
      message:
        "¿Estás seguro de que quieres eliminar TODOS los cuadernos y notas permanentemente? Esta acción NO se puede deshacer.",
      confirmText: "Eliminar Todo",
      type: "danger",
    });

    if (!confirmed) {
      return;
    }

    try {
      await db.clearAll();
      await loadNotebooks();
      setActiveNotebook(null);
    } catch (error) {
      console.error("Error clearing data:", error);
      await useModalStore.getState().showConfirm({
        title: 'Error',
        message: 'Hubo un problema al intentar borrar los datos.',
        cancelText: null,
        type: 'danger'
      });
    }

  };

  const desktop = isTauri();
  const windowAction = (action: 'minimize' | 'toggleMaximize' | 'close' | 'startDragging') => {
    if (desktop) {
      void getCurrentWindow()[action]().catch(error => console.error('Window action failed:', error));
    }
  };
  const handleDrag = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.detail > 1) return;
    if ((event.target as HTMLElement).closest('button, input, .no-drag')) return;
    windowAction('startDragging');
  };

  return (
    <div className="title-bar title-bar-drag" onMouseDown={handleDrag}
      onDoubleClick={event => {
        if (!(event.target as HTMLElement).closest('button, input, .no-drag')) windowAction('toggleMaximize');
      }}>
      <div className="title-bar-content">
        {/* 1. Botones (izquierda) */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: "8px",
          }}
        >
          <div className="no-drag" style={{ display: "flex", gap: "8px" }}>
            <button
              className="action-btn"
              onClick={handleClearAll}
              title="Eliminar Todos los Cuadernos"
            >
              <BrushCleaning size={16} />
            </button>
            <button
              className="action-btn"
              onClick={handleImport}
              title="Importar Respaldo"
            >
              <FileUp size={16} />
            </button>
            <button
              className="action-btn"
              onClick={handleExport}
              title="Exportar Respaldo"
            >
              <Save size={16} />
            </button>
          </div>
        </div>

        {/* 2. Buscador (centro) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Buscar"
            className="search-input input-text no-drag"
          />
        </div>

        {/* Window controls */}
        <div className="window-controls no-drag">
          {desktop && <>
            <button className="window-control" aria-label="Minimizar" onClick={() => windowAction('minimize')}><Minus size={16} /></button>
            <button className="window-control" aria-label="Maximizar o restaurar" onClick={() => windowAction('toggleMaximize')}><Square size={14} /></button>
            <button className="window-control window-close" aria-label="Cerrar" onClick={() => windowAction('close')}><X size={18} /></button>
          </>}
        </div>
      </div>
    </div>
  );
}
