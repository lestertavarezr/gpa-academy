# API interna MCP — GPA Academy OS

Los endpoints viven en `src/app/api/mcp`. Son de solo lectura, requieren el header `Authorization: Bearer <MCP_SERVICE_TOKEN>` y no usan la sesión del dashboard. La clave debe quedar únicamente en las variables de entorno del servidor y del proceso MCP; nunca en `NEXT_PUBLIC_*`.

Las respuestas correctas tienen la forma `{ "data": ... }`; las listas agregan `meta` con `page`, `limit` y `total`. Los errores tienen la forma `{ "error": { "code": "...", "message": "..." } }`. Se devuelve `401` para token incorrecto, `404` para recurso ausente, `422` para parámetros inválidos, `503` cuando falta una fuente requerida y `500` para configuración o fallo interno.

| Ruta | Parámetros | Datos expuestos |
| --- | --- | --- |
| `GET /api/mcp/students` | `programa_id?`, `estado?`, `page?`, `limit?` | ID, nombre, programa, estado y fecha de inscripción. No correo, teléfono ni pagos. |
| `GET /api/mcp/students/:id/progress` | — | Avance, módulos, competencia derivada, puntos e insignias derivadas. |
| `GET /api/mcp/programs/:id/metrics` | — | Inscritos, finalización y agregado Nexus. |
| `GET /api/mcp/question-bank` | `categoria?`, `page?`, `limit?` | Actualmente devuelve `503 QUESTION_BANK_UNAVAILABLE`: no existe esta fuente en el proyecto. |

La capa de adaptación es `src/lib/mcp-data.ts`: reutiliza la fuente de datos que usa el dashboard actual (`mock-data.ts`) y filtra los campos sensibles. Al incorporar una base de datos, sustituir esa implementación por el servicio de dominio/ORM existente, manteniendo el mismo contrato público. En particular, Nexus Quirúrgico no tiene datos en el proyecto y por ello devuelve valores nulos/cero, no cifras simuladas.

Prueba autorizada:

```bash
curl -sS -H "Authorization: Bearer $MCP_SERVICE_TOKEN" \
  "http://localhost:4000/api/mcp/students?estado=activo&page=1&limit=25"
```
