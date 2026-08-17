# Landing page — GPA Academy

`index.html` es tu landing page (el diseño que me pasaste), lista para publicar. Le agregué la parte que faltaba: ahora el formulario de inscripción **sí envía los datos** al webhook de n8n y **sí redirige** al estudiante a pagar.

## Qué le cambié exactamente

En la sección de inscripción:
- Los 4 campos (Nombre, Correo, Teléfono, País) y el selector de programa ahora tienen un identificador interno para que el código los pueda leer.
- Agregué el 5º programa (Manejo de Heridas y Ostomías) al selector — en el diseño original solo estaban 4, pero el resto de la página ya mencionaba 5.
- El botón "Pagar y confirmar inscripción" antes era un link fijo a un solo link de pago de prueba (`pagalink.com/86f5a3...`). Ahora, al hacer clic:
  1. Valida que todos los campos estén llenos y que el correo tenga formato válido.
  2. Envía los datos por `POST` al webhook de n8n (`/webhook/inscripcion-gpa`, el que construimos en `n8n/`).
  3. Redirige al estudiante al link de pago de Pagadito **correspondiente al programa que eligió**.

## Cosa que YA llené, y una que falta

**Ya puse la URL del webhook** apuntando a `http://localhost:5678/webhook/inscripcion-gpa` (el puerto por defecto de n8n).

⚠️ **Importante:** `localhost:5678` solo funciona **mientras pruebas en la misma computadora donde corre n8n** (abres el `index.html` y n8n en esa misma máquina). Una vez publiques la landing page en internet (Netlify, Cloudflare Pages, etc.), los navegadores de tus estudiantes van a intentar conectarse a *su propio* `localhost:5678` — que no existe — y el formulario va a fallar en silencio (seguirá redirigiendo al pago, pero el dato nunca llegará a n8n).

Para producción necesitas exponer tu n8n con una dirección accesible desde internet, por ejemplo:
- Un dominio propio apuntando a tu servidor (`https://n8n.tuacademia.com`), o
- Un servicio como **n8n Cloud**, o
- Un túnel como **Cloudflare Tunnel** o **ngrok** si por ahora lo tienes corriendo en tu propia máquina/red local.

Cuando tengas esa URL pública, dímela y te la cambio, o busca `localhost:5678` en `index.html` y reemplázalo tú mismo.

**Todavía falta llenar `PAGADITO_LINKS`.** Busca esa palabra en `index.html` y reemplaza cada una de las 5 URLs que dicen `TODO-...`:
```js
const PAGADITO_LINKS = {
  'Diplomado Avanzado en Asistencia Quirúrgica': 'https://www.pagalink.com/TODO-asistencia-quirurgica',
  'Taller de Sutura Online': 'https://www.pagalink.com/TODO-sutura',
  'Diplomado Avanzado en Interpretación de Neuroimágenes': 'https://www.pagalink.com/TODO-neuroimagenes',
  'Diplomado Avanzado en Instrumentación Laparoscópica': 'https://www.pagalink.com/TODO-laparoscopia',
  'Diplomado Avanzado en Manejo de Heridas y Ostomías': 'https://www.pagalink.com/TODO-heridas-ostomias'
};
```
por los 5 links de pago reales que generes en tu panel de Pagadito (uno por programa, con el precio correspondiente). Si me los pasas, yo mismo los pongo en el archivo.

**Por seguridad, si un programa todavía dice "TODO" en su link, el botón se bloquea solo** con el mensaje "El pago para este programa aún no está configurado" — así nadie puede pagar a un link roto por accidente. Ya lo probé y funciona así.

## Por qué usé links de pago fijos (Pagalink) y no la API de Pagadito directamente

Existían dos formas de conectar el pago:
1. **Links de pago fijos** (uno por programa, creados a mano en tu panel de Pagadito) — es lo que implementé.
2. **Integración por API** (n8n le pide un link de pago a Pagadito en tiempo real usando tus credenciales `uid`/`wsk`).

Elegí la opción 1 porque es más simple y no necesita que tus credenciales de Pagadito estén guardadas en n8n. Funciona igual de bien con el flujo que ya construimos: cuando el estudiante paga, Pagadito capta su correo en su propia pantalla de pago y lo manda en la notificación — así nuestro webhook `/webhook/pago-gpa` lo puede "casar" con el formulario exactamente igual. Si más adelante prefieres la integración por API (para no tener que crear un link nuevo cada vez que cambien los precios), avísame y lo armamos — pero esa ruta necesita que verifiquemos los nombres exactos de los campos contra el manual oficial de Pagadito primero.

## Cómo probarlo

1. Abre `index.html` directo en tu navegador (doble clic) para ver que el diseño se vea bien.
2. Llena el formulario y dale clic a "Pagar y confirmar inscripción" — si el link de ese programa todavía dice "TODO", verás el mensaje de aviso (correcto, es lo esperado hasta que llenes los links reales).
3. Una vez llenes los 6 datos (paso anterior) y publiques la página, prueba de nuevo: debe mandarte a la pantalla de pago de Pagadito.
4. **Si al probar ves un error de "CORS" en la consola del navegador** (F12 → pestaña Console) y los datos no llegan a n8n: es un ajuste normal de configuración del lado de n8n (permitir que el navegador le hable desde tu dominio). Avísame si te pasa y lo resolvemos juntos.

## Pendiente opcional (no crítico)

La página pesa **~4.3 MB**, casi todo por una sola foto de portada. Carga bien, pero podría ser más rápida — sobre todo en celular. Si quieres, en otro momento la comprimo y la dejo mucho más liviana. No es necesario para publicar, solo para que cargue más rápido.

## Publicar

Los pasos son los mismos que ya vimos: sube `index.html` a Netlify, Cloudflare Pages o GitHub Pages, y conecta tu dominio. Este archivo ya está listo para eso — es 100% autosuficiente (no necesita servidor, ni build, ni instalar nada).
