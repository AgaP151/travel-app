-- 1. Dodajemy kolumnę 'role' do tabeli użytkowników. 
-- Domyślnie każdy nowy użytkownik będzie zwykłym 'ROLE_USER'.
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'ROLE_USER';

-- 2. Dodajemy testowego administratora do bazy, żeby Aga miała na kim testować uprawnienia
INSERT INTO users (name, email, password_hash, role) VALUES 
('Szef Wszystkich Szefów', 'admin@example.com', 'haslo_admina_123', 'ROLE_ADMIN');