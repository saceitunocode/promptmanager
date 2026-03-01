# Prompt Manager 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)](./LICENSE)

Una aplicación web moderna para gestionar, organizar y almacenar tus prompts de IA de manera eficiente. Construida con **Next.js** y diseñada para funcionar localmente con capacidades de persistencia avanzada.

---

## ✨ Características Principales

- **📁 Organización por Carpetas** — Crea, edita y elimina carpetas para organizar tus prompts temáticamente. Personaliza sus colores.
- **📝 Gestión de Prompts** — CRUD completo de prompts. Títulos, contenido y metadatos.
- **🖱️ Drag & Drop Intuitivo**:
  - Reordena prompts dentro de una lista.
  - Mueve prompts entre carpetas arrastrándolos.
  - Interfaz fluida y reactiva.
- **💾 Persistencia Local**:
  - Guardado automático en `localStorage`.
  - **Sincronización con Archivos**: Capacidad de abrir y guardar directamente en archivos JSON de tu sistema local usando la *File System Access API*.
- **⚡ Vistas Flexibles** — Alterna entre vista de Cuadrícula (Grid) y Lista.
- **🔍 Búsqueda en Tiempo Real** — Filtra prompts instantáneamente por título o contenido.
- **🔒 Privacidad Total** — Todo se ejecuta en tu navegador. Tus prompts no salen de tu dispositivo a menos que tú los exportes.
- **🌙 Modo Oscuro** — Interfaz diseñada nativamente en modo oscuro para reducir la fatiga visual.

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Rol |
| :--- | :---: | :--- |
| [Next.js](https://nextjs.org/) | `16.1.4` | Framework principal (App Router) |
| [React](https://react.dev/) | `19.2.3` | Librería de UI |
| [TypeScript](https://www.typescriptlang.org/) | `^5` | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | `^4` | Estilos (CSS-first config) |
| [Lucide React](https://lucide.dev/) | `^0.563.0` | Iconografía |
| [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) | Web Std. | Persistencia en disco local |

---

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

### Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo con hot-reload |
| `pnpm build` | Genera la build de producción optimizada |
| `pnpm start` | Arranca el servidor en modo producción |
| `pnpm lint` | Ejecuta ESLint para análisis estático del código |

---

## 📁 Estructura del Proyecto

```text
promptmanager/
├── src/
│   ├── app/                    # Páginas y Layouts (Next.js App Router)
│   │   ├── layout.tsx          # Layout raíz con providers
│   │   ├── page.tsx            # Página principal
│   │   └── globals.css         # Estilos globales (Tailwind v4)
│   ├── components/             # Componentes reutilizables
│   │   ├── ConfirmModal.tsx    # Modal de confirmación genérico
│   │   ├── EditModal.tsx       # Modal de creación/edición de prompts
│   │   ├── Header.tsx          # Cabecera principal con búsqueda
│   │   ├── PromptCard.tsx      # Tarjeta individual de prompt (drag & drop)
│   │   ├── Sidebar.tsx         # Barra lateral de carpetas
│   │   ├── Toast.tsx           # Notificaciones temporales
│   │   └── index.ts            # Barrel exports
│   ├── store/
│   │   └── AppContext.tsx      # Estado global y lógica de negocio (Context API)
│   ├── types/
│   │   └── index.ts            # Definiciones de tipos TypeScript
│   └── utils/                  # Utilidades y helpers
├── public/                     # Recursos estáticos
├── .agent/                     # Sistema de agentes IA del proyecto
├── AGENTS.md                   # Normas de comportamiento para agentes IA
├── package.json
└── tsconfig.json
```

---

## 🤖 Desarrollo Asistido por IA

Este proyecto está diseñado para evolucionar con la ayuda de **agentes de IA especializados**. Estos agentes:

- **Mantienen la calidad del código** siguiendo patrones establecidos automáticamente.
- **Preservan la arquitectura** sin necesidad de documentación manual repetitiva.
- **Aceleran el desarrollo** aplicando reglas de seguridad, testing y rendimiento de forma consistente.

**¿Qué significa esto para ti?**
- Si usas la aplicación: **Nada**. Funciona igual, solo que evoluciona más rápido y con menos bugs.
- Si contribuyes al código: Los agentes te ayudarán a mantener la consistencia. Consulta [`AGENTS.md`](./AGENTS.md) para las normas de comportamiento.

El directorio `.agent/` contiene el sistema de agentes. **Este directorio debe versionarse en Git** junto con el código fuente, ya que asegura que cualquier desarrollador o instancia de IA mantenga la consistencia, habilidades y reglas específicas del proyecto. No necesitas entender su contenido interno para usar la aplicación.

---

## 📜 Licencia

Este repositorio es **público**, pero el código está protegido bajo una **licencia restrictiva personalizada**.

> ❌ **Está prohibido** usar, copiar, modificar, distribuir, hacer fork o explotar comercialmente este código sin **autorización expresa y por escrito** del autor.

Consulta el fichero [`LICENSE`](./LICENSE) para los términos completos.