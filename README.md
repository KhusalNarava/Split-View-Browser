# Split View Browser

> A lightweight browser workspace for browsing two web sessions side-by-side.

**Split View Browser** turns a single browser window into a flexible dual-browser workspace. Open two independent web sessions side-by-side or stack them vertically, resize each panel, and use familiar browser controls without switching between separate windows.

It is designed for workflows where you constantly compare, research, reference, or work across multiple websites at the same time.

## 🚀 Live Demo

**Website:** https://splitviewbrowser.vercel.app/

**GitHub:** https://github.com/KhusalNarava/Split-View-Browser

## ✨ What it does

Split View Browser provides two independent browser panels inside one workspace.

Each panel supports its own:

* URL navigation
* Back / Forward
* Refresh
* Home
* Tabs
* Bookmarks
* Browsing history
* URL autocomplete from visited pages
* Find in page
* Screenshots
* Private mode
* Page color inversion

The entire workspace also supports:

* Horizontal split mode
* Vertical split mode
* Resizable panels
* Dark mode
* Custom accent colors
* Keyboard shortcuts
* A floating navigation interface

## 🧠 The idea

Modern work often requires two websites at the same time:

* Documentation + code
* Research + notes
* Product + analytics
* Google + another search source
* AI assistant + development environment
* Reference material + working application
* Two competing products for comparison

Normally, this means opening multiple windows and manually arranging them.

Split View Browser makes that interaction native to the workspace:

```text
                 Split View Browser

        ┌─────────────────────────────────┐
        │       Browser Workspace          │
        ├─────────────────┬───────────────┤
        │                 │               │
        │    Browser A    │   Browser B   │
        │                 │               │
        │   Tabs + URL    │  Tabs + URL   │
        │   History       │  History      │
        │   Bookmarks     │  Bookmarks     │
        │                 │               │
        └─────────────────┴───────────────┘
```

Switch to vertical mode whenever that works better for the task:

```text
┌─────────────────────────────────┐
│           Browser A             │
│                                 │
├─────────────────────────────────┤
│           Browser B             │
│                                 │
└─────────────────────────────────┘
```

The result is a compact browser workspace rather than a collection of disconnected windows.

## 🎯 Designed for multitasking

Split View Browser is particularly useful for:

### Research

Read a source in one panel while searching or cross-checking information in the other.

### Development

Keep documentation, GitHub, a deployed application, or an API reference visible next to your working environment.

### AI workflows

Keep an AI assistant or reference material open in one panel while working with another web application in the second.

### Comparison

Compare two websites, products, dashboards, articles, or applications simultaneously.

### Productivity

Keep your primary task visible while using the second panel for context, communication, or reference information.

## 🧩 Core features

### Two independent browser sessions

Each panel maintains its own navigation state, allowing you to browse different sites independently.

### Resizable split layouts

The divider between the panels can be dragged to allocate more space to whichever side needs it.

### Horizontal and vertical layouts

Switch between:

* **Side-by-side**
* **Top-and-bottom**

The layout preference is persisted locally.

### Tabs

Each browser panel supports multiple tabs.

You can:

* Create new tabs
* Switch between tabs
* Close tabs
* Keep separate browsing sessions inside each split

### Navigation controls

Every browser panel includes familiar controls:

* Back
* Forward
* Refresh
* Home
* URL input

URLs without a protocol are automatically normalized to HTTPS.

### Bookmarks

Save frequently used pages directly inside the browser workspace.

Bookmarks are persisted using local browser storage.

### History

Recently visited URLs are stored locally and used for navigation suggestions.

The workspace also provides a way to clear the stored visited-page history.

### Find in page

Search within the currently loaded page and move between matching results using Enter and Shift+Enter.

### Screenshot

Capture the current page content from a browser panel and download it as an image.

### Private mode

Private mode prevents new visited URLs from being added to the persistent local browsing history for that panel and resets the panel session state.

### Page color inversion

Invert page colors when needed for visual accessibility or a different viewing experience.

### Dark mode

The complete browser workspace supports a dark interface.

### Custom accent colors

Choose an accent color for the workspace interface.

The selected color is persisted locally.

### Keyboard shortcuts

Current shortcuts include:

