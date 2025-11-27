import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase
const SUPABASE_URL = 'https://xhiabeyxhqheixgrpnpm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaWFiZXl4aHFoZWl4Z3JwbnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMjE1MTEsImV4cCI6MjA3OTY5NzUxMX0.ICrK77AgRyQT9gbskyDGqmW9tMYVrPFK0o34Q1kR-2g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const excelPath = path.join(__dirname, 'src', 'assets', 'prod maybelen.xlsx');

async function updateCosts() {
    try {
        console.log('📊 Leyendo Excel...');
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`\n✅ ${data.length} productos encontrados en Excel\n`);

        let updated = 0;
        let errors = 0;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const productName = row['DESCRIPCION'];
            const pvf = parseFloat(row[' PVF ']) || 0;

            if (!productName || pvf === 0) {
                console.log(`⚠️  Fila ${i + 1}: Producto sin nombre o PVF = 0, omitiendo...`);
                continue;
            }

            // Buscar el producto en Supabase por nombre
            const { data: products, error: searchError } = await supabase
                .from('products')
                .select('id, name, cost')
                .eq('name', productName.trim());

            if (searchError) {
                console.error(`❌ Error buscando producto "${productName}":`, searchError.message);
                errors++;
                continue;
            }

            if (!products || products.length === 0) {
                console.log(`⚠️  Producto "${productName}" no encontrado en BD`);
                continue;
            }

            const product = products[0];
            const oldCost = parseFloat(product.cost);

            // Actualizar el costo
            const { error: updateError } = await supabase
                .from('products')
                .update({ cost: pvf })
                .eq('id', product.id);

            if (updateError) {
                console.error(`❌ Error actualizando "${productName}":`, updateError.message);
                errors++;
                continue;
            }

            updated++;
            console.log(`✅ ${updated}. "${productName}": $${oldCost.toFixed(2)} → $${pvf.toFixed(2)}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log(`✅ ACTUALIZACIÓN COMPLETADA`);
        console.log(`   • ${updated} productos actualizados`);
        console.log(`   • ${errors} errores`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('💥 Error general:', error);
    }
}

updateCosts();
