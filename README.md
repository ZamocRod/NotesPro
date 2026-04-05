# NotesPro 📔

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
