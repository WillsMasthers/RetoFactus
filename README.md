# RetoFactus

Este proyecto es un reto para construir una aplicación full-stack (Backend + Frontend) que consume una API externa y visualiza los datos obtenidos.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Configuración del Entorno](#configuración-del-entorno)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Lista de Tareas (To-Do)](#lista-de-tareas-to-do)
- [Notas Adicionales](#notas-adicionales)

## Descripción

El objetivo principal de `RetoFactus` es desarrollar:

1.  Un **Backend** (probablemente en Node.js) que actúe como intermediario para consumir una API externa de forma segura y eficiente.
2.  Un **Frontend** (React + Vite) que interactúe con nuestro Backend para solicitar y mostrar la información al usuario de manera amigable.

## Tecnologías Utilizadas

- **Backend:**
  - Node.js
  - Express (o el framework que elijas)
  - `dotenv` para variables de entorno
  - `axios` o `node-fetch` (para consumir la API externa)
  - _(Añadir otras dependencias backend a medida que se usen)_
- **Frontend:**
  - React
  - Vite
  - _(Añadir otras dependencias frontend como librerías de UI, state management, etc.)_
- **Control de Versiones:**
  - Git

## Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- Node.js (incluye npm) - Se recomienda la versión LTS.
- Git
- Un editor de código (ej. VS Code)

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clona el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd RetoFactus
    ```

2.  **Instala las dependencias del Backend:**

    ```bash
    cd backend  # O el nombre de tu carpeta backend
    npm install
    ```

3.  **Instala las dependencias del Frontend:**
    ```bash
    cd ../client # O el nombre de tu carpeta frontend
    npm install
    ```

## Configuración del Entorno

El backend requiere variables de entorno para funcionar correctamente, especialmente para las credenciales o URLs de la API externa.

1.  **Navega a la carpeta del backend:**

    ```bash
    cd backend # O el nombre de tu carpeta backend
    ```

2.  **Crea un archivo `.env`** en la raíz de la carpeta del backend. Puedes copiar el archivo `.env.example` si existe, o crearlo desde cero.

    ```bash
    # Ejemplo de contenido para .env
    FACTUS_USERNAME=correo/usuario
    FACTUS_PASSWORD=contraseña
    FACTUS_CLIENT_ID=tu_client_id
    FACTUS_CLIENT_SECRET=tu_client_secret
    AFACTUS_API_URL=https://api-sandbox.factus.com.co # URL base de la API a consumir

    # Añade otras variables que necesites
    ```

3.  **Importante:** Asegúrate de que el archivo `.env` esté incluido en tu `.gitignore` para no subir información sensible al repositorio.

## Ejecución

Para poner en marcha la aplicación, necesitarás ejecutar tanto el backend como el frontend. Generalmente, se hace en terminales separadas:

1.  **Iniciar el Servidor Backend:**

    ```bash
    cd backend # O el nombre de tu carpeta backend
    npm run dev # O el comando que hayas configurado (ej. npm start)
    ```

    El servidor backend debería iniciarse (por defecto, en el ejemplo anterior, en `http://localhost:3001`).

2.  **Iniciar la Aplicación Frontend:**
    ```bash
    cd ../client # O el nombre de tu carpeta frontend
    npm run dev
    ```
    La aplicación React debería abrirse en tu navegador (Vite suele usar `http://localhost:5173` por defecto).

## Estructura del Proyecto

## Lista de Tareas (To-Do)
