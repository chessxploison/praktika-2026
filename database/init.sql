-- CREATE DATABASE purchase;

-- Создание схемы
CREATE SCHEMA IF NOT EXISTS purchase;

-- Таблица контрагентов
CREATE TABLE purchase.customer (
    customer_code VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_inn VARCHAR(12),
    customer_kpp VARCHAR(9),
    customer_legal_address TEXT,
    customer_postal_address TEXT,
    customer_email VARCHAR(100),
    customer_code_main VARCHAR(50),
    is_organization BOOLEAN DEFAULT false,
    is_person BOOLEAN DEFAULT false
);

-- Таблица лотов
CREATE TABLE purchase.lot (
    id BIGSERIAL PRIMARY KEY,
    lot_name VARCHAR(255) NOT NULL,
    customer_code VARCHAR(50) REFERENCES purchase.customer(customer_code),
    price NUMERIC(15,2) NOT NULL CHECK (price >= 0),
    currency_code VARCHAR(3) NOT NULL CHECK (currency_code IN ('RUB', 'USD', 'EUR')),
    nds_rate VARCHAR(10) NOT NULL CHECK (nds_rate IN ('Без НДС', '18%', '20%')),
    place_delivery TEXT,
    date_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тестовые данные
INSERT INTO purchase.customer (customer_code, customer_name, customer_inn, is_organization) VALUES
('CUST001', 'ООО "Эконива"', '1234567890', true),
('CUST002', 'Турищева А. Р.', '123456789012', false);

INSERT INTO purchase.lot (lot_name, customer_code, price, currency_code, nds_rate, place_delivery, date_delivery) VALUES
('Стол офисный', 'CUST001', 150000.00, 'RUB', '20%', 'Москва, ул. Пушкина 1', '2024-12-31 18:00:00'),
('Кресло-качалка', 'CUST001', 25000.50, 'RUB', '20%', 'Санкт-Петербург, Невский пр. 10', '2024-11-30 10:00:00');
