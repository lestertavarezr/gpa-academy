# Rediseño institucional de GPA Academy — rama `claude/gpa-academy-institucional`

Estado: **implementado y probado en local; NO publicado.** Producción (`gh-pages`) sigue en el commit `f017a87`.
Parte de la rama `claude/gpa-academy-premium-redesign` (mejoras de accesibilidad, formulario y SEO del informe anterior, `docs/rediseno-premium.md`).

## 0. Limitación importante: CIFMEC no se pudo inspeccionar

`cifmec.edu.do` no resuelve desde el entorno de esta sesión (dominio fuera de la red permitida). Por eso **no se hizo la comparación visual final con CIFMEC** y la composición se basó en la descripción de la especificación (hero fotográfico amplio con capa de contraste y texto a la izquierda, dos acciones, catálogo en tarjetas visuales, presentación institucional). Si autorizas el dominio en la red de la sesión, puedo hacer esa comparación y ajustar. No se copió ningún código, texto, imagen ni logotipo de CIFMEC.

## 1. Cómo funciona hoy (documentado antes de modificar)

- **Stack**: sitio estático de una sola página (`landing/index.html`): un bundle con plantilla HTML+JS embebida (React 18 de unpkg + runtime propio), sin build ni dependencias; publicado en GitHub Pages (`gh-pages`) con dominio `gpaacademy.online`. No había sistema de rutas.
- **Inscripción**: formulario → `POST` al webhook de n8n (`/webhook/inscripcion-gpa`) → redirección al link de Pagadito del programa/modalidad elegido (`PAGADITO_LINKS`). Excepción: *Asistencia Quirúrgica – semipresencial* se gestiona por WhatsApp (se paga en 2 cuotas, coordinado por GPA).
- **Pagos**: links fijos de Pagadito, uno por programa/modalidad (7 en total). La confirmación llega a n8n por `/webhook/pago-gpa`. Según `PROYECTO.md`, nunca se probó un pago real de punta a punta.
- **LMS**: GPA Academy OS; hoy el acceso lo crea manualmente la dirección tras la confirmación (la Fase 2 automática no está conectada). No hay URL pública de campus.
- **Selección de programa**: botones con `data-programa-base` que preseleccionan el `<select>` del formulario.
- **Simuladores**: 3 demos autohospedadas y funcionales: Guardia de Quirófano (Asistencia Quirúrgica), LAP//NEXUS (Instrumentación Laparoscópica) y ATLAS (Manejo de Heridas).
- **Manuales**: 4 manuales PDF; **los 4 comparten el mismo link de pago** (`…/86f5a3ecc…`), así que el pago no identifica qué manual se compró. No se modificó (§6).

## 2. Arquitectura nueva

| Ruta | Vista | Contenido |
|---|---|---|
| `/` | inicio | Hero, datos clave, oferta en tarjetas + comparación, bonos, experiencia, simuladores, manuales, proceso, FAQ, inscripción, cierre, pie |
| `/programas/taller-de-sutura/` y otras 4 | programa | Banner, descripción, clase de muestra, demo (si existe), temario, resumen de precio sticky, FAQ, inscripción |
| `/institucion/` | institución | Sobre GPA: quiénes somos, metodología, oferta |

- Es el mismo bundle clonado por `landing/build_pages.py` (con título, descripción, canonical, Open Graph y JSON-LD propios por ruta); la vista se elige en el navegador según `location.pathname`. Así se conservan, sin duplicar lógica, el selector de moneda, el formulario, los eventos de analítica y las demos.
- **Enlaces antiguos**: `/#sutura`, `/#diplomado`, `/#neuroimagenes`, `/#laparoscopia`, `/#heridas-ostomias` y `/#demo-<programa>` redirigen (JS, `location.replace`) a la ruta nueva. Las demás anclas (`#faq`, `#manuales`, `#inscripcion`…) siguen en la home. GitHub Pages no permite redirecciones de servidor, por eso es del lado del cliente.
- `sitemap.xml` ahora lista las 7 URLs.

## 3. Qué se hizo por sección y qué se omitió

