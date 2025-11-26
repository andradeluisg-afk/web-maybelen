-- ============================================
-- RESTAURAR: Políticas de seguridad correctas
-- ============================================

-- Eliminar políticas temporales
DROP POLICY IF EXISTS "temp_categories_insert" ON categories;
DROP POLICY IF EXISTS "temp_types_insert" ON types;
DROP POLICY IF EXISTS "temp_products_insert" ON products;
DROP POLICY IF EXISTS "temp_images_insert" ON product_images;

-- Restaurar políticas correctas (escritura solo autenticados)
CREATE POLICY "Solo autenticados pueden modificar categorías" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados pueden modificar tipos" ON types
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados pueden modificar productos" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Solo autenticados pueden modificar imágenes" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');
