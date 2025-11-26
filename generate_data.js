import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, 'src', 'assets', 'prod maybelen.xlsx');
const outputPath = path.join(__dirname, 'src', 'context', 'initialData.js');

try {
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const categories = new Set();
    const types = {};
    const products = [];

    data.forEach((row, index) => {
        const name = row['DESCRIPCION'];
        const category = row['Clasificación'];
        const subcategory = row['Tipo'];

        const cost = row[' SUBTOTAL '] || row['SUBTOTAL'] || 0;
        const price = row['PVP'] || 0;
        const stock = row['UNIDADES'] || 0;

        if (!name) return;

        const cleanCategory = category ? category.trim() : 'Otros';
        const cleanSubcategory = subcategory ? subcategory.trim() : '';

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
            description: name.trim(),
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

    const fileContent = `export const INITIAL_CATEGORIES = ${JSON.stringify(finalCategories, null, 2)};

export const INITIAL_TYPES = ${JSON.stringify(finalTypes, null, 2)};

export const INITIAL_PRODUCTS = ${JSON.stringify(products, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log('Archivo initialData.js creado exitosamente en src/context/');

} catch (error) {
    console.error('Error:', error);
}
