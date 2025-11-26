/**
 * Redimensiona una imagen manteniendo la proporción
 * @param {string} base64Image - Imagen en formato base64
 * @param {number} maxSize - Tamaño máximo en píxeles (ancho o alto)
 * @returns {Promise<string>} - Imagen redimensionada en base64
 */
export const resizeImage = (base64Image, maxSize = 600) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calcular nuevas dimensiones manteniendo proporción
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height);

            // Convertir a base64 con calidad optimizada (0.85 = 85% calidad)
            const resizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            resolve(resizedBase64);
        };

        img.onerror = (error) => {
            reject(error);
        };

        img.src = base64Image;
    });
};

/**
 * Redimensiona múltiples imágenes
 * @param {string[]} images - Array de imágenes en base64
 * @param {number} maxSize - Tamaño máximo
 * @returns {Promise<string[]>} - Array de imágenes redimensionadas
 */
export const resizeMultipleImages = async (images, maxSize = 600) => {
    const resizedImages = [];

    for (const image of images) {
        try {
            const resized = await resizeImage(image, maxSize);
            resizedImages.push(resized);
        } catch (error) {
            console.error('Error redimensionando imagen:', error);
            // Si falla, usar la original
            resizedImages.push(image);
        }
    }

    return resizedImages;
};
