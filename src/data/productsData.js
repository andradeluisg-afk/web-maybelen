// Datos de productos extraídos del Excel
// Estructura: Mes, Clasificación, Tipo, Descripción, Subtotal, Unidades, Precio U., PVF, TOTAL PVP, EMP., PVP, Rent%, Rent$

export const initialProducts = [
    {
        id: 1,
        mes: "Mayo",
        clasificacion: "Accesorios",
        tipo: "Bolso",
        descripcion: "Bolso tela cubo rosa Hello Kitty",
        subtotal: 3.89,
        unidades: 1,
        precioUnitario: 4.668,
        pvf: 8,
        totalPvp: 8,
        pvp: 8,
        stock: 5,
        imagen: null,
        activo: true
    },
    {
        id: 2,
        mes: "Mayo",
        clasificacion: "Accesorios",
        tipo: "Bolso",
        descripcion: "Bolso tela bandolera Hello Kitty",
        subtotal: 5.6,
        unidades: 1,
        precioUnitario: 6.72,
        pvf: 10,
        totalPvp: 10,
        pvp: 10,
        stock: 3,
        imagen: null,
        activo: true
    },
    {
        id: 3,
        mes: "Mayo",
        clasificacion: "Accesorios",
        tipo: "Bolso",
        descripcion: "Bolso cuerina Mensajería Hello Kitty",
        subtotal: 4.8,
        unidades: 1,
        precioUnitario: 5.76,
        pvf: 10,
        totalPvp: 10,
        pvp: 10,
        stock: 4,
        imagen: null,
        activo: true
    },
    {
        id: 4,
        mes: "Mayo",
        clasificacion: "Accesorios",
        tipo: "Bolso",
        descripcion: "Bolso impermeable bandolera Hello Kitty",
        subtotal: 7.88,
        unidades: 1,
        precioUnitario: 9.456,
        pvf: 12,
        totalPvp: 12,
        pvp: 12,
        stock: 2,
        imagen: null,
        activo: true
    },
    {
        id: 5,
        mes: "Mayo",
        clasificacion: "Accesorios",
        tipo: "Bolso",
        descripcion: "Mochila Hello Kitty",
        subtotal: 8.03,
        unidades: 1,
        precioUnitario: 9.636,
        pvf: 12,
        totalPvp: 12,
        pvp: 12,
        stock: 3,
        imagen: null,
        activo: true
    },
    {
        id: 6,
        mes: "Mayo",
        clasificacion: "Accesorios",
        tipo: "Gafas",
        descripcion: "Gafas Niña Hello Kitty",
        subtotal: 1.78,
        unidades: 1,
        precioUnitario: 2.136,
        pvf: 4,
        totalPvp: 4,
        pvp: 4,
        stock: 10,
        imagen: null,
        activo: true
    },
    {
        id: 7,
        mes: "Mayo",
        clasificacion: "Bisuteria",
        tipo: "Anillo",
        descripcion: "Anillo Mounstro",
        subtotal: 7.26,
        unidades: 20,
        precioUnitario: 0.4356,
        pvf: 1,
        totalPvp: 20,
        pvp: 1,
        stock: 20,
        imagen: null,
        activo: true
    },
    {
        id: 8,
        mes: "Mayo",
        clasificacion: "Bisuteria",
        tipo: "Anillo",
        descripcion: "Anillo resina",
        subtotal: 2.51,
        unidades: 10,
        precioUnitario: 0.3012,
        pvf: 1,
        totalPvp: 10,
        pvp: 1,
        stock: 10,
        imagen: null,
        activo: true
    }
];

// Categorías disponibles
export const categorias = [
    "Accesorios",
    "Bisuteria",
    "Papeleria",
    "Peluches",
    "Decoracion"
];

// Tipos de productos
export const tipos = {
    Accesorios: ["Bolso", "Mochila", "Gafas", "Llavero", "Reloj", "Delantal", "Espejo", "Monedero", "Cordones"],
    Bisuteria: ["Anillo", "Collar", "Pulsera", "Aretes"],
    Papeleria: ["Libreta", "Cuaderno", "Lapicero", "Resaltador", "Stickers"],
    Peluches: ["Peluche Pequeño", "Peluche Mediano", "Peluche Grande"],
    Decoracion: ["Poster", "Figura", "Lampara", "Cojin"]
};