| Sección | Hecho | Omitido / pendiente |
|---|---|---|
| Cabecera | Blanca, marca a la izquierda; Inicio, Institución, Programas, Experiencia GPA, Contacto + Inscríbete; menú móvil con `aria-expanded`, cierre con Escape y retorno de foco | **Campus virtual**: no existe un destino real |
| Hero | Foto amplia + capa de contraste, texto a la izquierda, eyebrow, titular y copy sugeridos, CTA "Explorar programas" y "Ver una clase" (enlaza la clase de muestra del Taller de Sutura); sin carrusel | La foto es la que ya usaba el sitio (sala de cirugía); falta foto auténtica de formación GPA |
| Datos clave | 5 programas · online/semipresencial · certificado de finalización · demos en 3 programas (todo verificable en el código) | Se eliminaron las cifras "37.000 egresados / 12 países / CMD" y sus contadores animados desde cero |
| Respaldo académico | — | **Sección omitida**: no hay documentación de avales/convenios en el repo. Las frases de aval ya publicadas por GPA (FAQ, ficha de programa, formulario) se conservaron tal cual, sin reforzarlas ni usar logotipos |
| Oferta académica | 5 tarjetas con imagen, modalidad, "Aprenderás a", "Dirigido a", duración, precio por modalidad, **Ver programa** e **Inscribirme**; comparación breve; selector USD/RD$ conservado | Las imágenes actuales de las tarjetas son ilustrativas; conviene fotos propias |
| Experiencia | Cómo se combinan video clases, material, evaluaciones y práctica presencial (solo semipresencial de Asistencia, sin equivalencia con online) + 6 fotos | No se menciona "acompañamiento" (no verificado); falta confirmar autorización de las fotos |
| Tecnología y simulación | 3 demos reales, cada una enlazada a su programa | — |
| Equipo académico | — | **Omitida**: no hay docentes/responsables verificados |
| Comunidad y testimonios | — | **Retirada de la vista pública**: testimonios con nombre/país sin autorización documentada. Los datos siguen en el código (`testimonials`) |
| Proceso de inscripción | 4 pasos que distinguen inscripción, pago confirmado y acceso; requisitos (perfil) y plazo publicado (<24 h) | Plazo real de acceso por programa |
| FAQ | Acordeón accesible (botones, `aria-expanded`) conservado | — |
| Cierre y pie | CTA final (WhatsApp / programas), pie con navegación académica, programas y contacto verificado | **Privacidad, términos y reembolso**: sin textos aprobados, no se crearon enlaces |
| Sobre GPA | Quiénes somos, propósito, ficha de datos, metodología, oferta | Historia, trayectoria con fechas, responsables, avales con alcance |
| Fichas de programa | Descripción, "Aprenderás a", clase de muestra, demo, qué te da, temario, modalidad, duración, precio, perfil, certificación, resumen sticky en escritorio, barra móvil que preselecciona | Objetivos, requisitos formales, docentes |

**Tipografía**: una sola familia (Manrope) para todo; se retiraron Playfair Display y Space Grotesk del paquete (también sus archivos de fuente).
**Color**: azul `#071B36`, cian `#00C2D1`, dorado `#C9A227`, fondo neutro `#F4F6F8`.
**Animaciones**: se eliminaron las tarjetas flotantes, partículas, parallax, Ken Burns y la galería en bucle infinito.

## 4. Archivos modificados / creados

- `landing/index.html` (plantilla, estilos, JS; manifest sin fuentes ni recursos sin uso)
- `landing/build_pages.py` (nuevo) y las rutas generadas: `landing/programas/*/index.html` (5) y `landing/institucion/index.html`
- `landing/sitemap.xml`, `landing/robots.txt`, `landing/README.md`
- `docs/rediseno-institucional.md` (este informe)

## 5. Funcionalidades preservadas (probadas)

Inscripción con validación accesible y anti doble envío; resumen previo al pago; preselección de programa y modalidad (7 combinaciones, desde tarjetas y desde fichas); WhatsApp (FAB, formulario y CTA final); selector de moneda; manuales (mismos links); demos y clases de muestra; analítica (`view_program`, `select_program`, `begin_enrollment`, `enrollment_submitted`, `generate_lead`, `begin_checkout`, `whatsapp_click`, `simulator_interaction`). No se cambiaron importes, condiciones comerciales ni destinos de pago.

## 6. Pruebas

RESULTADOS_PRUEBAS

**No ejecutado**: lint/tipos/build (el repo no tiene toolchain); pagos en sandbox (no hay credenciales sandbox de Pagadito; el webhook de n8n y la pasarela se interceptaron en las pruebas, no se usó ninguna transacción real); reproducción de los videos de YouTube (la red de la sandbox los bloquea; el enlace "Ver una clase" apunta a la clase del Taller de Sutura, que sí se reproducía en los dispositivos del cliente); comparación visual con CIFMEC (sitio inaccesible); pruebas en dispositivos físicos.

## 7. Lo que GPA debe aportar

**Fotografías**: foto de portada auténtica de una formación GPA (horizontal, ≥1600 px); una foto propia por programa para las tarjetas (hoy ilustrativas); confirmación de autorización de las 7 fotos de la galería; fotos de docentes y capturas reales del campus GPA Academy OS.
**Documentos / datos**: carta o convenio de aval del CMD y de la Facultad CTA (alcance y programas a los que aplica; hoy el sitio afirma que aplica a todos); fuente de "37.000 egresados / 12 países"; testimonios reales con autorización y programa cursado; docentes y responsables (nombre, especialidad, función, foto autorizada); historia y fechas verificadas; plazo real de acceso por programa; objetivos y requisitos de cada programa.
**Legal**: textos aprobados (o URLs) de privacidad, términos y reembolso.
**Operación**: URL pública del campus; **4 links de pago distintos para los manuales**; decisión sobre consentimiento de cookies (GA4 y Meta Pixel cargan sin banner).

## 8. Vista previa, despliegue y reversión (sin publicar)

Vista previa local:
```bash
cd landing && python3 -m http.server 8000   # http://localhost:8000/
```
Regenerar rutas tras editar `index.html`: `python3 landing/build_pages.py`.

Despliegue (requiere tu autorización): en `gh-pages` copiar a la raíz `index.html`, `robots.txt`, `sitemap.xml` y las carpetas `programas/` e `institucion/` (demos y `og-image.jpg` no cambian), commit y push.
```bash
git worktree add /tmp/ghp gh-pages
cp landing/index.html landing/robots.txt landing/sitemap.xml /tmp/ghp/
cp -r landing/programas landing/institucion /tmp/ghp/
cd /tmp/ghp && git add -A && git commit -m "Rediseño institucional" && git push origin gh-pages
```
Reversión: `git revert <commit>` en `gh-pages` (o `git reset --hard f017a87` y push forzado con `--force-with-lease`, solo si lo apruebas); eso restaura la web anterior y elimina las rutas nuevas.
