---
name: promptmanager-core
description: Technical implementation details and architectural patterns for the Prompt Manager project.
---

# Prompt Manager - Core Implementation

This document is the source of truth for the technical implementation of the Prompt Manager project.

## 🛠️ Tech Stack
- **Framework**: Next.js v16.1.4 (App Router)
- **Language**: TypeScript v5+ (Strict Mode)
- **State**: React Context API (AppContext)
- **Styling**: Tailwind CSS v4
- **Storage**: LocalStorage + File System Access API

## 🏛️ Architecture & Patterns

### 1. Global State Management (Context Pattern)
- Centered in `src/store/AppContext.tsx`.
- Handles folder management, prompt CRUD, search filtering, and persistence.
- Persistence is automatic with `localStorage` and syncs with JSON files via File System API.

### 2. Component Structure
- **Containers**: `page.tsx`, `Sidebar.tsx`. They connect to `useApp()`.
- **Pure Components**: `PromptCard.tsx`, `EditModal.tsx`. They receive data/callbacks via props.

### 3. Project Structure
- `src/app/`: Routing and layouts.
- `src/components/`: UI components.
- `src/store/`: Business logic and state.
- `src/types/`: TypeScript definitions.
- `src/utils/`: Helpers and API wrappers.

## 📐 Development Guidelines
- **Strict Typing**: No `any`. Interfaces in `src/types/`.
- **Performance**: Use `useCallback` and `useMemo` for heavy lists and drag-and-drop operations.
- **Styling**: Dark theme by default (`bg-[#1a1a1a]`). Grid-based layouts.
