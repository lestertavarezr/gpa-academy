# Rediseño premium de la landing — informe de la rama `claude/gpa-academy-premium-redesign`

Estado: **implementado en rama aislada, NO desplegado**. Producción (`gh-pages`) sigue intacta.

## 1. Diagnóstico (con evidencia)

| # | Hallazgo | Evidencia | Prioridad | Estado |
|---|---|---|---|---|
| 1 | Los 4 manuales digitales comparten el mismo link de pago (`pagalink.com/86f5a3ecc…`): el pago no identifica qué manual se compró | `landing/index.html`, sección `#manuales` (4 tarjetas, 1 solo href) | **P0 – requiere tu decisión** | Sin cambios (ver §4) |
| 2 | El aval "CMD + Facultad CTA de Brasil" se afirma para todos los programas (hero, formulario, FAQ). Testimonios con nombre/país y cifras (37.000 egresados, 12 países) sin documentación en el repo | Hero, `AVAL_LINE`, FAQ, `#testimonios` | **P0 – requiere documentación** | Sin cambios: no se reforzó nada visualmente |
| 3 | No existe política de privacidad, términos ni condiciones de reembolso; el formulario recolecta nombre, correo, teléfono y país | Footer y formulario sin enlaces legales | **P0 – requiere textos** | Sin cambios (no se inventan textos legales) |
| 4 | "Confirmación y acceso en menos de 24 h": la creación del acceso en GPA Academy OS es manual (Fase 2 sin conectar) y `PROYECTO.md` indica que nunca se probó un pago real de punta a punta | `PROYECTO.md` §7 | P1 | Documentado; no se modificó el flujo |
| 5 | El sitio se renderiza 100 % con JS y el runtime reemplazaba el `<head>`: sin `lang`, sin canonical, sin datos estructurados, sin robots/sitemap | Playwright: `lang=""`, sin `<main>` | P1 | **Corregido** |
| 6 | FAQ con `div` clicable: no accesible por teclado ni lector de pantalla | `#faq` | P1 | **Corregido** |
| 7 | Contraste insuficiente: eyebrows turquesa 2.6–2.9:1, badge blanco sobre dorado 2.4:1, grises 3.1–3.8:1 | Escaneo de contraste a 375 y 1440 px | P1 | **Corregido** (≥ 4.5:1) |
| 8 | Hero móvil: titular genérico y párrafo de 4 líneas sobre foto | Captura 375 px | P2 | **Corregido** |
| 9 | Formulario: sin resumen antes del pago, errores genéricos, doble envío posible con Enter, textos sin tildes ("correo electronico", "aun no esta") | Código `setupInscripcionForm` | P1 | **Corregido** |
| 10 | Sin entrada pública clara a los simuladores (estaban dentro de cada ficha) ni al campus | Navegación | P2 | Simuladores: **corregido**. Campus: falta URL (§4) |
| 11 | GA4 y Meta Pixel se cargan sin banner de consentimiento | `gpaInitAnalytics()` | P1 | Sin cambios (§4) |
| 12 | Si el webhook de n8n falla, el usuario sigue al pago y el lead se pierde en silencio (decisión de diseño previa) | `setupInscripcionForm` | P2 | Sin cambios |

## 2. Cambios implementados

**Accesibilidad / estructura**: `lang="es"`, enlace "Saltar al contenido", `<main>`, `<nav aria-label>`, foco visible de doble anillo (visible sobre fondo claro y oscuro), `prefers-reduced-motion` también para el parallax del hero y el contador de cifras, FAQ con `<button aria-expanded>` y región, menú móvil con `aria-expanded/aria-controls`, menú hamburguesa desde 1000 px (7 enlaces ya no caben en una fila).

**Hero**: titular "Formación continua en cirugía y procedimientos médicos", párrafo corto en móvil, CTA secundario "Probar un simulador". No se añadieron afirmaciones nuevas.

