import { z } from 'zod'

// Schema para la configuración de facturación
const configuracionFacturacionSchema = z.object({
  prefijo_factura: z.string().optional(),
  resolucion_dian: z.string().optional(),
  fecha_resolucion: z.string().optional(),
  rango_inicial: z.number().optional(),
  rango_final: z.number().optional(),
  fecha_vencimiento: z.string().optional()
})

// Schema para la empresa
export const companySchema = z.object({
  nit: z.string({
    required_error: 'El NIT es requerido'
  }),
  dv: z.string().optional(),
  razon_social: z.string({
    required_error: 'La razón social es requerida'
  }),
  direccion: z.string({
    required_error: 'La dirección es requerida'
  }),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  ciudad: z.string({
    required_error: 'La ciudad es requerida'
  }),
  departamento: z.string({
    required_error: 'El departamento es requerido'
  }),
  codigo_postal: z.string().optional(),
  configuracion_facturacion: configuracionFacturacionSchema.optional()
})

// Schema para el registro de usuario
export const registerSchema = z.object({
  username: z
    .string({
      required_error: 'El nombre de usuario es requerido'
    })
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido').optional(),
  password: z
    .string({
      required_error: 'La contraseña es requerida'
    })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z
    .string({
      required_error: 'El nombre es requerido'
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  // Si se incluye información de empresa, validarla
  empresa: companySchema.optional(),
  rol_global: z
    .enum(['super_admin', 'admin', 'usuario'])
    .optional()
    .default('usuario')
})

// Schema para el login
export const loginSchema = z.object({
  username: z.string({
    required_error: 'El nombre de usuario es requerido'
  }),
  password: z.string({
    required_error: 'La contraseña es requerida'
  })
})

// Schema para actualizar usuario
export const updateUserSchema = z.object({
  nombre: z.string().optional(),
  email: z.string().email().optional(),
  empresa_actual: z.string().optional(),
  rol_global: z.enum(['super_admin', 'admin', 'usuario']).optional(),
  activo: z.boolean().optional()
})

// Schema para actualizar empresa
export const updateCompanySchema = z.object({
  razon_social: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  ciudad: z.string().optional(),
  departamento: z.string().optional(),
  codigo_postal: z.string().optional(),
  configuracion_facturacion: configuracionFacturacionSchema.optional(),
  activa: z.boolean().optional()
})
