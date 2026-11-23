# PANCHO GYM 2.0

Aplicación web progresiva (PWA) de entrenamiento personal, construida con HTML5, CSS3, JavaScript e IndexedDB. No utiliza cuentas, bases de datos externas, claves privadas, servicios de pago ni sincronización en la nube.

## Contenido

- `ABRIR_PANCHO_GYM.bat`: lanzador de Windows; inicia el servidor local y abre la app en el navegador.
- `index.html`: punto de entrada.
- `styles.css`: interfaz responsive oscura con acento verde lima.
- `app.js`: vistas, perfiles, rutinas, sesiones, medidas, fotografías, estadísticas y respaldos.
- `db.js`: acceso y persistencia de IndexedDB.
- `manifest.webmanifest`: metadatos de instalación PWA.
- `service-worker.js`: caché de la aplicación para uso offline.
- `assets/exercises/`: ilustraciones SVG individuales para cada ejercicio.
- `assets/icons/`: iconos SVG y PNG de la aplicación.
- `tests/smoke_test.py`: pruebas automatizadas con Playwright (opcional).
- `TEST_REPORT.md`: resultado y alcance de las pruebas ejecutadas.

## A. Abrir en Windows

1. Descarga y extrae `PANCHO_GYM_2.0.zip` en una carpeta, por ejemplo `C:\PanchoGym`.
2. Abre la carpeta extraída.
3. Haz doble clic en **`ABRIR_PANCHO_GYM.bat`**. El archivo inicia un servidor local y abre la aplicación en el navegador predeterminado (Google Chrome si es tu navegador predeterminado).
4. Si Chrome no es el navegador predeterminado, copia `http://localhost:8000` en Google Chrome.

El lanzador necesita Python 3 instalado. Si no lo encuentra, instala Python desde https://www.python.org/downloads/, activa **Add Python to PATH** durante la instalación y vuelve a ejecutar el `.bat`. Mantén abierta la ventana del servidor mientras uses la aplicación; para cerrarlo, pulsa `Ctrl+C` en esa ventana.

Para instalarla como PWA en Chrome de Windows, utiliza el icono de instalación de la barra de direcciones o el menú de Chrome → **Instalar PANCHO GYM 2.0** (si aparece).

> Puedes abrir `index.html` directamente para una consulta rápida, pero el modo `file://` no permite registrar el Service Worker. Para PWA, caché offline e instalación, utiliza `http://localhost` o un sitio HTTPS.

## B. Instalar en Samsung Galaxy S24+

Chrome para Android necesita un origen seguro (HTTPS) para instalar y ejecutar el Service Worker. Por eso, para instalarla como PWA en el teléfono, publica **los archivos de esta carpeta** en un alojamiento estático HTTPS. Esto solo aloja los archivos de la aplicación: los perfiles, rutinas, registros y fotos continúan guardándose dentro del almacenamiento local del navegador del teléfono; no se sincronizan con el alojamiento.

Una opción gratuita es GitHub Pages:

1. Crea un repositorio en GitHub y sube el contenido de esta carpeta (el `index.html` debe quedar en la raíz publicada).
2. En el repositorio abre **Settings → Pages**.
3. En **Build and deployment**, selecciona desplegar desde la rama principal y la carpeta raíz (`/(root)`), y guarda.
4. Abre en el Samsung S24+ la URL HTTPS que GitHub Pages indique.
5. En Chrome para Android, abre el menú ⋮ y selecciona **Instalar aplicación** o **Añadir a pantalla de inicio**. Confirma.
6. Abre PANCHO GYM desde el icono instalado. La primera apertura necesita internet para descargar la aplicación; después de instalar y completar la caché inicial, puede abrirse sin conexión.

La opción exacta de instalación depende de la versión de Chrome y del navegador Android. Este proyecto es una PWA; **no se ha generado un APK**.

## C. Transferir los datos entre Windows y Android

1. En el dispositivo de origen abre **Ajustes → Descargar respaldo completo**. Se genera un archivo `PANCHO_GYM_2.0_respaldo_YYYY-MM-DD.json`.
2. Transfiere ese JSON al otro dispositivo mediante cable USB, una memoria, transferencia local o el método de archivos que prefieras.
3. En el dispositivo de destino abre la misma versión compatible de PANCHO GYM 2.0.
4. Entra en **Ajustes → Seleccionar archivo JSON** y elige el respaldo.
5. La aplicación valida la estructura, los perfiles y las referencias de datos. Después muestra una advertencia porque la restauración reemplaza los datos locales actuales de ese navegador.
6. Confirma solo cuando hayas guardado un respaldo de lo que ya existía en el dispositivo de destino.

El archivo contiene todos los perfiles, rutinas, sesiones, medidas y fotos. El respaldo puede ser grande si hay muchas fotografías; guárdalo en un lugar privado y seguro.

## D. Actualizar la aplicación sin perder datos

1. Haz primero un respaldo desde **Ajustes**.
2. Sustituye los archivos de la versión publicada por los archivos nuevos. Mantén la misma URL, dominio y ruta de instalación.
3. En `service-worker.js`, incrementa el nombre de caché, por ejemplo de `pancho-gym-shell-v1` a `pancho-gym-shell-v2`. Así el navegador descargará el nuevo shell y eliminará la caché antigua.
4. Conserva el nombre de base de datos `pancho-gym-2` y la estructura/versión de IndexedDB. Si en una versión futura cambian las tablas, añade una migración explícita en `db.js`; no borres la base de datos.
5. Cierra y vuelve a abrir la aplicación, o recarga Chrome cuando avise de que hay una actualización lista.
6. Comprueba el perfil y restaura el respaldo únicamente si fuera necesario.

Los datos viven en IndexedDB del navegador, separados por identificador de perfil. El Service Worker solo almacena archivos estáticos de la aplicación y no borra ni sustituye los registros. Borrar los datos del sitio, desinstalar el navegador o limpiar el almacenamiento puede eliminar la información local: conserva copias de seguridad periódicas.

## Almacenamiento y privacidad

- Cada instalación/navegador mantiene su propia base de datos IndexedDB.
- Las fotos se guardan como objetos Blob en IndexedDB.
- El cambio de perfil filtra rutinas, sesiones, medidas y fotos por `profileId`.
- No hay sincronización entre dispositivos ni cuenta de usuario.
- La aplicación no incorpora bibliotecas de terceros ni requiere una API.
- La app solicita al navegador almacenamiento persistente cuando está disponible, pero la decisión final corresponde al navegador y al sistema operativo.

## Pruebas automatizadas opcionales

El proyecto incluye `tests/smoke_test.py`. Requiere Python 3, `pip install playwright pillow` y un Chromium compatible (`playwright install chromium`). Desde la raíz del proyecto:

```bash
python tests/smoke_test.py
```

Las pruebas automatizadas comprueban inicio, perfiles aislados, rutinas, series, cargas, cronómetro, pausas, sesiones, medidas, estadísticas, fotos, persistencia, respaldo y restauración, Service Worker, modo offline y viewport móvil. El resultado detallado está en `TEST_REPORT.md`. La interfaz se probó con Chromium y un viewport móvil emulado; la instalación final en un Samsung físico debe verificarse también en el propio teléfono.
