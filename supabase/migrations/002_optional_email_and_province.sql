-- ══════════════════════════════════════════════════════════════
-- WALFA CHESS — Migración 002: Email opcional y Provincia en Inscripciones
-- ══════════════════════════════════════════════════════════════

-- 1. Permitir que el email sea opcional en la tabla de inscripciones
ALTER TABLE inscriptions ALTER COLUMN email DROP NOT NULL;

-- 2. Añadir columna opcional de provincia
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS province TEXT;

-- 3. Crear índice para búsquedas por provincia
CREATE INDEX IF NOT EXISTS idx_inscriptions_province ON inscriptions(province);
