import { Sidebar } from "./components/Sidebar";
import { useNotebookStore } from "./store/notebookStore";
import { BookOpen } from "lucide-react";
import { Editor } from "./components/Editor";
import { TitleBar } from "./components/TitleBar";
import { ConfirmModal } from "./components/ConfirmModal";
import { useThemeStore } from "./store/themeStore";

import { isTauri } from "@tauri-apps/api/core";

import { useEffect } from "react";


function App() {
  const { activeNotebookId, notebooks } = useNotebookStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);


  const activeNotebook = notebooks.find((nb) => nb.id === activeNotebookId);
  useEffect(() => {
    const className = isTauri() ? 'is-tauri' : 'is-web';
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, []);

  return (
    <div className="app-container main-layout">
      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <TitleBar />
          <div className="main-content-bg">
            {" "}
            {activeNotebook ? (
              <div className="editor-container">
                <h1 className="editor-title">{activeNotebook.title}</h1>
                <Editor notebookId={activeNotebook.id} />
              </div>
            ) : (
              <div className="empty-view">
                <BookOpen size={80} className="empty-view-icon" />
                <p className="empty-view-text">
                  Selecciona o crea un cuaderno para empezar
                </p>
              </div>
            )}
          </div>
        </main>

        <div className="app-version">v{__APP_VERSION__}</div>
      </div>
      <ConfirmModal />
    </div>
  );
}

export default App;
