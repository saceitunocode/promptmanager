# AGENTS.md - Instrucciones para Agentes de IA

Este archivo define las reglas, convenciones y contexto técnico para trabajar en el proyecto `promptmanager`. Los agentes de IA **DEBEN** leer y seguir estas instrucciones.

---

## 📌 Contexto del Proyecto

| Atributo | Valor |
| :--- | :--- |
| **Nombre** | Prompt Manager (Biblioteca de Prompts) |
| **Descripción** | Gestor local de prompts con organización por carpetas y persistencia local |
| **Arquitectura** | Next.js App Router (v16+) |
| **Estado** | React Context + LocalStorage + File System Access API |
| **Repositorio** | TypeScript + Tailwind CSS |

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión / Notas |
| :--- | :--- | :--- |
| **Framework** | Next.js | v16.1.4 (App Router) |
| **Lenguaje** | TypeScript | v5+ (Strict Mode) |
| **UI Library** | React | v19.2.3 |
| **Estilos** | Tailwind CSS | v4 (PostCSS plugin) |
| **Iconos** | Lucide React | |
| **Persistencia** | LocalStorage + File System API | Sincronización con archivos JSON locales |
| **Linting** | ESLint | `eslint-config-next` |
| **Manager** | pnpm | |

---

## 📂 Estructura de Proyecto

```text
/
├── src/
│   ├── app/                    # Rutas App Router
│   │   ├── layout.tsx          # Layout raíz (Providers)
│   │   ├── page.tsx            # Página principal (Dashboard)
│   │   └── globals.css         # Estilos globales (Tailwind v4)
│   ├── components/             # Componentes de UI
│   │   ├── Sidebar.tsx         # Navegación y gestión de carpetas
│   │   ├── PromptCard.tsx      # Tarjeta visual de prompt
│   │   ├── EditModal.tsx       # Modal de edición/creación
│   │   ├── ConfirmModal.tsx    # Modal de confirmación genérico
│   │   └── ...                 # Otros componentes
│   ├── store/                  # Gestión de Estado
│   │   └── AppContext.tsx      # Contexto global (Folders, Prompts, UI State)
│   ├── types/                  # Definiciones de TypeScript
│   │   └── index.ts            # Interfaces (Folder, Prompt, AppData)
│   └── utils/                  # Pasarelas y utilidades
└── AGENTS.md                   # ESTE ARCHIVO
```

---

## 🏛️ Patrones y Arquitectura

### Gestión de Estado (Context Pattern)
- **Centralizado**: Todo el estado global (carpetas, prompts, selección, drag & drop) reside en `AppContext.tsx`.
- **Acceso**: Usar el hook `useApp()` para acceder al estado y acciones.
- **Persistencia**: El contexto maneja automáticamente el guardado en `localStorage` y la sincronización con archivos locales si hay un `fileHandle` activo.

### Componentes (Presentational vs Container)
- **Componentes Tontos (Presentational)**: Reciben datos y callbacks por props (ej: `PromptCard`, `ConfirmModal`). No deben acceder a `useApp` si pueden evitarlo.
- **Componentes Listos (Container)**: `page.tsx` o `Sidebar.tsx` conectan con `useApp` y distribuyen la lógica.

### SOLID en React
- **S (Single Responsibility)**: `AppContext` maneja los datos, los componentes manejan la visualización.
- **O (Open/Closed)**: Los componentes como `PromptCard` usan props para sus acciones en lugar de hardcodear lógica de negocio.
- **D (Dependency Inversion)**: Las dependencias de datos se inyectan via Contexto o Props.

---

## 📐 Reglas de Desarrollo

### 1. TypeScript
- **Strict Mode**: No usar `any`. Definir interfaces claras en `src/types/index.ts`.
- **Props**: Definir interfaces para los props de todos los componentes.
- **Eventos**: Tipar correctamente los eventos (`React.DragEvent`, `React.ChangeEvent`).

### 2. Next.js & React
- **'use client'**: Dado que es una SPA local altamente interactiva, la mayoría de componentes serán Client Components.
- **Hooks**: Usar `useCallback` para funciones pasadas a componentes hijos para evitar re-renders innecesarios, especialmente en listas largas de prompts.

### 3. Estilos (Tailwind CSS v4)
- **Tema Oscuro**: La aplicación usa un diseño oscuro por defecto (`bg-[#1a1a1a]`, `text-white`).
- **Responsive**: Grid system para las tarjetas (`grid-cols-1` a `grid-cols-4`).
- **Drag & Drop**: Clases visuales para el estado de arrastre (ej: opacidad reducida, bordes resaltados).

### 4. Funcionalidades Críticas
- **Persistencia**: NUNCA romper la lógica de `localStorage` en `AppContext`.
- **File System API**: Mantener la compatibilidad con el sistema de archivos nativo para guardar/cargar JSONs.

---

## 🧪 Testing (Planificado)
- Aunque actualment no hay tests configurados, escribir código testeable (funciones puras donde sea posible, separación de lógica y vista).

---

## ✅ Checklist de Calidad

- [ ] ¿El cambio mantiene la persistencia de datos?
- [ ] ¿Funciona el Drag & Drop tras los cambios?
- [ ] ¿La interfaz responde correctamente a Mobile/Desktop?
- [ ] ¿No hay errores de TypeScript? (`pnpm build`)

---

## 🤖 Instrucciones Específicas
- **Idioma**: Responder al usuario en Español. Código y comentarios en Inglés.
- **Contexto**: Recordar que esto migró de un HTML monolítico; mantener la paridad de funcionalidades es prioridad.
