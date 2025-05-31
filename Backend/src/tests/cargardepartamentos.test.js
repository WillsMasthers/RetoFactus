import mongoose from 'mongoose';
import { departamentoSchema } from '../models/catalogs.js';
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

// Modelo de Departamento
const Departamento = mongoose.model('Departamento', departamentoSchema);

// Función principal para cargar departamentos
async function cargarDepartamentos() {
  try {
    // Leer los datos de ubicaciones
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const ubicacionesPath = path.join(__dirname, '../shared/catalogs/ubicaciones.json');
    const ubicacionesData = JSON.parse(fs.readFileSync(ubicacionesPath, 'utf8'));

    // Conectar a la base de datos
    await connectDB();

    // Verificar si ya existen departamentos
    const existingDepartments = await Departamento.countDocuments();

    if (existingDepartments === 0) {
      console.log('Cargando departamentos...');
      
      // Convertir los datos al formato del schema
      const departmentsToInsert = ubicacionesData.data.map(dept => ({
        id: dept.id,
        code: dept.code,
        name: dept.name,
        municipios: dept.municipios.map(municipio => ({
          id: municipio.id,
          code: municipio.code,
          name: municipio.name
        }))
      }));

      // Insertar los departamentos
      await Departamento.insertMany(departmentsToInsert);

      // Verificar que se insertaron correctamente
      const insertedDepartments = await Departamento.countDocuments();
      console.log(`Departamentos insertados: ${insertedDepartments}`);
    } else {
      console.log('Los departamentos ya existen en la base de datos');
    }

    // Si ya existían departamentos o se insertaron correctamente
    const response = {
      success: true,
      message: 'Departamentos disponibles'
    };

    console.log('Departamentos cargados exitosamente');
    return response;
  } catch (error) {
    console.error('Error al cargar departamentos:', error);
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
if (import.meta.url.includes('cargardepartamentos.test.js')) {
  cargarDepartamentos()
    .then(result => {
      console.log('Resultado:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
