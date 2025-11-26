-- ============================================
-- TEMPORAL: Permitir escritura en product_images
-- (Mientras no tengamos autenticación implementada)
-- ============================================

-- Eliminar política restrictiva
DROP POLICY IF EXISTS "Solo autenticados pueden modificar imágenes" ON product_images;

-- Crear política temporal que permita todas las operaciones
CREATE POLICY "Permitir todas las operaciones en product_images temporalmente" 
ON product_images 
FOR ALL 
USING (true)
WITH CHECK (true);

-- NOTA: Esta política es permisiva y solo para desarrollo.
-- En producción con autenticación, volver a la política restrictiva.
