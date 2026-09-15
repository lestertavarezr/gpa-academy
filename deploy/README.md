# Cómo poner n8n en un servidor propio (VPS)

Esta carpeta trae todo listo para que montes n8n en un servidor que esté encendido 24/7 — nada de depender de que tu PC de casa se quede prendida. Con Docker, es prácticamente copiar, pegar y ejecutar.

## Paso 1 — Comprar el VPS

Recomendado: **Hetzner** (CX22, ~€4.20/mes, 4GB RAM) — es el más barato con suficiente memoria para correr n8n + Postgres cómodos. Alternativa igual de válida: **DigitalOcean** (Droplet de 2GB, ~US$12/mes, interfaz más sencilla para principiantes).

Al crearlo, elige:
- Sistema operativo: **Ubuntu 22.04 LTS**
- Región: la más cercana a tus estudiantes (si la mayoría está en RD/Centroamérica, una región en EE.UU. este va bien).
- Anota la **dirección IP** que te asignen — la necesitas en el siguiente paso.

## Paso 2 — Apuntar tu dominio al servidor (en Namecheap)

1. Entra a Namecheap → tu dominio → **Advanced DNS**.
2. Agrega un registro tipo **A**:
   - Host: `n8n` (así tu n8n va a vivir en `n8n.tudominio.com`, dejando `tudominio.com` libre para la landing page)
   - Value: la IP de tu VPS
   - TTL: Automatic
3. Espera unos minutos a que propague (puedes verificar con `nslookup n8n.tudominio.com` desde tu compu).

## Paso 3 — Conectarte al servidor e instalar Docker

```bash
ssh root@TU_IP_DEL_SERVIDOR
curl -fsSL https://get.docker.com | sh
```

## Paso 4 — Subir estos archivos al servidor

La forma más simple es clonar tu propio repo directo en el servidor (así también tienes `n8n/schema.sql` a mano, que el `docker-compose.yml` usa automáticamente):

```bash
git clone https://github.com/lestertavarezr/gpa-academy.git
cd gpa-academy/deploy
cp .env.example .env
nano .env   # edita N8N_HOST (tu subdominio real) y pon una contraseña segura en POSTGRES_PASSWORD
```

## Paso 5 — Levantar todo

```bash
docker compose up -d
```

Esto levanta 3 piezas:
- **postgres** → la base de datos (y crea automáticamente las tablas `gpa_inscripciones` y `gpa_log` de `n8n/schema.sql` la primera vez).
- **n8n** → tu instancia de automatización.
- **caddy** → un servidor que pone el candado HTTPS automáticamente (certificado gratis, se renueva solo) y conecta tu dominio con n8n.

Espera 1-2 minutos y abre `https://n8n.tudominio.com` en el navegador — debería cargar n8n con candado verde (HTTPS).

## Paso 6 — Configurar n8n

1. La primera vez, n8n te pide crear tu usuario administrador (correo + contraseña) — ese login es solo para ti, para entrar al panel.
2. **Workflows → Import from File** → sube `n8n/gpa-academy-inscripcion-pago.workflow.json`.
3. Abre los nodos de Postgres (ej. "Guardar Inscripcion") y crea la credencial de Postgres con estos datos:
   - Host: `postgres` (así se llama el contenedor, no hace falta IP)
   - Database: el mismo valor de `POSTGRES_DB` en tu `.env`
   - User / Password: los mismos valores de `POSTGRES_USER` / `POSTGRES_PASSWORD` en tu `.env`
   - Port: `5432`
4. Configura la credencial SMTP en "Enviar Correo al Director".
5. Activa el workflow (switch arriba a la derecha).

Tu webhook real va a quedar en:
```
https://n8n.tudominio.com/webhook/inscripcion-gpa
https://n8n.tudominio.com/webhook/pago-gpa
```

## Paso 7 — Actualizar la landing page

En `landing/index.html`, busca `localhost:5678` y reemplázalo por tu dominio real:
```js
const N8N_INSCRIPCION_WEBHOOK = 'https://n8n.tudominio.com/webhook/inscripcion-gpa';
```

## Paso 8 — Cerrar el servidor con un firewall básico

Para que solo quede abierto lo necesario (SSH, y lo que usa Caddy para servir HTTPS):

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

## Mantenimiento

- **Ver que todo esté corriendo:** `docker compose ps`
- **Ver logs si algo falla:** `docker compose logs -f n8n`
- **Actualizar n8n a la última versión:** `docker compose pull && docker compose up -d`
- **Respaldo:** el volumen `postgres_data` tiene todos tus datos (inscripciones, log, y la configuración interna de n8n). Vale la pena programar un respaldo periódico de ese volumen — si quieres, te ayudo a configurar uno automático más adelante.
