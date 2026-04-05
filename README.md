# NotesPro 📔

*[Read in English below](#-english-version)*

Una aplicación de cuaderno moderna, de alto rendimiento y basada en bloques. Construida como una **aplicación multiplataforma** utilizando **Electron**, **React** y **TypeScript**, aprovecha las tecnologías web para garantizar accesibilidad en diferentes ecosistemas, presentando una interfaz de usuario **optimizada para la estética de Windows 11**.

NotesPro proporciona una experiencia de edición fluida, combinando la flexibilidad de los entornos web con soporte especializado para los materiales nativos premium de Windows como las superficies **Mica**, **Acrylic** y **Tabbed**, cuando se ejecuta en versiones compatibles de Windows 11.

---

## ✨ Características

- **🚀 Altísimo Rendimiento**: Potenciado por Vite y React para interacciones casi instantáneas.
- **🎨 Experiencia Nativa en Windows 11**: 
  - Soporte para fondos traslúcidos **Mica**, **Acrylic** y **Tabbed**.
  - Barra de título personalizada e integrada que sincroniza los controles nativos de la ventana.
  - Sincronización automática del Modo Claro/Oscuro con el `nativeTheme` de Electron.
- **📝 Editor de Bloques**: Crea contenido utilizando un innovador y flexible sistema de bloques.
  - Edición de código multilínea con resaltado de sintaxis dinámico vía **PrismJS**.
  - Comandos rápidos de teclado usando "slash" (`/`) para crear contenido en un instante.
- **📂 Organización Jerárquica**: Administra tus notas a través de una estructura de cuadernos anidados y referencias.
- **💾 Privacidad Local**: Todos los datos se almacenan localmente en tu sistema utilizando **IndexedDB**, garantizando total privacidad y velocidad. Sin nubes forzadas.
- **🔄 Herramientas Integradas**: Funcionalidad nativa de Importación/Exportación para respaldos fáciles.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, Zustand (Manejo de Estados de la interfaz).
- **Backend / Entorno**: Electron (Integración profunda con Windows).
- **Estilos Visuales**: CSS puro (Vanilla) con arquitectura modular basada en componentes.
- **Íconos**: Lucide React.
- **Base de Datos Local**: IDB (Capa ligera sobre IndexedDB).
- **Herramienta de Compilación**: Vite.

---

## 🚀 Empezando

### Requisitos previos

- [Node.js](https://nodejs.org/) (Última versión LTS recomendada).
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/).

### Instalación

1. Clona este repositorio o descarga el código fuente.
2. Abre la carpeta y ejecuta la instalación de las dependencias:
   ```bash
   npm install
   ```

### Desarrollo

Para ejecutar la aplicación en modo desarrollo con carga rápida (HMR):

```bash
# Terminal 1: Inicia el servidor de desarrollo en la web
npm run dev

# Terminal 2: Inicia la ventana de Electron (Una vez que el Terminal 1 haya iniciado el servidor vite)
npm run electron:dev
```

### Compilar para Producción

Para compilar un instalador nativo `.exe` de Windows listo para enviar y distribuir, basta con:

```bash
npm run electron:build
```

---

## 🎨 Personalización y Colores

Toda la gama de colores y variables internas del tema logran su magia mediante el archivo `src/styles/variables.css`. Puedes ajustar cualquier opacidad o color para personalizar cómo se verán los distintos grados de transparencia de un material de Windows como Mica.

---

## 🤖 Créditos de Desarrollo

Este proyecto fue construido utilizando **Antigravity**, impulsado principalmente mediante flujos de programación generativa por IA (*AI-assisted coding*), operando con estrechos ajustes manuales estructurales, diseños arquitectónicos y la revisión y la supervisión directa por un Desarrollador React.

---

## 📄 Licencia

Este proyecto se distribuye bajo la **GNU General Public License v3 (GPLv3)**. 

NotesPro es completamente software libre: puedes redistribuirlo, clonarlo y/o modificarlo según los estándares y términos listados en la licencia de uso GPLv3, lo cual garantiza que tanto la app como todas las posibles mejoras derivadas a futuro van a seguir siendo gratuitas, libres y abiertas de cara a la comunidad. Para mayor información, lee el archivo [LICENSE](./LICENSE).

<br>
<br>
<br>

---

# 🇺🇸 English Version

A modern, high-performance, block-based notebook application. Built as a **cross-platform application** using **Electron**, **React**, and **TypeScript**, it leverages web technologies to ensure accessibility across different systems, featuring a user interface **systematically optimized for Windows 11 aesthetics**.

NotesPro provides a seamless editing experience, blending the flexibility of web-based environments with specialized support for premium Windows materials like **Mica**, **Acrylic**, and **Tabbed** surfaces when running on supported versions of Windows 11.

---

## ✨ Features

- **🚀 Performance-Driven**: Powered by Vite and React for near-instant interaction.
- **🎨 Windows 11 Native Experience**: 
  - Supports **Mica**, **Acrylic**, and **Tabbed** background materials.
  - Custom, integrated title bar with native window control synchronization.
  - Automatic Dark/Light mode synchronization with Electron's `nativeTheme`.
- **📝 Block-Based Editor**: Create content using a flexible system of blocks.
  - Multi-line code editing with **PrismJS** syntax highlighting.
  - Slash commands for quick content creation.
- **📂 Hierarchical Organization**: Manage your notes through a nested notebook structure.
- **💾 Local First**: All data is stored locally in your browser/app using **IndexedDB**, ensuring privacy and speed.
- **🔄 Tools**: Built-in Import/Export functionality for backups and data persistence.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Zustand (State Management).
- **Backend/Runtime**: Electron (Windows Integration).
- **Styling**: Vanilla CSS with a modular, component-based architecture.
- **Icons**: Lucide React.
- **Persistence**: IDB (IndexedDB wrapper).
- **Build Tool**: Vite.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended).
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/).

### Installation

1. Clone the repository OR download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the application in development mode with HMR (Hot Module Replacement):

```bash
# Terminal 1: Start the Vite dev server
npm run dev

# Terminal 2: Start Electron (Wait for Vite to be ready)
npm run electron:dev
```

### Building for Production

To create a production-ready Windows executable:

```bash
npm run electron:build
```

---

## 🎨 Customization

Colors and theme tokens are managed in `src/styles/variables.css`. You can adjust opacities and colors for both Light and Dark themes to customize the transparency of the Mica/Acrylic effects.

---

## 🤖 About Development

This project was built leveraging **Antigravity**, primarily through AI-assisted coding, with manual adjustments, architectural decisions, and oversight provided by a React Developer.

---

## 📄 License

This project is licensed under the **GNU General Public License v3 (GPLv3)**. 

NotesPro is free software: you can redistribute it and/or modify it under the terms of the GPLv3 to ensure that the application and its future improvements remain free and open for the entire community. See the [LICENSE](./LICENSE) file for more details.
