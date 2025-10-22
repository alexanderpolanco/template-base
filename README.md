<div align="center">
  <h1>🚀 Bun + React Template Custom</h1>
  <p>Un template robusto y moderno para iniciar proyectos web con Bun como runtime y React en el frontend.</p>
</div>

---

## 📋 Tabla de Contenidos

- [🚀 Primeros Pasos](#-primeros-pasos)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación](#instalación)
- [📜 Scripts Disponibles](#-scripts-disponibles)
- [🧪 Pruebas (Testing)](#-pruebas-testing)
  - [Estado Actual](#estado-actual)
  - [Sugerencia: Pruebas End-to-End con Playwright](#sugerencia-pruebas-end-to-end-con-playwright)
- [🤝 Contribuciones](#-contribuciones)
- [📊 Monitoreo de Errores con Sentry](#-monitoreo-de-errores-con-sentry)
---

## 🚀 Primeros Pasos

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### Prerrequisitos

Asegúrate de tener instalado [Bun](https://bun.sh/) en tu sistema. Bun es un runtime de JavaScript todo en uno ultrarrápido que usamos para ejecutar, construir y gestionar las dependencias de este proyecto.

### Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone <url-del-repositorio>
    cd <nombre-del-proyecto>
    ```

2.  **Instala las dependencias:**

    Usa Bun para instalar todas las dependencias listadas en el `package.json`.

    ```bash
    bun install
    ```

3.  **Inicia el servidor de desarrollo:**

    Este comando levanta la aplicación en modo de desarrollo con _hot-reloading_, lo que significa que los cambios que hagas en el código se reflejarán automáticamente en el navegador.

    ```bash
    bun dev
    ```

4.  **Ejecuta en producción:**

    Para simular el entorno de producción, primero necesitas construir la aplicación y luego iniciar el servidor.

    ```bash
    # 1. Construye el proyecto
    bun build

    # 2. Inicia el servidor de producción
    bun start
    ```

---

## 📜 Scripts Disponibles

Estos son los scripts definidos en el `package.json` que puedes usar para diferentes tareas:

| Script | Descripción |
| :--- | :--- |
| `bun dev` | Inicia un servidor de desarrollo con recarga en caliente (`--hot`). Ideal para trabajar en el día a día. |
| `bun start` | Ejecuta la aplicación en modo producción. Requiere que el proyecto haya sido construido previamente con `bun build`. |
| `bun build` | Compila y empaqueta la aplicación para producción. Genera los archivos optimizados en la carpeta `dist/`. |
| `bun build:spa` | Una alternativa de construcción, específicamente pensada para una Single Page Application (SPA). |
| `bun check` | Utiliza **Biome** para analizar, formatear y aplicar correcciones automáticas al código fuente, asegurando un estilo consistente y de alta calidad. |
| `bun commit` | Lanza **Commitizen**, un asistente interactivo en la terminal para crear mensajes de commit que siguen la especificación de _Conventional Commits_. |
| `bun setup:hooks` | Configura los Git Hooks locales. Específicamente, instala un hook `commit-msg` para validar los mensajes de commit. |
| `bun generate-version` | Crea un archivo `version.txt` en el directorio `dist/` con información de la versión, el hash del commit y la fecha de construcción. |

---

## 📊 Monitoreo de Errores con Sentry

Para asegurar la estabilidad de la aplicación en producción, este proyecto está preparado para integrarse con [Sentry](https://sentry.io), una plataforma líder en monitoreo de errores y rendimiento. A continuación se detalla cómo configurarlo.

### Paso 1: Instalación del SDK de Sentry

Añade el SDK de Sentry para Bun a las dependencias del proyecto.

```bash
bun add @sentry/bun
```

### Paso 2: Inicialización en la Aplicación

Es crucial inicializar Sentry lo antes posible en el punto de entrada de tu aplicación para capturar todos los posibles errores. En este template, el lugar ideal es al inicio de `src/index.tsx`.

```tsx
// src/index.tsx

import * as Sentry from "@sentry/bun";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Inicializa Sentry antes que cualquier otro código
Sentry.init({
  dsn: "TU_SENTRY_DSN_AQUI", // Reemplaza esto con el DSN de tu proyecto en Sentry

  // Para habilitar el monitoreo de rendimiento, ajusta este valor en producción
  tracesSampleRate: 1.0,
});

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

> **Importante:** No olvides reemplazar `"TU_SENTRY_DSN_AQUI"` con el DSN que Sentry te proporciona en la configuración de tu proyecto.

### Paso 3: Generación y Carga de Source Maps

Los _source maps_ son esenciales para que Sentry pueda mostrarte el código fuente original en los reportes de errores, en lugar del código minificado y transpilado de producción.

#### 3.1. Generar Source Maps

El empaquetador de Bun puede generar _source maps_ automáticamente. Modifica el script `build` en tu `package.json` para que incluya la bandera `--sourcemap`.

```json
// package.json (sección de scripts)
"scripts": {
  // ... otros scripts
  "build": "bun build src/index.tsx --outdir ./dist --sourcemap",
  // ...
}
```

Ahora, cuando ejecutes `bun build`, se generarán los archivos `.js` y sus correspondientes archivos `.js.map` en la carpeta `dist/`.

#### 3.2. Subir Source Maps a Sentry

Para que Sentry utilice estos archivos, debes subirlos. La forma más sencilla es usando el CLI de Sentry.

1.  **Instala el CLI de Sentry:**

    ```bash
    bun add -d @sentry/cli
    ```

2.  **Crea un script para subir los source maps:**
    Añade un nuevo script en tu `package.json` que se encargue de esta tarea. Este script creará una nueva "release" en Sentry y asociará los source maps a ella.

    ```json
    // package.json (sección de scripts)
    "scripts": {
      // ...
      "sentry:upload": "sentry-cli releases files \"mi-app@$(sentry-cli releases propose-version)\" upload-sourcemaps ./dist --rewrite"
    }
    ```

3.  **Configura la autenticación:**
    Antes de ejecutar el script, necesitas autenticarte. Crea un archivo `.sentryclirc` en la raíz de tu proyecto con tu token de autenticación y la información de tu organización y proyecto.

    ```ini
    # .sentryclirc
    [auth]
    token=TU_SENTRY_AUTH_TOKEN

    [defaults]
    org=el-slug-de-tu-org
    project=el-slug-de-tu-proyecto
    ```

    Puedes generar un token de autenticación en Sentry yendo a _User Settings > Auth Tokens_.

4.  **Ejecuta el proceso completo:**
    Ahora, tu flujo de despliegue a producción sería:

    ```bash
    # 1. Construye la aplicación con source maps
    bun build

    # 2. Sube los source maps a Sentry
    bun run sentry:upload

    # 3. Inicia tu servidor de producción
    bun start
    ```

Con estos pasos, Sentry estará completamente configurado para recibir errores de tu aplicación y mostrarte exactamente en qué línea de tu código original ocurrieron.

---

## 🧪 Pruebas (Testing)

### Estado Actual

Actualmente, el proyecto **no cuenta con una suite de pruebas automatizadas**. Es un punto crítico a desarrollar para garantizar la calidad y estabilidad del código a largo plazo.

Se recomienda encarecidamente la creación de pruebas y su integración en un **hook de Git `pre-push`**. De esta manera, las pruebas se ejecutarán automáticamente antes de subir cambios al repositorio, previniendo la introducción de errores en la base de código principal.

### Sugerencia: Pruebas End-to-End con Playwright

Dado que este proyecto está configurado como una **Single Page Application (SPA) con React** y un **servidor en Bun**, una excelente opción para las pruebas es utilizar **Playwright** para realizar tests _End-to-End_ (E2E).

**¿Por qué Playwright?**

- **Simula interacciones reales:** Playwright controla un navegador real (Chrome, Firefox, Safari) para interactuar con tu aplicación tal como lo haría un usuario.
- **Agnóstico al framework:** Funciona perfectamente con React, ya que prueba la aplicación desde el exterior, sin importar cómo esté construida internamente.
- **Potente y rápido:** Ofrece una API robusta para realizar acciones complejas y aserciones, con una ejecución muy eficiente.

**¿Cómo se implementaría?**

1.  **Instalación:** `bun add -d @playwright/test`
2.  **Configuración:** Se crearía un archivo de configuración para Playwright (`playwright.config.ts`) donde se especificaría la URL base de la aplicación cuando está en desarrollo (ej. `http://localhost:3000`).
3.  **Creación de pruebas:** Se escribirían archivos de prueba (ej. `tests/example.spec.ts`) que naveguen a páginas, hagan clic en botones, llenen formularios y verifiquen que la interfaz de usuario (UI) se comporta como se espera.

Un ejemplo simple de una prueba con Playwright podría ser:

```bash
import { test, expect } from '@playwright/test';

test('la página de inicio tiene el título correcto', async ({ page }) => {
  // 1. Iniciar el servidor de desarrollo con `bun dev` antes de correr la prueba

  // 2. Navegar a la página principal
  await page.goto('http://localhost:3000');

  // 3. Verificar que el título de la página es el esperado
  await expect(page).toHaveTitle(/Bun + React Template/);
});
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.23. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
