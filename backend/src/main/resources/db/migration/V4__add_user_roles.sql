-- 1. Dodajemy kolumnę 'role' do tabeli użytkowników. 
-- Domyślnie każdy nowy użytkownik będzie zwykłym 'ROLE_USER'.
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'ROLE_USER';

-- 2. Dodajemy testowego administratora do bazy - testowanie uprawnień
INSERT INTO users (name, email, password_hash, role) VALUES 
('Szef Wszystkich Szefów', 'admin@example.com', '$2a$10$JL2pw1OYKj4lDtUTQUry9umEhsgs9Ro17lBjDsgjofg0ydmxc5g8y', 'ROLE_ADMIN');