-- Esquema de base de datos para el workflow "GPA Academy - Inscripcion y Pago"
-- Motor: PostgreSQL (ajustar tipos si usas SQLite)

CREATE TABLE IF NOT EXISTS gpa_inscripciones (
    id          SERIAL PRIMARY KEY,
    nombre      TEXT,
    cedula      TEXT,
    pais        TEXT,
    telefono    TEXT,
    email       TEXT UNIQUE,
    programa    TEXT,
    estado      TEXT DEFAULT 'pendiente_pago',
    creado_en   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gpa_log (
    id          SERIAL PRIMARY KEY,
    evento      TEXT NOT NULL,
    detalle     TEXT,
    creado_en   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gpa_inscripciones_telefono ON gpa_inscripciones (telefono);
CREATE INDEX IF NOT EXISTS idx_gpa_log_evento ON gpa_log (evento);
