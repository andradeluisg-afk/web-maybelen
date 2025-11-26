-- ============================================
-- SCHEMA PARA TIENDA MAYBELEN - ALPHA 1
-- ============================================

-- 1. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Tipos/Subcategorías
CREATE TABLE IF NOT EXISTS types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, name)
);

-- 3. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  tax DECIMAL(5,2) DEFAULT 0,
  discount DECIMAL(5,2) DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES types(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Imágenes de Productos
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDICES para mejor rendimiento
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_types_category ON types(category_id);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE types ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE ACCESO (Lectura pública, escritura solo admin)
-- ============================================

-- Categorías: Lectura pública
CREATE POLICY "Categorías son visibles para todos" ON categories
  FOR SELECT USING (true);

-- Tipos: Lectura pública
CREATE POLICY "Tipos son visibles para todos" ON types
  FOR SELECT USING (true);

-- Productos: Lectura pública
CREATE POLICY "Productos son visibles para todos" ON products
  FOR SELECT USING (true);

-- Imágenes: Lectura pública
CREATE POLICY "Imágenes son visibles para todos" ON product_images
  FOR SELECT USING (true);

-- ============================================
-- POLÍTICAS DE ESCRITURA (Solo usuarios autenticados)
-- ============================================

-- Categorías: Escritura autenticada
CREATE POLICY "Solo autenticados pueden modificar categorías" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Tipos: Escritura autenticada
CREATE POLICY "Solo autenticados pueden modificar tipos" ON types
  FOR ALL USING (auth.role() = 'authenticated');

-- Productos: Escritura autenticada
CREATE POLICY "Solo autenticados pueden modificar productos" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Imágenes: Escritura autenticada
CREATE POLICY "Solo autenticados pueden modificar imágenes" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
