-- Adds the worker (çalışan) level below managers.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('gmy', 'director', 'manager', 'employee'));
