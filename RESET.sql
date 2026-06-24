-- =====================================
-- CHARLES OF DUTY
-- RESET EVG V1.0
-- =====================================

-- Réinitialiser les ressources
UPDATE game_settings
SET
    current_bullets = 0,
    current_teammates = 0;

-- Réinitialiser toutes les missions
UPDATE missions
SET
    validated = false,
    validated_by = NULL;

-- Réinitialiser tous les succès
UPDATE achievements
SET
    unlocked = false;

-- Vider le journal de guerre
DELETE FROM war_log;

-- Supprimer toutes les missions bonus
DELETE FROM missions
WHERE is_bonus = true;
