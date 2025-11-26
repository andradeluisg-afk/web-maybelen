-- ============================================
-- TEMPORAL: Políticas permisivas para desarrollo sin auth
-- ============================================

-- Eliminar políticas restrictivas
DROP POLICY IF EXISTS "Solo autenticados pueden modificar categorías" ON categories;
DROP POLICY IF EXISTS "Solo autenticados pueden modificar tipos" ON types;
DROP POLICY IF EXISTS "Solo autenticados pueden modificar productos" ON products;
DROP POLICY IF EXISTS "Solo autenticados pueden modificar imágenes" ON product_images;

-- Crear políticas permisivas temporales para TODAS las operaciones
CREATE POLICY "Permitir todo en categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en types" ON types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);

-- NOTA: Estas políticas son para desarrollo/testing.
-- Las políticas de lectura pública siguen activas (ya estaban).
-- Cuando implementemos autenticación real, ejecutar restore-policies-strict.sql
