-- ============================================
-- TEMPORAL: Permitir inserciones para migración
-- ============================================

-- Eliminar políticas restrictivas temporalmente
DROP POLICY IF EXISTS "Solo autenticados pueden modificar categorías" ON categories;
DROP POLICY IF EXISTS "Solo autenticados pueden modificar tipos" ON types;
DROP POLICY IF EXISTS "Solo autenticados pueden modificar productos" ON products;
DROP POLICY IF EXISTS "Solo autenticados pueden modificar imágenes" ON product_images;

-- Crear políticas temporales que permitan escritura anónima
CREATE POLICY "temp_categories_insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "temp_types_insert" ON types FOR INSERT WITH CHECK (true);
CREATE POLICY "temp_products_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "temp_images_insert" ON product_images FOR INSERT WITH CHECK (true);

-- NOTA: Después de la migración, ejecuta restore-policies.sql
