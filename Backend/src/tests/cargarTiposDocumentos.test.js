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

// Modelo de TipoDocumento
const TipoDocumento = mongoose.model('TipoDocumento', catalogSchema);

// Función principal para cargar tipos de documentos
async function cargarTiposDocumentos() {
  try {
    // Leer los datos de tipos de documentos
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tiposDocumentosPath = path.join(__dirname, '../shared/catalogs/tiposDocumentos.json');
    const tiposDocumentosData = JSON.parse(fs.readFileSync(tiposDocumentosPath, 'utf8'));

    // Conectar a la base de datos
    await connectDB();

    // Verificar si ya existen tipos de documentos
    const existingTipos = await TipoDocumento.countDocuments({ tipo: 'tiposDocumentos' });

    if (existingTipos === 0) {
      console.log('Cargando tipos de documentos...');
      
      // Convertir los datos al formato del schema
      const tiposToInsert = tiposDocumentosData.data.map(tipo => ({
        tipo: 'tiposDocumentos',
        codigo: tipo.id.toString(),
        nombre: tipo.name,
        datos_adicionales: {
          id: tipo.id,
          name: tipo.name
        }
      }));

      // Insertar los tipos de documentos
      await TipoDocumento.insertMany(tiposToInsert);

      // Verificar que se insertaron correctamente
      const insertedTipos = await TipoDocumento.countDocuments({ tipo: 'tiposDocumentos' });
      console.log(`Tipos de documentos insertados: ${insertedTipos}`);
    } else {
      console.log('Los tipos de documentos ya existen en la base de datos');
    }

    // Si ya existían tipos de documentos o se insertaron correctamente
    const response = {
      success: true,
      message: 'Tipos de documentos disponibles'
    };

    console.log('Tipos de documentos cargados exitosamente');
    return response;
  } catch (error) {
    console.error('Error al cargar tipos de documentos:', error);
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
if (import.meta.url.includes('cargarTiposDocumentos.test.js')) {
  cargarTiposDocumentos()
    .then(result => {
      console.log('Resultado:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
