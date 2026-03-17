-- =============================================
-- A'MASCAR LECHONERIA - Seed Data
-- =============================================

-- Insertar administrador por defecto
-- Password: lechona2026 (hash bcrypt)
INSERT INTO admin_users (username, password_hash) VALUES 
('admin', '$2b$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YuY8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y')
ON CONFLICT (username) DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, category, image_url, available, discount) VALUES
('Lechona Familiar', 'Lechona tradicional para 8-10 personas, rellena de arroz, arvejas y especias secretas', 180000, 'lechonas', '/images/lechona-hero.jpg', true, 0),
('Lechona Mediana', 'Perfecta para reuniones de 5-6 personas, el mismo sabor tradicional', 120000, 'lechonas', '/images/lechona-product.jpg', true, 10),
('Porcion Individual', 'Una generosa porcion de lechona con arepa y aji', 25000, 'lechonas', '/images/lechona-hero.jpg', true, 0),
('Coca-Cola 1.5L', 'Bebida gaseosa familiar', 8000, 'bebidas', '/images/lechona-hero.jpg', true, 0),
('Colombiana 1.5L', 'La bebida colombiana por excelencia', 7500, 'bebidas', '/images/lechona-hero.jpg', true, 0),
('Jugo Hit 1L', 'Jugo de frutas natural', 6000, 'bebidas', '/images/lechona-hero.jpg', true, 0),
('Salsa Picante Casera', 'Aji picante hecho en casa, el toque perfecto', 5000, 'salsas', '/images/lechona-hero.jpg', true, 0),
('Salsa BBQ', 'Salsa barbecue ahumada', 6000, 'salsas', '/images/lechona-hero.jpg', true, 0),
('Arepa Extra', 'Arepa adicional para acompanar', 2000, 'addons', '/images/lechona-hero.jpg', true, 0),
('Porcion de Chicharron', 'Chicharron crujiente adicional', 8000, 'addons', '/images/lechona-hero.jpg', true, 0)
ON CONFLICT DO NOTHING;

-- Insertar ofertas de ejemplo
INSERT INTO offers (name, description, discount_percent, active) VALUES
('Inauguracion', 'Descuento especial de inauguracion en toda la tienda', 15, true),
('Fin de Semana', 'Promocion especial para pedidos del fin de semana', 10, false)
ON CONFLICT DO NOTHING;
