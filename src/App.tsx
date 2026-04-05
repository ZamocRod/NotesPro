import { Sidebar } from "./components/Sidebar";
import { useNotebookStore } from "./store/notebookStore";
import { BookOpen } from "lucide-react";
import { Editor } from "./components/Editor";
import { TitleBar } from "./components/TitleBar";
import { useThemeStore } from "./store/themeStore";
import { useEffect } from "react";

function App() {
  const { activeNotebookId, notebooks } = useNotebookStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const activeNotebook = notebooks.find((nb) => nb.id === activeNotebookId);
  // Agregas esto en tu App.tsx o algún Effect global
  useEffect(() => {
    const isElectron = navigator.userAgent.toLowerCase().includes("electron");

    if (!isElectron) {
      // Si NO es Electron (es decir, estamos en la Web), añadimos una clase al body
      document.body.classList.add("is-web");
    } else {
      document.body.classList.add("is-electron");
    }
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

        <div className="app-version">v1.0.0</div>
      </div>
    </div>
  );
}

export default App;
