-- ============================================
-- POLÍTICAS DE STORAGE PARA PRODUCT-IMAGES
-- ============================================

-- Permitir lectura pública de imágenes
CREATE POLICY "Imágenes son públicas para lectura"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Permitir inserción de imágenes (temporal - para testing sin auth)
CREATE POLICY "Cualquiera puede subir imágenes temporalmente"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Permitir actualización de imágenes
CREATE POLICY "Cualquiera puede actualizar imágenes temporalmente"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Permitir eliminación de imágenes
CREATE POLICY "Cualquiera puede eliminar imágenes temporalmente"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- NOTA: Estas políticas son permisivas para testing.
-- En producción, deberías restringir INSERT/UPDATE/DELETE solo a usuarios autenticados.
