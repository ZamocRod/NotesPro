import React, { useEffect, useState } from 'react';
import { Plus, Book, Trash2, Edit2, Sun, Moon, Download, Upload } from 'lucide-react';
import { useNotebookStore } from '../store/notebookStore';
import { useThemeStore } from '../store/themeStore';
import * as db from '../lib/db';

export function Sidebar() {
    const { notebooks, activeNotebookId, loadNotebooks, setActiveNotebook, createNotebook, renameNotebook, deleteNotebook } = useNotebookStore();
    const { isDark, toggleTheme } = useThemeStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const [creatingForId, setCreatingForId] = useState<string | null>(null);
    const [newChildTitle, setNewChildTitle] = useState('');

    useEffect(() => {
        loadNotebooks();
    }, [loadNotebooks]);

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

    const handleCreate = async () => {
        if (!newTitle.trim()) {
            setIsCreating(false);
            return;
        }
        await createNotebook(newTitle.trim());
        setNewTitle('');
        setIsCreating(false);
    };

    const handleCreateChild = async (parentId: string) => {
        if (!newChildTitle.trim()) {
            setCreatingForId(null);
            return;
        }
        await createNotebook(newChildTitle.trim(), parentId);
        setNewChildTitle('');
        setCreatingForId(null);
    };

    const handleRename = async (id: string) => {
        if (!editTitle.trim()) {
            setEditingId(null);
            return;
        }
        await renameNotebook(id, editTitle.trim());
        setEditingId(null);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar este cuaderno?')) {
            await deleteNotebook(id);
        }
    };

    const rootNotebooks = notebooks.filter(nb => !nb.parentId);

    return (
        <div className="sidebar">
            <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>NotesPro</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" onClick={handleClearAll} title="Eliminar Todos los Cuadernos" style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <Trash2 size={16} />
                    </button>
                    <button className="action-btn" onClick={handleImport} title="Importar Respaldo" style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <Upload size={16} />
                    </button>
                    <button className="action-btn" onClick={handleExport} title="Exportar Respaldo" style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <Download size={16} />
                    </button>
                </div>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-item" onClick={() => setIsCreating(true)} style={{ color: 'var(--text-muted)' }}>
                    <div className="sidebar-item-left">
                        <span className="sidebar-icon"><Plus size={16} /></span>
                        <span className="sidebar-item-text">Nuevo Cuaderno</span>
                    </div>
                </div>

                {isCreating && (
                    <div style={{ padding: '4px 16px' }}>
                        <input
                            type="text"
                            autoFocus
                            className="sidebar-input"
                            placeholder="Título del cuaderno..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') setIsCreating(false);
                            }}
                            onBlur={handleCreate}
                        />
                    </div>
                )}

                <div className="sidebar-item" onClick={() => toggleTheme()} style={{ color: 'var(--text-muted)' }}>
                    <div className="sidebar-item-left">
                        <span className="sidebar-icon">{isDark ? <Sun size={16} /> : <Moon size={16} />}</span>
                        <span className="sidebar-item-text">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
                    </div>
                </div>

                <div className="sidebar-section-title">
                    Tus Cuadernos
                </div>

                {rootNotebooks.map((nb) => {
                    const children = notebooks.filter(child => child.parentId === nb.id);

                    return (
                        <div key={`group-${nb.id}`}>
                            <div
                                onClick={() => setActiveNotebook(nb.id)}
                                className={`sidebar-item ${activeNotebookId === nb.id ? 'active' : ''}`}
                            >
                                {editingId === nb.id ? (
                                    <div className="sidebar-item-left" onClick={e => e.stopPropagation()}>
                                        <span className="sidebar-icon"><Book size={16} /></span>
                                        <input
                                            type="text"
                                            autoFocus
                                            className="sidebar-rename-input"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRename(nb.id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                            onBlur={() => handleRename(nb.id)}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="sidebar-item-left">
                                            <span className="sidebar-icon">
                                                <Book size={16} color={activeNotebookId === nb.id ? "var(--text-main)" : "var(--text-muted)"} />
                                            </span>
                                            <span className="sidebar-item-text" title={nb.title}>{nb.title}</span>
                                        </div>

                                        <div className="sidebar-actions">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCreatingForId(nb.id);
                                                    setNewChildTitle('');
                                                }}
                                                className="action-btn"
                                                title="Agregar sub-cuaderno"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditTitle(nb.title);
                                                    setEditingId(nb.id);
                                                }}
                                                className="action-btn"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, nb.id)}
                                                className="action-btn delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {creatingForId === nb.id && (
                                <div style={{ padding: '4px 16px 4px 38px' }}>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="sidebar-input"
                                        placeholder="Sub-cuaderno..."
                                        value={newChildTitle}
                                        onChange={(e) => setNewChildTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCreateChild(nb.id);
                                            if (e.key === 'Escape') setCreatingForId(null);
                                        }}
                                        onBlur={() => handleCreateChild(nb.id)}
                                    />
                                </div>
                            )}

                            {children.map(child => (
                                <div
                                    key={child.id}
                                    onClick={() => setActiveNotebook(child.id)}
                                    className={`sidebar-item ${activeNotebookId === child.id ? 'active' : ''}`}
                                    style={{ paddingLeft: '32px' }}
                                >
                                    {editingId === child.id ? (
                                        <div className="sidebar-item-left" onClick={e => e.stopPropagation()}>
                                            <span className="sidebar-icon"><Book size={16} /></span>
                                            <input
                                                type="text"
                                                autoFocus
                                                className="sidebar-rename-input"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRename(child.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                onBlur={() => handleRename(child.id)}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="sidebar-item-left">
                                                <span className="sidebar-icon">
                                                    <Book size={16} color={activeNotebookId === child.id ? "var(--text-main)" : "var(--text-muted)"} />
                                                </span>
                                                <span className="sidebar-item-text" title={child.title}>{child.title}</span>
                                            </div>

                                            <div className="sidebar-actions">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditTitle(child.title);
                                                        setEditingId(child.id);
                                                    }}
                                                    className="action-btn"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, child.id)}
                                                    className="action-btn delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
