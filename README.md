# Prompt Manager 🚀

Una aplicación web moderna para gestionar, organizar y almacenar tus prompts de IA de manera eficiente. Construida con **Next.js** y diseñada para funcionar localmente con capacidades de persistencia avanzada.

Esta aplicación es la evolución de la "Biblioteca de Prompts - Founderz", migrada a una arquitectura robusta basada en React y Componentes.

## ✨ Características Principales

- **Organización por Carpetas**: Crea, edita y elimina carpetas para organizar tus prompts temáticamente. Personaliza sus colores.
- **Gestión de Prompts**: CRUD completo de prompts. Títulos, contenido y metadatos.
- **Drag & Drop Intuitivo**:
  - Reordena prompts dentro de una lista.
  - Mueve prompts entre carpetas arrastrándolos.
  - Interfaz fluida y reactiva.
- **Persistencia Local**:
  - Guardado automático en `localStorage`.
  - **Sincronización con Archivos**: Capacidad de abrir y guardar directamente en archivos JSON de tu sistema local usando la *File System Access API*.
- **Vistas Flexibles**: Alterna entre vista de Cuadrícula (Grid) y Lista.
- **Búsqueda en Tiempo Real**: Filtra prompts instantáneamente por título o contenido.
- **Privacidad Total**: Todo se ejecuta en tu navegador. Tus prompts no salen de tu dispositivo a menos que tú los exportes.
- **Modo Oscuro**: Interfaz diseñada nativamente en modo oscuro para reducir la fatiga visual.

## 🛠️ Stack Tecnológico

| Tecnología | Versión / Notas |
| :--- | :--- |
| [Next.js](https://nextjs.org/) | v16.1.4 (App Router) |
| [React](https://react.dev/) | v19.2.3 |
| [TypeScript](https://www.typescriptlang.org/) | v5+ |
| [Tailwind CSS](https://tailwindcss.com/) | v4 |
| [Lucide React](https://lucide.dev/) | Iconografía |
| [File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) | Persistencia en disco |

## 🚀 Cómo Empezar

### Pre-requisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/) (recomendado)

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd promptmanager

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```text
/src
├── app/                    # Páginas y Layouts (Next.js App Router)
├── components/             # Componentes Reutilizables (UI)
│   ├── PromptCard.tsx      # Tarjeta individual de prompt
│   ├── Sidebar.tsx         # Barra lateral de navegación
│   └── ...
├── store/                  # Estado Global (Context API)
│   └── AppContext.tsx      # Lógica de negocio centralizada
└── types/                  # Definiciones de Tipos TypeScript
```

## 🤖 Para Desarrolladores (IA)

Este proyecto incluye un archivo `AGENTS.md` con instrucciones detalladas, arquitectura y convenciones de código para mantener la calidad y coherencia del proyecto durante el desarrollo asistido por IA.

## 📄 Licencia

Privada / Uso Personal.
