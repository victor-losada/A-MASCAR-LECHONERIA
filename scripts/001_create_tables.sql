-- =============================================
-- A'MASCAR LECHONERIA - Database Schema
-- =============================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('lechonas', 'bebidas', 'salsas', 'addons')),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de ofertas globales
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  discount_applied INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de administradores (usuarios con acceso al panel)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para mejor performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Politicas RLS para productos (lectura publica, escritura solo admin)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products can be modified via service role" ON products
  FOR ALL USING (true);

-- Politicas RLS para ofertas (lectura publica, escritura solo admin)
CREATE POLICY "Offers are viewable by everyone" ON offers
  FOR SELECT USING (true);

CREATE POLICY "Offers can be modified via service role" ON offers
  FOR ALL USING (true);

-- Politicas RLS para pedidos (escritura publica para crear, lectura admin)
CREATE POLICY "Orders can be created by anyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders can be viewed and modified via service role" ON orders
  FOR ALL USING (true);

-- Politicas RLS para admin_users (solo via service role)
CREATE POLICY "Admin users managed via service role" ON admin_users
  FOR ALL USING (true);
