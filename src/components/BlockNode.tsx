import React, { useEffect, useRef, useState } from 'react';
import { useBlockStore } from '../store/blockStore';
import { useNotebookStore } from '../store/notebookStore';
import type { BlockType } from '../types';
import { Link, Type, Heading1, Heading2, Heading3, List as ListIcon, Plus, X } from 'lucide-react';

interface BlockProps {
    id: string;
    notebookId: string;
    type: BlockType;
    content: string;
    index: number;
}

export function BlockNode({ id, type, content, index, notebookId }: BlockProps) {
    const { updateBlockContent, updateBlockType, createBlockAfter, deleteBlock, focusedBlockId, setFocusedBlock, focusPrevious, focusNext, blocks } = useBlockStore();
    const { notebooks, setActiveNotebook, createNotebook } = useNotebookStore();

    const editableRef = useRef<HTMLDivElement>(null);
    const [localContent, setLocalContent] = useState(content);

    const [showRefMenu, setShowRefMenu] = useState(false);
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

    useEffect(() => {
        if (focusedBlockId === id && editableRef.current && type !== 'reference') {
            editableRef.current.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(editableRef.current);
            if (editableRef.current.childNodes.length > 0) {
                range.collapse(false);
            }
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [focusedBlockId, id, type]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.textContent || '';
        setLocalContent(text);

        if (text === '# ') {
            changeType('h1');
        } else if (text === '## ') {
            changeType('h2');
        } else if (text === '### ') {
            changeType('h3');
        } else if (text === '- ') {
            changeType('list_item');
        } else if (text === '/') {
            setShowSlashMenu(true);
            setShowRefMenu(false);
            setSelectedMenuIndex(0);
        } else if (text === '/ref') {
            setShowSlashMenu(false);
            setShowRefMenu(true);
            setSelectedMenuIndex(0);
        } else {
            setShowSlashMenu(false);
            setShowRefMenu(false);
        }
    };

    const changeType = (newType: BlockType) => {
        updateBlockType(id, newType);
        setLocalContent('');
        if (editableRef.current) editableRef.current.textContent = '';
        setShowSlashMenu(false);
        setShowRefMenu(false);
    };

    const createSubNotebook = async () => {
        const currentNotebook = notebooks.find(nb => nb.id === notebookId);
        const parentId = currentNotebook?.parentId || currentNotebook?.id;

        const newId = await createNotebook('Nuevo Sub-cuaderno', parentId);

        updateBlockType(id, 'reference');
        updateBlockContent(id, newId);
        setShowSlashMenu(false);
        createBlockAfter(id);
        setActiveNotebook(newId);
    };

    const handleBlur = () => {
        if (!showRefMenu && !showSlashMenu) {
            updateBlockContent(id, localContent);
        }
    };

    const referenceOptions = notebooks.filter(nb => nb.id !== notebookId);
    const slashOptions = [
        { label: 'Texto', type: 'text' as BlockType, icon: Type },
        { label: 'Título 1', type: 'h1' as BlockType, icon: Heading1 },
        { label: 'Título 2', type: 'h2' as BlockType, icon: Heading2 },
        { label: 'Título 3', type: 'h3' as BlockType, icon: Heading3 },
        { label: 'Lista', type: 'list_item' as BlockType, icon: ListIcon },
        { label: 'Enlace a cuaderno', action: 'ref', icon: Link },
        { label: 'Sub-cuaderno', action: 'sub', icon: Plus },
    ];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (showSlashMenu) {
            if (e.key === 'Escape') {
                setShowSlashMenu(false);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedMenuIndex(prev => (prev + 1) % slashOptions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedMenuIndex(prev => (prev - 1 + slashOptions.length) % slashOptions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const opt = slashOptions[selectedMenuIndex];
                if (opt.action === 'ref') {
                    setShowSlashMenu(false);
                    setShowRefMenu(true);
                    setSelectedMenuIndex(0);
                    setLocalContent('/ref');
                    if (editableRef.current) editableRef.current.textContent = '/ref';
                } else if (opt.action === 'sub') {
                    createSubNotebook();
                } else {
                    changeType(opt.type!);
                }
            }
            return;
        }

        if (showRefMenu) {
            if (e.key === 'Escape') {
                setShowRefMenu(false);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (referenceOptions.length > 0) {
                    setSelectedMenuIndex(prev => (prev + 1) % referenceOptions.length);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (referenceOptions.length > 0) {
                    setSelectedMenuIndex(prev => (prev - 1 + referenceOptions.length) % referenceOptions.length);
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (referenceOptions.length > 0) {
                    selectReference(referenceOptions[selectedMenuIndex].id);
                }
            }
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            updateBlockContent(id, localContent);
            createBlockAfter(id);
        } else if (e.key === 'Backspace' && localContent === '') {
            e.preventDefault();
            if (type !== 'text') {
                updateBlockType(id, 'text');
            } else {
                deleteBlock(id);
            }
        } else if (e.key === 'ArrowUp') {
            focusPrevious(id);
        } else if (e.key === 'ArrowDown') {
            focusNext(id);
        }
    };

    const selectReference = (targetNotebookId: string) => {
        updateBlockType(id, 'reference');
        updateBlockContent(id, targetNotebookId);
        setShowRefMenu(false);
        createBlockAfter(id);
    };

    if (type === 'reference') {
        const referencedNotebook = notebooks.find(nb => nb.id === content);
        return (
            <div className="block-row">
                <div
                    className="block-reference"
                    onClick={() => {
                        if (referencedNotebook) setActiveNotebook(referencedNotebook.id);
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace') deleteBlock(id);
                        if (e.key === 'ArrowUp') focusPrevious(id);
                        if (e.key === 'ArrowDown') focusNext(id);
                    }}
                    onFocus={() => setFocusedBlock(id)}
                >
                    <Link size={16} className="reference-icon" />
                    <span style={{ flex: 1 }}>{referencedNotebook ? referencedNotebook.title : 'Enlace Roto o Eliminado'}</span>
                    <div
                        onClick={(e) => { e.stopPropagation(); deleteBlock(id); }}
                        style={{ display: 'flex', alignItems: 'center', padding: '2px', marginLeft: '4px', borderRadius: '4px', cursor: 'pointer' }}
                        className="reference-delete-btn"
                    >
                        <X size={14} />
                    </div>
                </div>
            </div>
        );
    }

    let elementClass = 'block-editable';
    switch (type) {
        case 'h1': elementClass += ' block-h1'; break;
        case 'h2': elementClass += ' block-h2'; break;
        case 'h3': elementClass += ' block-h3'; break;
        case 'list_item': elementClass += ' block-list-item'; break;
        default: elementClass += ' block-text'; break;
    }

    return (
        <div className="block-row">
            {type === 'list_item' && <span className="block-bullet">•</span>}

            <div className="block-input-wrapper" style={{ width: '100%', position: 'relative' }}>
                <div
                    ref={editableRef}
                    className={elementClass}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocusedBlock(id)}
                    data-placeholder={type === 'text' && blocks.length === 1 && index === 0 ? "Escribe algo, o presiona '/' para comandos..." : ""}
                >
                    {content}
                </div>

                {showSlashMenu && (
                    <div className="reference-menu">
                        <div className="reference-menu-title">Bloques Básicos</div>
                        {slashOptions.map((opt, i) => {
                            const Icon = opt.icon;
                            return (
                                <div
                                    key={i}
                                    className={`reference-menu-item ${i === selectedMenuIndex ? 'selected' : ''}`}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        if (opt.action === 'ref') {
                                            setShowSlashMenu(false);
                                            setShowRefMenu(true);
                                            setSelectedMenuIndex(0);
                                            setLocalContent('/ref');
                                            if (editableRef.current) editableRef.current.textContent = '/ref';
                                        } else if (opt.action === 'sub') {
                                            createSubNotebook();
                                        } else {
                                            changeType(opt.type!);
                                        }
                                    }}
                                    onMouseEnter={() => setSelectedMenuIndex(i)}
                                >
                                    <Icon size={16} className="reference-icon" />
                                    <span>{opt.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {showRefMenu && (
                    <div className="reference-menu">
                        <div className="reference-menu-title">Enlazar a cuaderno</div>
                        {referenceOptions.length === 0 ? (
                            <div className="reference-menu-empty">No hay otros cuadernos</div>
                        ) : (
                            referenceOptions.map((nb, i) => (
                                <div
                                    key={nb.id}
                                    className={`reference-menu-item ${i === selectedMenuIndex ? 'selected' : ''}`}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        selectReference(nb.id);
                                    }}
                                    onMouseEnter={() => setSelectedMenuIndex(i)}
                                >
                                    <Link size={14} className="reference-icon" />
                                    <span>{nb.title}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
