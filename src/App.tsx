import React from 'react';
import { Sidebar } from './components/Sidebar';
import { useNotebookStore } from './store/notebookStore';

import { Editor } from './components/Editor';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';

function App() {
  const { activeNotebookId, notebooks } = useNotebookStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const activeNotebook = notebooks.find(nb => nb.id === activeNotebookId);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {activeNotebook ? (
          <div className="editor-container">
            <h1 className="editor-title">
              {activeNotebook.title}
            </h1>
            <Editor notebookId={activeNotebook.id} />
          </div>
        ) : (
          <div className="empty-view">
            <BookOpen className="empty-view-icon" />
            <p className="empty-view-text">Selecciona o crea un cuaderno para empezar</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Temporary icon
function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export default App;
