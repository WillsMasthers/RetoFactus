import mongoose from 'mongoose';
import { catalogSchema } from '../models/catalog.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/retofactus', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Modelo de País
const Pais = mongoose.model('Pais', catalogSchema);

// Función principal para cargar países
async function cargarPaises() {
  try {
    // Leer los datos de países
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const paisesPath = path.join(__dirname, '../shared/catalogs/paises.json');
    const paisesData = JSON.parse(fs.readFileSync(paisesPath, 'utf8'));

    // Verificar que los datos tienen la estructura esperada
    if (!paisesData.data || !Array.isArray(paisesData.data)) {
      throw new Error('El archivo de países no tiene la estructura esperada');
    }

    // Conectar a la base de datos
    await connectDB();

    // Verificar si ya existen países
    const existingPaises = await Pais.countDocuments({ tipo: 'paises' });

    if (existingPaises === 0) {
      console.log('Cargando países...');
      
      // Convertir los datos al formato del schema
      const paisesToInsert = paisesData.data.map(pais => ({
        tipo: 'paises',
        codigo: pais.code,
        nombre: pais.name,
        datos_adicionales: {
          id: pais.id,
          code: pais.code,
          name: pais.name
        }
      }));

      // Insertar los países
      await Pais.insertMany(paisesToInsert);

      // Verificar que se insertaron correctamente
      const insertedPaises = await Pais.countDocuments({ tipo: 'paises' });
      console.log(`Países insertados: ${insertedPaises}`);
    } else {
      console.log('Los países ya existen en la base de datos');
    }

    // Si ya existían países o se insertaron correctamente
    const response = {
      success: true,
      message: 'Países disponibles'
    };

    console.log('Países cargados exitosamente');
    return response;
  } catch (error) {
    console.error('Error al cargar países:', error);
    return {
      success: false,
      message: error.message
    };
  } finally {
    // Cerrar la conexión a la base de datos
    await mongoose.connection.close();
  }
}

// Ejecutar la función principal si el archivo es ejecutado directamente
if (import.meta.url.includes('cargarPaises.test.js')) {
  cargarPaises()
    .then(result => {
      console.log('Resultado:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
