# Flujo n8n: Inscripción + Pago + Notificación — GPA Academy

Este flujo automatiza lo que pasa entre que un estudiante llena el formulario de la landing page y el momento en que el director (Lester) recibe el aviso de que debe crearle el acceso en GPA Academy OS.

Archivos de esta carpeta:

- `gpa-academy-inscripcion-pago.workflow.json` → el workflow para importar en n8n.
- `schema.sql` → las dos tablas que el workflow necesita en Postgres.
- Este `README.md` → instrucciones y explicación de cada nodo.

---

## 1. Cómo instalarlo

### Paso 1 — Crear las tablas en tu base de datos
Ejecuta el contenido de `schema.sql` en tu Postgres (puede ser el mismo Postgres donde vive n8n, o uno aparte). Si no tienes Postgres, revisa la sección "Alternativas sin Postgres" más abajo.

### Paso 2 — Importar el workflow
En n8n: **Workflows → Import from File** → selecciona `gpa-academy-inscripcion-pago.workflow.json`.

### Paso 3 — Configurar credenciales
El JSON no puede traer contraseñas ni tokens (por seguridad), así que tienes que conectarlos tú mismo, una sola vez:

- Abre cualquiera de los nodos color celeste llamados **"Log ..."**, **"Guardar Inscripcion"** o **"Buscar Inscripcion"** (son nodos Postgres) → en el campo de credenciales, crea o selecciona tu credencial de Postgres. Como todos comparten el mismo nombre de credencial (`Postgres GPA Academy`), configurar uno debería auto-completar los demás si usas la misma credencial.
- Abre el nodo **"Enviar Correo al Director"** (nodo de correo SMTP) → configura tu credencial SMTP (puede ser un correo de Gmail con "contraseña de aplicación", o cualquier otro proveedor SMTP).
- Si vas a usar WhatsApp en vez de correo, abre **"Enviar WhatsApp (Bot Luz)"** y reemplaza la URL de ejemplo por la URL real de tu integración con el bot Luz (o cambia el nodo entero por el nodo de WhatsApp/Twilio que ya tengas activo en tu instancia).

### Paso 4 — Activar el workflow
Arriba a la derecha, cambia el switch de "Inactive" a **Active**. Desde ese momento las dos URLs de webhook quedan escuchando.

### Paso 5 — Editar los datos del director
Abre el nodo **"Preparar Mensaje Notificacion"** y cambia:
- `director_email` → el correo real donde quieres recibir el aviso (por defecto puse `gpacademyrd@gmail.com`, ajústalo si es otro).
- `director_telefono` → el número de WhatsApp real del director (solo se usa si activas el canal WhatsApp).
- `canal_notificacion` → déjalo en `"email"` para usar correo, o cámbialo a `"whatsapp"` para usar el bot Luz.

---

## 2. URLs de los webhooks

Una vez que actives el workflow, las URLs finales son:

```
Formulario de inscripción:
https://TU-DOMINIO-N8N/webhook/inscripcion-gpa

Confirmación de pago (Pagadito):
https://TU-DOMINIO-N8N/webhook/pago-gpa
```

Reemplaza `TU-DOMINIO-N8N` por el dominio real de tu instancia de n8n (lo ves en la barra de direcciones cuando estás dentro de n8n). Mientras el workflow esté **inactivo**, n8n solo te deja probar con la URL de prueba (botón "Listen for test event" en cada nodo Webhook, que da una URL con `/webhook-test/` en vez de `/webhook/`) — usa esa para probar antes de poner el workflow en producción.

- La URL de `/webhook/inscripcion-gpa` va en el `fetch`/`POST` de los 4 formularios de la landing page (Diplomado en Asistencia Quirúrgica, Taller de Sutura, Neuroimágenes, Instrumentación Laparoscópica). Los 4 pueden apuntar al mismo webhook, ya que todos mandan los mismos campos (`nombre, cedula, pais, telefono, email, programa`), solo cambia el valor de `programa`.
- La URL de `/webhook/pago-gpa` es la que configuras en el panel de Pagadito como "URL de notificación" (IPN / notify URL).

**Importante sobre Pagadito:** para que este flujo pueda "casar" el pago con el formulario, Pagadito tiene que devolver en su notificación algún dato que identifique al estudiante (su email, de preferencia). Esto normalmente se logra pasando el email del estudiante como parámetro extra/personalizado al momento de generar el link o botón de pago en la landing page, para que Pagadito lo reenvíe en el webhook. Si tu integración actual con Pagadito no hace esto todavía, es un ajuste que hay que hacer en el código de la landing page (fuera de n8n).

---

## 3. Qué hace cada nodo (explicado sencillo)

### Parte 1 — Formulario
| Nodo | Qué hace |
|---|---|
| **Webhook - Inscripcion** | La puerta de entrada. Recibe el POST del formulario de la landing page. |
| **Normalizar Inscripcion** | Ordena los datos que llegaron (nombre, cédula, país, teléfono, email, programa) en un formato limpio, y le pone `estado = pendiente_pago`. |
| **Responder Formulario** | Le contesta al navegador del estudiante `{"status": "recibido"}` para que la landing page sepa que todo salió bien. |
| **Guardar Inscripcion** | Guarda (o actualiza, si ya existía por el mismo email) el registro en la tabla `gpa_inscripciones`. |
| **Log OK - Formulario Recibido** | Anota en la tabla `gpa_log` que este formulario se recibió y guardó bien. |
| **Log Error - Formulario** | Si guardar falló por algún motivo (ej. base de datos caída), lo anota igual en el log para que no se pierda el rastro. |

