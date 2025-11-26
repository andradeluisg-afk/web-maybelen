import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, 'src', 'assets', 'prod maybelen.xlsx');

try {
    const workbook = XLSX.readFile(excelPath);
    console.log('Hojas encontradas:', workbook.SheetNames);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (data.length > 0) {
        console.log('Ejemplo de primera fila:', JSON.stringify(data[0], null, 2));
        console.log('Columnas disponibles:', Object.keys(data[0]));
    } else {
        console.log('La hoja parece estar vacía.');
    }

} catch (error) {
    console.error('Error leyendo el archivo:', error);
}
