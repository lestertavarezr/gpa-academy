# Rediseño estructural con referencia CIFMEC — rama `claude/gpa-academy-cifmec-estructura`

Estado: **implementado y probado en local; NO publicado.** Producción (`gh-pages`) sigue en el commit `f017a87`.
Contenido pendiente de aportar: ver `CONTENT_NEEDED.md` (raíz del repo).

## 0. Cómo se usó la referencia

Esta sesión no puede abrir `cifmec.edu.do` (dominio fuera de la red permitida). Se implementó con el plano de composición, componentes y comportamiento de la especificación, como ella misma autoriza. **No se hizo comparación visual lado a lado con CIFMEC**; los parecidos buscados son de estructura (encabezado fijo transparente → blanco, hero a pantalla completa con capa azul y texto a la izquierda, tarjetas fotográficas con categoría y título superpuestos, bloques editoriales en dos columnas, vista rápida en diálogo grande 42/58, menú móvil a pantalla completa, pie en azul institucional). No se copió código, texto, imagen ni logotipo de CIFMEC y no se atribuyó a GPA ninguna acreditación, sede, docente o cifra de CIFMEC.

## 1. Repositorio y arquitectura

El código que sirve `gpaacademy.online` es este repositorio (`landing/`, publicado en la rama `gh-pages`): un sitio estático cuyo `index.html` es un bundle con plantilla + JS embebidos. Se conservó esa arquitectura y se añadieron rutas reales generadas por `landing/build_pages.py` (mismo bundle, título/canonical/OG/JSON-LD propios; la vista se elige por `location.pathname`).

| Ruta | Vista |
|---|---|
| `/` | Portada institucional |
| `/programas/` | Catálogo (búsqueda, filtro de modalidad, vista rápida, comparación, simuladores, manuales) |
| `/programas/<slug>/` (×5) | Ficha de programa (URL estable e indexable) |
| `/institucion/` | Institución |
| `/admision/` | Admisión (proceso, perfiles, modalidades, precios, formulario, FAQ, bonos) |
| `/contacto/` | Contacto |

Enlaces antiguos (`/#sutura`, `/#demo-*`, `/#manuales`, `/#simuladores`, `/#proceso`) redirigen a su ruta nueva; el resto de anclas (`#faq`, `#inscripcion`, `#experiencia`) siguen en la portada. `sitemap.xml` lista las 9 URLs.

## 2. Qué se implementó frente al plano