### Parte 2 — Pago (Pagadito)
| Nodo | Qué hace |
|---|---|
| **Webhook - Pago Pagadito** | Recibe la notificación de pago que manda Pagadito. |
| **Normalizar Pago** | Ordena los datos del pago (monto, estado, referencia, email) y calcula si el pago está confirmado o no. |
| **Responder Pago** | Le contesta a Pagadito `{"status": "recibido"}` de inmediato, para que no reintente el envío. |
| **Verificar con Pagadito (opcional, recomendado)** | *Desactivado por defecto.* Si algún día quieres verificar el pago directamente contra la API de Pagadito (más seguro que confiar solo en el webhook), este nodo ya está armado, solo falta poner tus credenciales `uid`/`wsk` y activarlo. |
| **IF - Pago Confirmado** | Pregunta: ¿el estado del pago es "confirmado" (o equivalente)? Si NO, el flujo se detiene ahí (solo se registra en el log, sin avisar a nadie). |
| **Log - Pago No Confirmado** | Registra en el log que llegó un pago que no está confirmado. |
| **Buscar Inscripcion** | Si el pago SÍ está confirmado, busca en `gpa_inscripciones` el registro que coincida por email o teléfono. |
| **IF - Registro Encontrado** | Pregunta: ¿se encontró el formulario correspondiente? |
| **Combinar Datos Estudiante + Pago** *(si se encontró)* | Junta los datos del estudiante (nombre, cédula, país, programa) con los del pago (monto, referencia). |
| **Log - Pago Emparejado** | Registra en el log que el pago se pudo emparejar con éxito. |
| **Marcar Pago Huerfano** *(si NO se encontró)* | Arma el mensaje de alerta "⚠️ Pago recibido sin formulario asociado, verificar manualmente" con los datos del pago que sí se tienen. |
| **Log - Pago Huerfano** | Registra en el log este caso especial para poder revisarlo después. |

### Parte 3 — Notificación al director
| Nodo | Qué hace |
|---|---|
| **Preparar Mensaje Notificacion** | Arma el texto final del mensaje (con el formato que pediste) y decide el canal (`email` o `whatsapp`) según la configuración. |
| **IF - Canal WhatsApp** | Revisa qué canal está configurado y dirige el mensaje al nodo correcto. |
| **Enviar WhatsApp (Bot Luz)** | Envía el mensaje por WhatsApp usando el bot Luz (hay que apuntarlo a la URL real). |
| **Enviar Correo al Director** | Alternativa: envía el mismo mensaje por correo (SMTP), es la opción activa por defecto. |
| **Log - Notificacion Enviada** | Registra en el log que la notificación salió bien. |
| **Log - Notificacion Fallida** | Si el envío falla (WhatsApp caído, SMTP con error, etc.), lo registra igual para que no se pierda el aviso. |

### Fase 2 (preparado, no activo)
| Nodo | Qué hace |
|---|---|
| **Crear Acceso GPA Academy OS (Fase 2)** | *Desactivado a propósito.* Ya está conectado justo después de "Log - Notificacion Enviada" y ya arma el JSON con los datos del estudiante. Cuando tengas el endpoint `POST /api/enrollments` en GPA Academy OS, solo hay que poner la URL real, agregar autenticación si aplica, y activarlo (quitarle el "disabled"). Así, en el futuro, la creación del acceso deja de ser manual. |

Las notas amarillas/de color dentro del propio workflow (nodos "Nota - ...") repiten estas explicaciones directamente sobre el lienzo de n8n, para que las veas sin salir de la herramienta.

---

## 4. Notas de mantenimiento

- **Duplicados:** si un estudiante llena el formulario dos veces con el mismo email, `Guardar Inscripcion` actualiza el registro existente en vez de crear uno nuevo (gracias al `ON CONFLICT` sobre `email`).
- **Auditoría:** todo lo que pasa por el flujo — exitoso o fallido — queda en la tabla `gpa_log`. Si algún día "se pierde" una inscripción, ahí está el rastro completo con fecha y detalle en JSON.
- **Cambiar de correo a WhatsApp (o viceversa):** solo edita el campo `canal_notificacion` en el nodo "Preparar Mensaje Notificacion".
- **Cambiar el número/correo del director:** edítalo en ese mismo nodo, campos `director_telefono` y `director_email`.

### Alternativas sin Postgres
Si no tienes Postgres conectado a tu n8n, tienes dos caminos:
1. **SQLite:** reemplaza los nodos Postgres por nodos "SQLite" (mismas consultas SQL de `schema.sql`, con mínimos ajustes de sintaxis).
2. **Data Table de n8n** (si tu versión de n8n la incluye, es una tabla simple sin necesidad de base de datos externa): reemplaza cada nodo Postgres por un nodo "Data table" con las mismas columnas descritas en `schema.sql`. La lógica del resto del flujo (los IF, los Set) no cambia.

En ambos casos, el resto del workflow (webhooks, IFs, notificación) queda igual — solo se sustituyen los nodos de almacenamiento.
