# CONTENT_NEEDED — contenido que GPA Academy debe aportar

Secciones y datos que **no se publican** porque no hay información verificada en el repositorio. Cuando se entregue cada elemento, se activa la sección correspondiente (la estructura ya está definida en `docs/rediseno-cifmec.md`).

## 1. Inicio

| Sección del plano | Estado | Qué hace falta |
|---|---|---|
| Hero (fotografía) | Se usa la foto de sala de cirugía que ya tenía el sitio | Fotografía **auténtica** de una formación GPA (estudiantes, docentes o práctica real), horizontal, ≥ 1920 px, con autorización de uso |
| Hero (indicadores) | Solo datos verificables del catálogo: 5 programas, clases de muestra, 3 simuladores, certificado de finalización | Si se desean cifras de impacto (p. ej. egresados, países): **fuente documentada** y fecha. El sitio mostraba «37.000+ egresados» y «12+ países» sin respaldo y se retiraron |
| Respaldo académico (logos + indicadores) | **Omitida** | Carta/convenio de cada aval (CMD, Facultad CTA de Brasil u otros) con **alcance y programas a los que aplica**; logotipos con autorización; 3 indicadores documentados. Hoy el sitio afirma en FAQ, fichas y formulario que *todos* los programas están avalados: confirmar si es exacto |
| Espacios de aprendizaje | Se muestran 3 espacios reales (campus online, recursos, semipresencial) con ilustraciones de los programas | Fotografías propias de cada espacio; si existen sedes o aulas físicas, nombre, dirección y foto |
| Práctica clínica | **Omitida** | Convenios con hospitales/centros (documento, nombre, logo autorizado) o descripción verificable de las prácticas propias (las 8 prácticas del semipresencial de Asistencia Quirúrgica: dónde, con quién, cupo) |
| Comunidad | **Omitida** | Descripción real de comunidad, seguimiento o acompañamiento (qué ofrece, cómo) y fotografías autorizadas. No se copian becas, membresías ni bolsa de empleo |
| Testimonios | **Retirados de la vista pública** (los datos siguen en el código, `testimonials`) | Testimonios reales con **autorización escrita**, nombre, programa cursado, país y retrato (80–96 px). Confirmar si los tres actuales son reales |
| Galería social | **Omitida** | 3 publicaciones verificadas de Instagram (imagen + enlace a la publicación) |
| Noticias | **Omitida** | Hasta 3 noticias reales: titular, categoría, fecha y fotografía 16:9 |

## 2. Institución (`/institucion/`)

Publicado: quiénes somos, propósito, modelos de estudio y metodología (todo trazable al sitio actual).
Falta para activar el resto del plano: **misión, visión y valores**; **historia** con años verificados (y foto por hito); **director/responsables** (nombre, cargo, foto autorizada, mensaje, enlaces profesionales); **equipo de gestión**; **entidades de respaldo** con su alcance; **modelo educativo** ampliado si existe documento; **identidad visual** (logotipo oficial en SVG/PNG y manual, si se quiere la segunda pestaña). El logotipo actual es un monograma provisional «G».

## 3. Programas (catálogo y fichas)

- **Fotografías propias por programa** (≥ 1200 px): las 5 imágenes actuales miden 380 px y son ilustrativas; en la vista rápida y en las tarjetas grandes se ven pixeladas.
- **Objetivos de aprendizaje**, **requisitos formales de ingreso** y **carga horaria/horario** por programa (hoy solo hay «Aprenderás a…» y «Dirigido a»).
- **Docentes** por programa: nombre, especialidad, fotografía autorizada y biografía breve. La ficha de vista rápida reserva el espacio y lo omite mientras no existan.
- **Alcance de la certificación** por programa (quién emite el certificado, valor académico) y **plazo real de acceso** (hoy: «período habilitado en GPA Academy OS»).
- **Condiciones de pago** vigentes (cuotas): el FAQ actual dice que solo *Asistencia Quirúrgica – semipresencial* se paga en 2 cuotas; confirmar que sigue vigente.

## 4. Admisión y contacto

- **Requisitos documentales** (si existen) y plazo real de confirmación («menos de 24 horas» es la promesa publicada; la creación del acceso es manual hoy).
- **Dirección física / horarios de atención / departamentos** si existen. Hoy solo se muestra «Santo Domingo, República Dominicana».
- **Backend del formulario de contacto**: ahora arma el mensaje y abre WhatsApp o el correo del visitante, sin guardar nada. Si se quiere guardar consultas, crear un webhook de n8n específico y pasar su URL (no se reutilizó el de inscripción para no mezclar datos).

## 5. Legal, operación y campus

- **Privacidad, términos y condiciones de reembolso**: textos aprobados o URLs; se enlazarán en el pie y junto al formulario. No se crearon textos legales.
- **Consentimiento de cookies** para GA4 y Meta Pixel (hoy cargan sin banner).
- **Campus (GPA Academy OS)**: el hero enlaza «Aula virtual» a `http://69.55.61.114/login` (dirección IP sin HTTPS). Recomendado: dominio propio con certificado HTTPS (p. ej. `campus.gpaacademy.online`) y, si se desea, añadir «Campus virtual» al encabezado y al pie.
- **Manuales digitales**: 4 links de pago distintos (hoy los 4 comparten el mismo, y el pago no identifica el manual comprado).
- **`purchase` en analítica**: debe enviarse desde el servidor tras confirmar el pago (n8n); requiere el API secret de GA4.

## 6. Páginas secundarias del plano no creadas

Corporativo, fundación/becas, acreditación y egresados **no se crearon**: GPA no ha documentado esos servicios o programas. Se agregarán solo cuando existan datos reales.

## 7. Notas técnicas

- Tipografía **Poppins** (licencia SIL OFL 1.1) incrustada desde el paquete `@fontsource/poppins`.
- La captura de la demo LAP//NEXUS usada en el bloque editorial (`landing/img/demo-lap-nexus.jpg`) es del propio simulador de GPA; contiene el crédito de la fotografía original (CC BY-SA 3.0, Dr. Jayesh Amin).
