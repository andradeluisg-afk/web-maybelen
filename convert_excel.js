import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, 'src', 'assets', 'prod maybelen.xlsx');

try {
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0]; // 'Pedidos'
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const categories = new Set();
    const types = {};
    const products = [];

    data.forEach((row, index) => {
        // Mapeo exacto basado en debug_excel.js
        const name = row['DESCRIPCION'];
        const category = row['Clasificación'];
        const subcategory = row['Tipo'];

        // Limpieza de claves con espacios
        const cost = row[' SUBTOTAL '] || row['SUBTOTAL'] || 0;
        const price = row['PVP'] || 0;
        const stock = row['UNIDADES'] || 0;

        if (!name) return;

        // Normalizar strings
        const cleanCategory = category ? category.trim() : 'Otros';
        const cleanSubcategory = subcategory ? subcategory.trim() : '';

        // Procesar Categorías
        if (cleanCategory) {
            categories.add(cleanCategory);
            if (!types[cleanCategory]) {
                types[cleanCategory] = new Set();
            }
            if (cleanSubcategory) {
                types[cleanCategory].add(cleanSubcategory);
            }
        }

        products.push({
            id: index + 1,
            name: name.trim(),
            description: name.trim(), // Usamos el nombre como descripción inicial
            price: Number(price) || 0,
            cost: Number(cost) || 0,
            stock: Number(stock) || 0,
            tax: 0,
            discount: 0,
            category: cleanCategory,
            subcategory: cleanSubcategory,
            images: [],
            image: null
        });
    });

    const finalCategories = Array.from(categories);
    const finalTypes = {};
    Object.keys(types).forEach(cat => {
        finalTypes[cat] = Array.from(types[cat]);
    });

    console.log('--- DATA START ---');
    console.log(JSON.stringify({
        categories: finalCategories,
        types: finalTypes,
        products: products
    }, null, 2));
    console.log('--- DATA END ---');

} catch (error) {
    console.error('Error:', error);
}
