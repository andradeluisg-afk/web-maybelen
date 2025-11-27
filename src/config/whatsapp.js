// Configuración de WhatsApp Business
export const WHATSAPP_CONFIG = {
    number: '593984413528',
    catalogUrl: 'https://wa.me/c/593984413528',

    // Mensajes predeterminados
    messages: {
        general: 'Hola! Me interesa conocer más sobre tus productos. ¿Podrías ayudarme con más información?',
        product: (productName, price) =>
            `Hola! Me interesa el producto: *${productName}* (${price}). ¿Podrías darme más información?`,
        catalog: 'Hola! Me gustaría ver el catálogo completo de productos disponibles.',
    },

    // Función helper para abrir WhatsApp
    openWhatsApp: (message = null) => {
        const msg = message || WHATSAPP_CONFIG.messages.general;
        const encodedMsg = encodeURIComponent(msg);
        window.open(`https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodedMsg}`, '_blank');
    },

    openCatalog: () => {
        window.open(WHATSAPP_CONFIG.catalogUrl, '_blank');
    }
};
