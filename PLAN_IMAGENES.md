# 🎉 Sistema de Carga de Imágenes Múltiples - MayBelen

## 📋 Plan de Implementación

### ✅ Completado:
1. **Versionado Beta1** - Git inicializado y tag creado
2. **Botón Gestionar Productos** - (Pendiente de aplicar)

### 🔄 En Progreso:
3. **Sistema de Carga de Imágenes Múltiples**

---

## 🎯 Lo que vamos a implementar:

### 1. Componente ImageUploader
- Permite subir 1-4 imágenes por producto
- Botón "Agregar Foto" con explorador de archivos
- Solo acepta PNG y JPG
- Muestra previsualizaciones de las imágenes subidas
- Permite eliminar imágenes individuales

### 2. Actualizar StoreContext
- Cambiar `image` (string) → `images` (array)
- Función `addProductImage(productId, imageFile)`
- Función `removeProductImage(productId, imageIndex)`
- Convertir imágenes a Base64 para almacenar en localStorage

### 3. Componente ImageCarousel
- Carrusel para mostrar múltiples imágenes en la tienda
- Puntos indicadores para navegar
- Flechas izquierda/derecha
- Responsive y con transiciones suaves

### 4. Actualizar Inventory.jsx
- Integrar ImageUploader en el formulario de productos
- Reemplazar campo de URL por carga de archivos
- Mostrar galería de imágenes cargadas

### 5. Actualizar Store/Home.jsx
- Reemplazar imagen única por ImageCarousel
- Si no hay imágenes, mostrar placeholder

---

## 💡 Nota Técnica:
Las imágenes se convertirán a Base64 y se guardarán en localStorage. Esto es simple pero tiene limitaciones de tamaño (~5-10MB total). Para producción, deberías usar un servicio de almacenamiento como Cloudinary o AWS S3.

---

**Estado:** Restaurando archivo CategoriesManager.jsx y preparando implementación completa...
