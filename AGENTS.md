# AGENTS.md - Normas para Agentes

Este archivo define las reglas de comportamiento y normas de actuación del sistema. La implementación técnica reside exclusivamente en `.agent/`.

## 🎯 Objetivo General
Mantener la integridad, rendimiento y calidad de la biblioteca de prompts, asegurando una experiencia local privada y fluida.

## 📜 Reglas de Comportamiento (Mandatorias)

1.  **Fuente de Verdad**: Siempre consulta `.agent/` antes de cualquier implementación técnica. Consulta `promptmanager-core` para detalles específicos del proyecto.
2.  **Referenciación**: No dupliques código o definiciones de `.agent/`. Resume solo el impacto y las normas de uso si es necesario explicarlas.
3.  **Idioma**: Comunicación con el usuario en **Español**. Comentarios de código y variables en **Inglés**.
4.  **Prioridad de Código**:
    - **Seguridad**: No comprometer la privacidad local de los prompts.
    - **Simplicidad**: Sigue los principios de `clean-code` (evita sobre-ingeniería).
    - **Consistencia**: Mantener el patrón de estado basado en `AppContext`.
5.  **Checks Finales**: Ninguna tarea se considera terminada sin verificar tipos de TS y linting (`pnpm build`).

## 🧠 Guía de Actuación
- **Modo Plan**: Si el cambio es estructural, genera un plan antes de codificar.
- **Modo Edición**: Realiza cambios incrementales y verifica la persistencia de datos tras cada modificación.
- **Sincronización**: Siempre ten en cuenta la compatibilidad con la *File System Access API* al modificar el almacenamiento.
- **Idioma**: Responder al usuario en Español. Código y comentarios en Inglés.

---

## 🏗️ Contexto del Sistema (Impacto)
El sistema utiliza una arquitectura basada en **Next.js App Router** con un estado global centralizado. Los agentes deben actuar con cautela al modificar el `AppContext` para no romper la lógica de sincronización local.