**Navegación y simuladores**: enlaces a *Simuladores* y *Contacto*; nueva sección `#simuladores` con las 3 demos existentes (Guardia de Quirófano, LAP//NEXUS, ATLAS). Cada tarjeta abre la ficha del programa y salta a la demo (`#demo-<programa>`).

**Inscripción**: resumen (programa, modalidad, precio en la moneda del visitante, duración, acceso, siguiente paso) leído de la ficha del programa; validación por campo con `aria-invalid`/`aria-describedby` y foco en el primer error; anti doble envío (incluye Enter y regreso del navegador/bfcache); textos con tildes. La preselección de programa/modalidad desde los CTA se conserva (probada con Sutura, Heridas semipresencial y Asistencia semipresencial → WhatsApp).

**Analítica** (sin datos personales): `view_program`, `begin_enrollment`, `enrollment_submitted` (solo GA4, para no duplicar el `Lead` de Meta), `whatsapp_click`, `simulator_interaction` (primer foco dentro de cada demo), además de los ya existentes (`select_program`, `generate_lead`, `begin_checkout`, `contacto_whatsapp`).

**SEO**: canonical, `robots`, `theme-color`, JSON-LD (`EducationalOrganization` + `ItemList` de `Course`, solo con datos visibles; sin precios para no desincronizar con las promociones), fallback `<noscript>` con programas y contacto, `robots.txt` y `sitemap.xml` (en `landing/`). Hallazgo: el runtime reemplaza el `<head>`, por eso las etiquetas están en el HTML crudo **y** en la plantilla.

**Color**: azul primario `#0B1E3D` → `#071B36` (paleta indicada).

## 3. Pruebas

Ejecutadas con Playwright/Chromium contra servidor local (sandbox, sin throttling):
- 320, 375, 768 y 1440 px: sin desbordamiento horizontal y sin errores de JS.
- FAQ: Enter y Espacio alternan `aria-expanded`.
- Formulario: envío vacío (5 errores + foco), correo inválido, envío válido (1 sola llamada al webhook aun pulsando dos veces), resumen para 3 programas.
- Enlaces antiguos: `#diplomado`, `#heridas-ostomias`, `#faq` y los nuevos `#demo-*` en carga inicial.
- Contraste: sin fallos reales (el menú sticky sale como falso positivo: va sobre fondo oscuro translúcido).
- Rendimiento local (referencia, no concluyente): LCP 388 → 444 ms (375 px) y 752 → 788 ms (1440 px); CLS ≤ 0.04. El HTML pasó de ~1.03 MB a ~1.05 MB. **No se afirma mejora de rendimiento**: sigue pendiente comprimir la foto de portada (~4 MB, `PROYECTO.md`).

**No se pudo probar**: pagos sandbox (Pagadito y n8n se simularon con interceptores; no hay credenciales sandbox), entrega del producto correcto (depende de n8n/LMS), videos de YouTube y demos de terceros (red de la sandbox los bloquea), dispositivos físicos, lint/tipos/build (el repo no tiene toolchain: es HTML estático).

## 4. Pendiente — necesito información o autorización

1. **Manuales**: un link de pago distinto por manual (o campo de producto en Pagadito).
2. **Avales/testimonios/cifras**: documentos que respalden el aval por programa, y confirmar que los testimonios son reales y autorizados.
3. **Legales**: URLs o textos de privacidad, términos y reembolso para enlazarlos junto al formulario y en el footer.
4. **Campus**: URL pública de GPA Academy OS para añadir "Campus" en la navegación.
5. **Plazo de acceso real** por programa (hoy solo "período habilitado en GPA Academy OS").
6. **Consentimiento de cookies** para GA4/Meta Pixel (según los países objetivo).
7. **`purchase`**: debe enviarse desde el servidor (n8n `/webhook/pago-gpa` → GA4 Measurement Protocol, con API secret, deduplicando por id de transacción); no se implementó.
8. **Rutas por programa**: el sitio es una sola página estática sin router; hoy hay anclas estables (`#sutura`, `#diplomado`, …). Páginas independientes requieren extraer las imágenes embebidas en base64 (cada página pesaría ~1 MB) — decidir si se quiere.

## 5. Despliegue y reversión (no ejecutado)

Despliegue (requiere tu aprobación): copiar a la raíz de `gh-pages` los archivos `landing/index.html`, `landing/robots.txt` y `landing/sitemap.xml` (los demos y `og-image.jpg` no cambian), commit y push de `gh-pages`.

Reversión: `git revert` del commit en `gh-pages` o volver a copiar `index.html` del commit `f017a87` (último publicado). La rama de trabajo anterior es `claude/gpa-academy-n8n-workflow-ut8k5f`.