| Plano | Resultado |
|---|---|
| Sistema visual | Poppins incrustada (400–700, licencia OFL; Manrope retirada); paleta GPA (`#071B36`, `#00C2D1`, `#C9A227`, superficies `#F4F6F8`/`#F8FAFC`, texto `#475569`, borde `#E2E8F0`); contenedor 1200 px con padding fluido; radios 16/24 px; botones 48 px/10 px |
| Encabezado | Fijo, transparente con logo blanco sobre el hero (padding 24 px), blanco al 95 % con padding 14 px al desplazarse; Inicio, Institución, Programas, Experiencia GPA, Admisión, Contacto + Inscríbete. **Campus virtual omitido** (sin URL real) |
| Menú móvil | Overlay a pantalla completa azul, logo arriba-izquierda, cierre arriba-derecha, enlaces en mayúsculas centrados; bloquea el scroll, cierra con botón, Escape o al elegir enlace, atrapa el foco y lo devuelve al botón; un solo control de cierre visible |
| 1 Hero | ≥ 1 pantalla, foto a fondo completo, capas azul + degradado, contenido a la izquierda: 2 insignias, titular (56/36 px), párrafo ≤ 540 px, 2 botones, separador, 4 indicadores verificables (sin contadores) |
| 2 Respaldo académico | **Omitida** (sin documentación) |
| 3 Programas destacados | 5 tarjetas fotográficas (300 px, radio 16): píldora de categoría, título blanco sobre degradado, zona con modalidad/duración/precio y enlace «Ver programa →»; zoom leve en hover/foco; botón al catálogo |
| 4 Espacios de aprendizaje | 3 tarjetas: campus online, recursos académicos, semipresencial (sin sedes inventadas) |
| 5 Experiencia académica | Panel de texto + imagen grande con tarjeta superpuesta (demo LAP//NEXUS), botón a simuladores |
| 6 Práctica clínica, 7 Comunidad, 8 Testimonios, 9 Galería social, 10 Noticias | **Omitidas** (sin contenido verificado) |
| 11 Admisión y FAQ | 3 pasos, CTA a `/admision/`, FAQ accesible, formulario existente y CTA final |
| Pie | Azul `#071B36`, 3 columnas (marca / programas e institución / contacto y ubicación), copyright; WhatsApp 52 px (48 px en móvil) sin tapar la barra móvil. **Enlaces legales omitidos** (sin textos aprobados) |
| Catálogo | Búsqueda sin tildes, filtro de modalidad, contador, «Limpiar filtros», estado sin resultados, tarjetas con imagen, categoría, modalidad y duración, nombre, descripción, precio (por modalidad), Ver programa, Inscribirme y Vista rápida; consulta por WhatsApp. Sin filtro de recinto |
| Vista rápida | Diálogo (`role="dialog"`, `aria-modal`, título asociado): foto 42 % con degradado, categoría y resumen; panel derecho con 4 datos, público, descripción y contenidos; barra inferior con «Ver ficha completa» e «Inscribirme» por modalidad; compartir (Web Share o copiar enlace); Escape, trampa de foco, restauración de foco; en móvil, foto horizontal y safe-area. Sin docente (sin datos) |
| Ficha | Ruta propia con banner, clase de muestra, demo, temario, precio sticky y preselección de modalidad |
| Institución | Intro + tarjetas seleccionables que cambian la foto, modelo educativo, oferta. Misión/visión, historia, director, equipo, respaldos y hospitales **omitidos** |
| Admisión | Hero breve, cómo inscribirte, requisitos (perfil) por programa, modalidades, precios con selector de moneda, qué sucede tras el pago, formulario existente, FAQ, bonos |
| Contacto | Canales reales (WhatsApp, correo, Instagram), ubicación «Santo Domingo, RD», formulario que **arma el mensaje y abre WhatsApp o el correo** (no finge enviarlo ni muestra éxito) |
| Páginas corporativa, fundación, acreditación, alumni | **No creadas** (sin información) |

## 3. Funciones preservadas

Cinco programas y 7 modalidades; precios y selector USD/RD$ (sin cambios de importes); comparación de duración/modalidad; preselección de programa desde tarjetas, catálogo, fichas, vista rápida y barra móvil; formulario de inscripción (validación accesible, anti doble envío, resumen); links de Pagadito y webhook de n8n sin cambios; WhatsApp oficial; manuales (mismos links; ver `CONTENT_NEEDED.md` §5); clases de muestra; simuladores (3); analítica (`view_program`, `select_program`, `begin_enrollment`, `enrollment_submitted`, `generate_lead`, `begin_checkout`, `whatsapp_click`, `simulator_interaction`, `contacto_whatsapp`).
No se cambiaron precios, condiciones comerciales, permisos ni credenciales; no se ejecutaron pagos reales.

## 4. Archivos

`landing/index.html`, `landing/build_pages.py`, rutas generadas (`landing/programas/`, `landing/institucion/`, `landing/admision/`, `landing/contacto/`), `landing/img/demo-lap-nexus.jpg`, `landing/sitemap.xml`, `landing/README.md`, `CONTENT_NEEDED.md`, `docs/rediseno-cifmec.md`, `docs/capturas-cifmec/`.

## 5. Validación

Playwright/Chromium contra servidor local, sin transacciones reales (webhook de n8n y Pagadito interceptados; no se envió ningún mensaje real).

**Pasaron**
- **9 rutas × 5 anchos (320, 390, 768, 1024, 1440 px)**: sin errores de JS, sin desbordamiento horizontal, un solo `h1` visible, `lang="es"`, canonical propio, Poppins cargada y encabezado transparente al inicio. (La primera corrida detectó 59 px de desborde en `/contacto/` a 320 px por un grid con estilo en línea; corregido y verificado.)
- **Encabezado**: blanco al 95 % con padding de 14 px tras desplazarse.
- **Menú móvil**: overlay a pantalla completa, scroll bloqueado, `aria-expanded`, un único control de cierre visible, foco inicial en el cierre, Escape cierra y devuelve el foco, el enlace «Admisión» navega a `/admision/`.
- **Enlaces antiguos**: `#sutura`, `#diplomado`, `#neuroimagenes`, `#laparoscopia`, `#heridas-ostomias`, `#demo-laparoscopia`, `#manuales`, `#simuladores` y `#proceso` redirigen a su ruta nueva; `#faq`, `#inscripcion` y `#experiencia` permanecen en la portada.
- **Catálogo**: 5 programas; búsqueda sin tildes; filtro «100 % online» (3) y «con semipresencial» (2); estado sin resultados y «Restablecer filtros»; el filtro se conserva al cambiar de moneda.
- **Vista rápida**: `role="dialog"`, `aria-modal`, título asociado, trampa de foco (Tab y Shift+Tab), Escape cierra y libera el scroll, foco restaurado al botón, «Inscribirme · Semipresencial» preselecciona la modalidad y cierra el diálogo.
- **Programa y modalidad**: las 7 combinaciones se preseleccionan desde las fichas (con resumen y precio) y desde los 7 botones del catálogo.
- **Formularios**: inscripción (5 errores accesibles y foco al primero) y contacto (3 errores, no abre WhatsApp si es inválido; válido abre `wa.me/18493875222` con el texto armado, verificado interceptando `window.open`, y no muestra mensaje de éxito).
- **Fichas**: cada una tiene su clase de muestra; las demos aparecen solo en Asistencia Quirúrgica, Instrumentación Laparoscópica y Manejo de Heridas.
- **WhatsApp flotante** (48 px en móvil) no cubre la barra «Inscribirme ahora».
- **Contraste**: escaneo automático de texto en las 6 páginas × escritorio/móvil sin textos bajo 4,5:1 (3:1 en texto grande). Las zonas con texto sobre fotografía (hero, tarjetas, vista rápida) se revisaron visualmente porque la herramienta no calcula contraste sobre imágenes.

**Nota sobre la última corrida**: la suite completa terminó con una sola falla, atribuible al entorno: la aserción de la URL de la ventana de WhatsApp no puede leerse porque la sandbox no alcanza `wa.me` (la ventana sí se abrió una vez); esa comprobación se repitió aparte interceptando `window.open` y pasó.

**No ejecutado / limitaciones**: lint, tipos y build (el repo no tiene toolchain); comparación visual con CIFMEC (sitio inaccesible); pagos en sandbox (no hay credenciales; Pagadito y n8n se interceptaron, sin transacciones); reproducción de videos de YouTube y de las demos de terceros dentro de la sandbox; dispositivos físicos; rendimiento en red real (no se afirma mejora). Las imágenes de programa (380 px) se ven pixeladas en la vista rápida y en tarjetas grandes: hacen falta fotos propias de mayor resolución.

## 6. Vista previa, despliegue y reversión (sin publicar)

Vista previa local: `cd landing && python3 -m http.server 8000` → http://localhost:8000/ (tras editar `index.html`: `python3 landing/build_pages.py`). Capturas de escritorio y móvil en `docs/capturas-cifmec/`.

Despliegue (requiere autorización explícita): en `gh-pages` copiar a la raíz `index.html`, `robots.txt`, `sitemap.xml`, las carpetas `programas/`, `institucion/`, `admision/`, `contacto/` e `img/` (los demos y `og-image.jpg` no cambian), commit y push.
```bash
git worktree add /tmp/ghp gh-pages
cp landing/index.html landing/robots.txt landing/sitemap.xml /tmp/ghp/
cp -r landing/programas landing/institucion landing/admision landing/contacto landing/img /tmp/ghp/
cd /tmp/ghp && git add -A && git commit -m "Rediseño estructural" && git push origin gh-pages
```
Reversión: `git revert <commit>` en `gh-pages` (o volver al commit `f017a87` con push forzado `--force-with-lease`, solo con tu aprobación). Elimina las rutas nuevas y restaura la web actual.
