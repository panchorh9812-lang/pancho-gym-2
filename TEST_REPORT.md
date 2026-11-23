# Informe de pruebas — PANCHO GYM 2.0

**Resultado:** 10 comprobaciones aprobadas.

**Entorno:** Chromium de escritorio automatizado, servidor HTTP local, IndexedDB y Service Worker. Se comprobó también una ventana móvil de 390 × 844 píxeles y una recarga sin conexión tras precargar los recursos.

## Comprobaciones aprobadas

1. Inicio, manifest PWA y registro del Service Worker.
2. Separación entre perfiles iniciales, generación de una rutina por perfil y guardado de medidas.
3. Alta de un tercer perfil y aislamiento de sus datos.
4. Creación y edición de rutinas, días y ejercicios.
5. Series, pesos, sustitución de ejercicios, cronómetro, pausa, reanudación, finalización y cancelación.
6. Medidas corporales, estadísticas e historial.
7. Carga de fotografías y persistencia en IndexedDB después de recargar.
8. Exportación e importación del respaldo, con recuperación de fotografías.
9. Recarga offline y comprobación de anchura en viewport móvil de 390 px.
10. Ausencia de errores JavaScript no capturados y errores de consola durante la prueba.

## Alcance y límites

- La comprobación móvil se realizó con viewport emulado en Chromium; no se ejecutó físicamente en un Samsung Galaxy S24+.
- La instalación Android debe hacerse desde una URL HTTPS. La PWA no es un APK y este proyecto no genera APK.
- Los datos se guardan localmente en cada navegador/dispositivo. Para transferirlos se utiliza el respaldo JSON.
