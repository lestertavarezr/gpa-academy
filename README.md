# GPA Academy OS

Sistema operativo central para GPA Academy. Dashboard ejecutivo con control total de operaciones comerciales, académicas y automatizaciones.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación y arranque

```bash
cd ~/gpa-academy-os
npm install
npm run dev
```

Abre **http://localhost:3000** en tu navegador.

---

## Estructura del proyecto

```
gpa-academy-os/
├── src/
│   ├── app/
│   │   ├── (dashboard)/           # Layout con sidebar
│   │   │   ├── page.tsx           # CEO View (Home)
│   │   │   ├── leads/             # Leads & Ventas
│   │   │   ├── automations/       # Automatizaciones
│   │   │   ├── operations/        # Operaciones Académicas
│   │   │   ├── content/           # Contenido & Marketing
│   │   │   ├── tasks/             # Tareas & Control Center
│   │   │   ├── alerts/            # Alertas & Incidencias
│   │   │   ├── activity/          # Autonomous Activity Feed
│   │   │   └── settings/          # Integraciones
│   │   └── api/                   # API routes (para conectar N8N, bot, etc.)
│   ├── components/
│   │   ├── layout/                # Sidebar, Header
│   │   ├── ui/                    # KPICard, StatusBadge, SectionCard
│   │   ├── charts/                # SalesChart, FunnelChart, LeadSourceChart
│   │   └── dashboard/             # ActivityFeed, SystemHealth
│   ├── lib/
│   │   ├── mock-data.ts           # Datos demo (leads, ventas, programas, etc.)
│   │   └── utils.ts               # Formateo de fechas, moneda, clases CSS
│   └── types/
│       └── index.ts               # Todos los tipos TypeScript del sistema
```

---

## Secciones del dashboard

| Sección | Ruta | Descripción |
|---|---|---|
| CEO View | `/` | KPIs, gráficas, alertas activas, actividad reciente |
| Leads & Ventas | `/leads` | Tabla de leads, embudo, historial de pagos |
| Automatizaciones | `/automations` | Estado de workflows N8N/WhatsApp, logs |
| Operaciones | `/operations` | Programas, estudiantes, certificados |
| Contenido | `/content` | Pipeline de marketing, métricas |
| Tareas | `/tasks` | Centro de control operativo |
| Alertas | `/alerts` | Errores, incidencias, seguimientos retrasados |
| Activity Feed | `/activity` | Todo lo que el sistema hizo de forma autónoma |
| Integraciones | `/settings` | Conectores: WhatsApp, N8N, Sheets, CRM, etc. |

---

## Conectar con tus sistemas reales

### Bot Luz (WhatsApp)
El bot en `~/mi-whatsapp-bot/wweb-server.js` puede hacer POST a:
```
POST http://localhost:3000/api/leads     → crear/actualizar lead
POST http://localhost:3000/api/activity  → registrar evento en el feed
POST http://localhost:3000/api/alerts    → crear alerta
```

### N8N (puerto 5678)
Desde cualquier workflow N8N, usa el nodo **HTTP Request** para enviar datos al dashboard:
```
URL: http://localhost:3000/api/kpis
Método: POST
Body: { "key": "leadsToday", "value": 8 }
```

### Google Sheets
Configura un webhook trigger en N8N que lea Sheets y haga POST al dashboard.

### Integración MCP (Claude Desktop)

La API interna de solo lectura está documentada en [`API.md`](./API.md). Configura
`MCP_SERVICE_TOKEN` como secreto del servidor antes de desplegar. El servidor MCP
independiente y su configuración de Claude Desktop están en la entrega
`gpa-academy-os-mcp-integration/mcp-server`; debe recibir la URL pública de este
dashboard terminada en `/api/mcp` y el mismo token mediante `GPA_API_TOKEN`.

La fuente de datos actual del dashboard es demostrativa (`src/lib/mock-data.ts`).
Al migrar a base de datos, reemplaza únicamente el adaptador `src/lib/mcp-data.ts`
por los servicios de dominio reales, sin ampliar los campos que expone la API.

---

## Próximas iteraciones recomendadas

1. **Base de datos real** — migrar mock-data.ts a SQLite con Prisma
2. **API routes activas** — conectar bot Luz y N8N al dashboard en tiempo real
3. **Auth** — proteger el dashboard con next-auth
4. **WebSockets** — actualizaciones en tiempo real del feed de actividad
5. **Formularios editables** — crear/editar leads y tareas desde el UI
6. **Notificaciones push** — alertas en el navegador cuando hay errores

---

## Stack

- **Next.js 14** — App Router, Server Components
- **TypeScript** — tipado completo
- **Tailwind CSS** — diseño oscuro, moderno
- **Recharts** — gráficas de ventas y leads
- **Lucide React** — iconografía consistente
- **date-fns** — manejo de fechas en español
