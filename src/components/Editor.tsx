import React, { useEffect } from 'react';
import { useBlockStore } from '../store/blockStore';
import { BlockNode } from './BlockNode';

interface EditorProps {
    notebookId: string;
}

export function Editor({ notebookId }: EditorProps) {
    const { blocks, loadBlocks, isLoading } = useBlockStore();

    useEffect(() => {
        loadBlocks(notebookId);
    }, [notebookId, loadBlocks]);

    if (isLoading) {
        return <div className="editor-loading">Cargando bloques...</div>;
    }

    return (
        <div className="blocks-container">
            {blocks.map((block, index) => (
                <BlockNode
                    key={block.id}
                    id={block.id}
                    notebookId={block.notebookId}
                    type={block.type}
                    content={block.content}
                    index={index}
                />
            ))}
        </div>
    );
}
