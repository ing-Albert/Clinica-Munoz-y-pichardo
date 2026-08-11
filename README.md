# Centro Médico Muñoz & Pichardo S.R.L.

Prototipo web en React para una clínica con directorio médico, especialidades, perfiles profesionales, noticias, avisos, contacto y panel editorial.

## Ejecutar

```bash
npm install
npm run dev
```

Verificaciones disponibles:

```bash
npm run lint
npm run typecheck
npm run build
```

## Rutas principales

- `/`: página de inicio.
- `/especialidades`: catálogo y buscador de especialidades.
- `/medicos`: directorio médico con búsqueda y filtros.
- `/noticias`: avisos operativos y publicaciones.
- `/contacto`: datos de ubicación y solicitud de cita.
- `/admin/acceso`: acceso al panel editorial de demostración.

## Administración de demostración

- Correo: `admin@clinicamunoz.com`
- Contraseña: `Clinica2026`

El panel permite cargar fotografías y editar médicos, crear especialidades y asignarlas a profesionales, administrar datos institucionales, crear/editar/eliminar noticias y gestionar por completo los avisos. Los cambios se guardan en `localStorage` y solo existen en el navegador actual.

Este acceso no es seguridad real. Antes de publicar se debe conectar una API con autenticación en servidor, roles, base de datos, almacenamiento de imágenes, validación, historial de cambios y copias de seguridad. El formulario de citas también es únicamente demostrativo y no envía datos.

## Despliegue

La aplicación usa rutas de navegador y necesita redirigir todas las solicitudes a `index.html`. Se incluyen reglas para Netlify (`public/_redirects`) y Vercel (`vercel.json`). En otro proveedor debe configurarse una regla SPA equivalente.

## Contenido

Los nombres, teléfonos, direcciones, credenciales profesionales e imágenes actuales son datos demostrativos. Deben sustituirse y validarse con la clínica antes del lanzamiento.