| Shortcut        | Action                   |
| --------------- | ------------------------ |
| `Ctrl/Cmd + B`  | Toggle navigation island |
| `Ctrl/Cmd + L`  | Toggle split layout      |
| `Enter`         | Next find result         |
| `Shift + Enter` | Previous find result     |

## 🏗️ How it works

At a high level, the application is composed of three layers:

```text
React Workspace
      ↓
Split Panel Manager
      ↓
Independent Browser Panels
      ↓
URL Proxy
      ↓
Remote Websites
```

The main workspace uses resizable panels to manage the two browser instances.

Each browser panel maintains its own navigation history, tabs, bookmarks, visited URLs, loading state, private-mode state, and page controls.

External pages are loaded through the application's `/api/proxy` endpoint. The server fetches the requested page, removes frame-blocking headers for the proxied response, injects a base URL for relative assets, and adds the communication layer used for features such as Find in Page and screenshots.

The proxy also rejects requests targeting localhost and common private-network address ranges.

## 🛠️ Tech Stack

* **Frontend:** React 19
* **Language:** TypeScript
* **Build tool:** Vite
* **Server:** Node.js + Express
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Animation:** Motion
* **Panels:** react-resizable-panels
* **Screenshots:** html2canvas
* **Runtime tooling:** TSX + esbuild

The dependency stack is defined in the repository's `package.json`.

## 📁 Project structure

```text
Split-View-Browser/
├── src/
│   └── App.tsx              # Main browser workspace and UI
├── assets/                  # Project assets
├── server.ts                # Express server + web proxy
├── index.html               # Application entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── .env.example              # Environment configuration template
└── README.md
```

## 💻 Run locally

### Prerequisites

* Node.js
* npm or Bun

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application runs through the Express + Vite development setup.

### Production build

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Preview the Vite build

```bash
npm run preview
```

### Type-check the project

```bash
npm run lint
```

The available scripts are defined in `package.json`.

## 🔐 Privacy and local storage

Several user preferences and browser workspace settings are stored locally in the browser, including:

* Layout preference
* Accent color
* Bookmarks
* Recently visited URLs

Private mode is designed to avoid adding new navigation entries to the persistent visited-URL history.

The application does use a server-side proxy to retrieve remote pages, so this should not be interpreted as a fully client-only browsing environment. The proxy validates URLs and blocks common local/private network destinations before fetching remote content.

## ⚠️ Important limitations

Split View Browser is a web-based browser workspace rather than a full replacement for a native browser.

Because web pages are rendered through iframes and a proxy:

* Some websites may refuse to load correctly.
* Highly interactive or security-sensitive websites may behave differently from normal browser tabs.
* Websites with unusual authentication flows may not work as expected.
* Browser APIs that require a real top-level browsing context may be unavailable.
* Compatibility depends partly on the behavior and security policies of the target website.

These are natural trade-offs of building a browser-like workspace inside a web application.

## 🗺️ Future direction

The current project can evolve into a much larger **personal browser workspace**.

Potential directions include:

* More than two browser panels
* Saved workspace layouts
* Workspace presets for different workflows
* Drag-and-drop tabs between panels
* Tab groups
* Split presets such as 25/75, 50/50 and 75/25
* Persistent sessions
* Cross-panel drag and drop
* Side-by-side page comparison tools
* AI-powered research assistance
* Page summarization
* Multi-page research workspaces
* Notes attached to individual pages
* Workspace sharing
* Browser extensions
* More advanced privacy controls
* Full desktop packaging with Electron or Tauri

The larger vision is to turn the browser from a single-page navigation tool into a **multi-surface workspace for modern internet work**.

## 🤝 Contributing

Ideas, bug reports, UI improvements, browser compatibility fixes, and feature contributions are welcome.

Some useful areas to contribute include:

1. Improving compatibility with more websites
2. Improving browser navigation behavior
3. Adding workspace persistence
4. Expanding tab management
5. Improving privacy controls
6. Building new productivity workflows
7. Adding automated tests

## 📄 License

The repository currently does not declare a dedicated open-source license file.

Before redistributing or commercially packaging the project, review and define the repository's licensing terms.

## ⭐ Built for a multi-window internet

The web increasingly demands multiple sources at once.

**Split View Browser brings them together in one focused workspace.**

> **Browse more. Switch less.**
