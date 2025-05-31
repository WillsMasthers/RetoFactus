import mongoose from 'mongoose'

// Esquema para departamento
const departamentoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  municipios: [{
    id: Number,
    code: String,
    name: String
  }]
})

// Esquema para municipio
const municipioSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

// Exportar los esquemas
export { departamentoSchema, municipioSchema }
