import './TitleBar.css';
import { BrushCleaning, FileUp, Save } from 'lucide-react';
import { useNotebookStore } from '../store/notebookStore';
import * as db from '../lib/db';

export function TitleBar() {
    const { loadNotebooks, setActiveNotebook } = useNotebookStore();

    const handleExport = async () => {
        try {
            const allNotebooks = await db.getNotebooks();
            const allBlocks = await db.getAllBlocks();
            const data = { notebooks: allNotebooks, blocks: allBlocks };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `notespro_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error al exportar los datos.');
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data = JSON.parse(text);

                if (!data.notebooks || !data.blocks) {
                    throw new Error('Invalid format');
                }

                if (!confirm('¿Deseas importar este respaldo? Se añadirán o actualizarán los cuadernos y bloques.')) {
                    return;
                }

                for (const nb of data.notebooks) {
                    await db.updateNotebook(nb);
                }
                await db.putBlocks(data.blocks);
                
                await loadNotebooks();
                alert('¡Datos importados con éxito!');
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error al importar el archivo. Verifica que sea un JSON válido de NotesPro.');
            }
        };
        input.click();
    };

    const handleClearAll = async () => {
        if (!confirm('⚠️ ESTA ACCIÓN ES IRREVERSIBLE. ¿Estás seguro de que quieres eliminar TODOS los cuadernos y notas permanentemente?')) {
            return;
        }
        try {
            await db.clearAll();
            await loadNotebooks();
            setActiveNotebook(null);
        } catch (error) {
            console.error('Error clearing data:', error);
            alert('Error al tratar de borrar los datos.');
        }
    };
    
    return (
        <div className="title-bar title-bar-drag">
            <div className="title-bar-content">
                {/* 1. Botones (izquierda) */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                    <div className="no-drag" style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn" onClick={handleClearAll} title="Eliminar Todos los Cuadernos">
                            <BrushCleaning size={16} />
                        </button>
                        <button className="action-btn" onClick={handleImport} title="Importar Respaldo">
                            <FileUp size={16} />
                        </button>
                        <button className="action-btn" onClick={handleExport} title="Exportar Respaldo">
                            <Save size={16} />
                        </button>
                    </div>
                </div>
                
                {/* 2. Buscador (centro) */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <input type="text" placeholder="Buscar" className="search-input input-text no-drag"/>
                </div>

                {/* 3. Espacio vacío (derecha) - Hereda el drag de title-bar-drag */}
                <div style={{ width: '100%', height: '100%' }}></div>
            </div>
        </div>
    );
}