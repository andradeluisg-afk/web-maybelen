import { createClient } from '@supabase/supabase-js';
import { INITIAL_CATEGORIES, INITIAL_TYPES, INITIAL_PRODUCTS } from './src/context/initialData.js';

const supabaseUrl = 'https://xhiabeyxhqheixgrpnpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaWFiZXl4aHFoZWl4Z3JwbnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMjE1MTEsImV4cCI6MjA3OTY5NzUxMX0.ICrK77AgRyQT9gbskyDGqmW9tMYVrPFK0o34Q1kR-2g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateData() {
    console.log('🚀 Iniciando migración de datos a Supabase...\n');

    try {
        // PASO 1: Migrar Categorías
        console.log('📂 Migrando categorías...');
        const categoryMap = {}; // Para mapear nombres a IDs

        for (const categoryName of INITIAL_CATEGORIES) {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name: categoryName })
                .select()
                .single();

            if (error && error.code !== '23505') { // 23505 = unique violation (ya existe)
                console.error(`❌ Error al insertar categoría "${categoryName}":`, error);
            } else if (data) {
                categoryMap[categoryName] = data.id;
                console.log(`✅ Categoría "${categoryName}" insertada`);
            } else {
                // Si ya existe, obtener su ID
                const { data: existing } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('name', categoryName)
                    .single();
                if (existing) {
                    categoryMap[categoryName] = existing.id;
                    console.log(`ℹ️  Categoría "${categoryName}" ya existía`);
                }
            }
        }

        console.log(`\n✅ ${Object.keys(categoryMap).length} categorías procesadas\n`);

        // PASO 2: Migrar Tipos/Subcategorías
        console.log('📑 Migrando tipos/subcategorías...');
        const typeMap = {}; // Para mapear nombres a IDs
        let typesCount = 0;

        for (const [categoryName, typesList] of Object.entries(INITIAL_TYPES)) {
            const categoryId = categoryMap[categoryName];
            if (!categoryId) {
                console.warn(`⚠️  Categoría "${categoryName}" no encontrada, saltando tipos`);
                continue;
            }

            for (const typeName of typesList) {
                const { data, error } = await supabase
                    .from('types')
                    .insert({
                        category_id: categoryId,
                        name: typeName
                    })
                    .select()
                    .single();

                if (error && error.code !== '23505') {
                    console.error(`❌ Error al insertar tipo "${typeName}":`, error);
                } else if (data) {
                    typeMap[`${categoryName}-${typeName}`] = data.id;
                    typesCount++;
                    console.log(`✅ Tipo "${typeName}" insertado en "${categoryName}"`);
                } else {
                    // Si ya existe, obtener su ID
                    const { data: existing } = await supabase
                        .from('types')
                        .select('id')
                        .eq('category_id', categoryId)
                        .eq('name', typeName)
                        .single();
                    if (existing) {
                        typeMap[`${categoryName}-${typeName}`] = existing.id;
                        console.log(`ℹ️  Tipo "${typeName}" ya existía`);
                    }
                }
            }
        }

        console.log(`\n✅ ${typesCount} tipos procesados\n`);

        // PASO 3: Migrar Productos
        console.log('🛍️  Migrando productos...');
        let productsCount = 0;
        let errors = 0;

        for (const product of INITIAL_PRODUCTS) {
            const categoryId = categoryMap[product.category];
            const subcategoryId = typeMap[`${product.category}-${product.subcategory}`];

            const productData = {
                name: product.name,
                description: product.description,
                price: product.price,
                cost: product.cost,
                stock: product.stock,
                tax: product.tax,
                discount: product.discount,
                category_id: categoryId || null,
                subcategory_id: subcategoryId || null
            };

            const { data, error } = await supabase
                .from('products')
                .insert(productData)
                .select();

            if (error) {
                console.error(`❌ Error al insertar producto "${product.name}":`, error.message);
                errors++;
            } else {
                productsCount++;
                if (productsCount % 50 === 0) {
                    console.log(`   📦 ${productsCount} productos insertados...`);
                }
            }
        }

        console.log(`\n✅ ${productsCount} productos insertados correctamente`);
        if (errors > 0) {
            console.log(`⚠️  ${errors} productos con errores`);
        }

        console.log('\n🎉 ¡Migración completada exitosamente!');

    } catch (error) {
        console.error('💥 Error crítico durante la migración:', error);
    }
}

// Ejecutar migración
migrateData();
