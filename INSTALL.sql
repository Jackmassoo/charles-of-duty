-- =====================================
-- CHARLES OF DUTY
-- INSTALL.sql
-- Migrations V1.0
-- =====================================

-- V1.0
-- Ajout du support des missions bonus

ALTER TABLE missions
ADD COLUMN IF NOT EXISTS is_bonus boolean DEFAULT false;

UPDATE missions
SET is_bonus = false
WHERE is_bonus IS NULL;
