# GPA Academy — Resumen del proyecto de Inscripción y Pago

> Documento de referencia general. Los detalles paso a paso de cada pieza están en su propio README (linkeados abajo). Este archivo es el "mapa" de todo el sistema.

Última actualización: 17 de agosto de 2026.

---

## 1. Qué es esto

Sistema completo para que un estudiante:
1. Vea la landing page (`gpaacademy.online`).
2. Llene el formulario de inscripción para uno de los 5 programas (7 combinaciones contando online/semipresencial).
3. Sea redirigido a pagar con Pagadito.
4. n8n reciba el formulario + la confirmación de pago, los una, y le avise al director (Lester) para crear el acceso en GPA Academy OS.

---

## 2. Piezas y dónde viven

| Pieza | Dónde | URL / referencia |
|---|---|---|
| Landing page (código fuente) | Repo GitHub, rama `claude/gpa-academy-n8n-workflow-ut8k5f`, carpeta `landing/` | https://github.com/lestertavarezr/gpa-academy |
| Landing page (publicada, en vivo) | Repo GitHub, rama `gh-pages` (GitHub Pages) | https://gpaacademy.online |
| Automatización (workflow) | Repo GitHub, carpeta `n8n/` | `n8n/gpa-academy-inscripcion-pago.workflow.json` |
| n8n (corriendo de verdad) | Servidor VPS propio (Hetzner) | https://n8n.gpaacademy.online |
| Base de datos | Postgres, dentro del mismo servidor (Docker) | ver `deploy/docker-compose.yml` |
| Configuración de despliegue (Docker) | Repo GitHub, carpeta `deploy/` | `deploy/docker-compose.yml`, `deploy/Caddyfile` |
| Dominio | Porkbun | `gpaacademy.online` |
| Servidor (VPS) | Hetzner Cloud, plan CPX12 | IP: `178.105.108.53` |

---

## 3. Webhooks activos

```
Formulario de inscripción:
https://n8n.gpaacademy.online/webhook/inscripcion-gpa

Confirmación de pago (Pagadito):
https://n8n.gpaacademy.online/webhook/pago-gpa
```

---

## 4. Cómo entrar a cada cosa

- **n8n (el panel de automatización):** https://n8n.gpaacademy.online — login con el usuario/contraseña que creaste ahí mismo la primera vez.
- **Servidor (por si hay que hacer mantenimiento):** `ssh root@178.105.108.53` — contraseña la que cambiaste tú mismo la primera vez que entraste.
- **Dominio (DNS):** panel de Porkbun, cuenta `gpacademyrd@gmail.com`.
- **Hosting de la landing page:** GitHub → repo `lestertavarezr/gpa-academy` → Settings → Pages.
- **Servidor VPS (facturación):** panel de Hetzner Cloud.

Las contraseñas reales (Postgres, SMTP, etc.) están guardadas dentro del archivo `.env` en el servidor (`~/gpa-academy/deploy/.env`) y dentro de las credenciales configuradas en n8n — no están escritas en ningún archivo del repositorio por seguridad.

---

## 5. Programas y links de pago (Pagadito)

| Programa | Versión | Precio base | Estado del link |
|---|---|---|---|
| Diplomado Avanzado en Asistencia Quirúrgica | Online | US$35 | ✅ Configurado |
| Diplomado Avanzado en Asistencia Quirúrgica | Semipresencial | RD$14,400 | ✅ Configurado |
| Taller de Sutura Online | — | US$35 | ✅ Configurado |
| Diplomado Avanzado en Interpretación de Neuroimágenes | — | US$35 | ✅ Configurado |
| Diplomado Avanzado en Instrumentación Laparoscópica | — | US$35 | ✅ Configurado |
| Diplomado Avanzado en Manejo de Heridas y Ostomías | Online | US$35 | ✅ Configurado |
| Diplomado Avanzado en Manejo de Heridas y Ostomías | Semipresencial | RD$8,800 | ✅ Configurado |

La página también adapta los precios a la moneda local del visitante (México, Colombia, Brasil, etc.) automáticamente.

---

## 6. Costos mensuales/anuales

| Cosa | Costo | Frecuencia |
|---|---|---|
| Servidor Hetzner (CPX12) | ~$14.09 | Mensual |
| Dominio `gpaacademy.online` | ~$0.98 (sube en renovación) | Anual |
| n8n, Postgres, GitHub Pages, correo | Gratis | — |
| Pagadito | Comisión por transacción (no mensual, consultar tarifa vigente) | Por pago |

**Total fijo mensual: ~$14.09.**

---

## 7. Pendientes conocidos

- [ ] Probar un pago real de principio a fin (nunca se ha confirmado con dinero real que la notificación de Pagadito llega correctamente a n8n).
- [ ] Poner el logo oficial de GPA Academy como ícono (favicon) de la página — pendiente de que el archivo de imagen se suba correctamente.
- [ ] Activar recarga automática de saldo en Hetzner (para que el servidor no se apague por falta de crédito).
- [ ] Comprimir la foto de portada de la landing page (pesa ~4MB, funciona pero podría cargar más rápido).
- [ ] Activar backups del servidor en Hetzner (opcional, recomendado).
- [ ] Revisar el precio de renovación del dominio antes de agosto 2027.
- [ ] Conectar la Fase 2: creación automática del acceso en GPA Academy OS vía API (el nodo ya está armado en n8n, solo desactivado).

---

## 8. Documentación detallada (paso a paso)

- **n8n/README.md** — qué hace cada nodo del workflow, cómo mantenerlo.
- **n8n/schema.sql** — las tablas de la base de datos.
- **landing/README.md** — cómo editar la landing page, configuración de links de pago.
- **deploy/README.md** — cómo se montó el servidor (Hetzner + Docker), paso a paso completo.

---

## 9. Historial resumido de decisiones importantes

- Se usó **Postgres + n8n autoalojado en un VPS propio** (no n8n en la PC local) porque necesitaba estar disponible 24/7 desde internet para estudiantes de cualquier país.
- Se usaron **links de pago fijos de Pagadito** (uno por programa/versión) en vez de integrar la API de Pagadito directamente, para no tener que guardar credenciales sensibles (`uid`/`wsk`) en n8n y simplificar el mantenimiento.
- La landing page se publicó en **GitHub Pages** (gratis, sin necesitar cuenta nueva en Netlify) usando una rama dedicada (`gh-pages`).
- Los programas con 2 versiones (Asistencia Quirúrgica, Manejo de Heridas) tienen **un botón de pago independiente por versión**, para no cobrar mal por confundir online con semipresencial.
