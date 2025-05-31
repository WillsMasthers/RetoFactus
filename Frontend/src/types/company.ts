// Interfaz para los datos que vienen del backend
export interface Company {
  _id?: string
  identification: {
    nit: string
    dv: string
    document_type: string
  }
  name: {
    registration: {
      code: string
      economic_activity: string
    }
    company: string
    commercial: string
    graphic_representation: string
  }
  contact: {
    email: string
    phone: string
  }
  location: {
    country: string
    department: string
    municipality: string
    address: string
    postal_code: string
  }
  logo: {
    url: string
    public_id?: string
  }
  billing_configuration?: {
    payment_methods: string[]
    taxes: string[]
  }
  administrador?: {
    _id: string
    username: string
    firstName: string
    lastName: string
  }
  usuarios?: string[]
  is_active?: boolean
  createdAt?: string
  updatedAt?: string
  __v?: number
}

// Interfaz para el formulario
export interface MyCompany {
  nit: string
  dv: string
  document_type: string
  razon_social: string
  nombre_comercial: string
  email: string
  telefono: string
  direccion: string
  pais: string
  departamento: string
  ciudad: string
  codigo_postal: string
  url_logo: string
  logo?: {
    url: string
    public_id?: string
  }
  billing_configuration?: {
    invoice_prefix?: string
    invoice_resolution?: string
    invoice_start_number?: number
    invoice_end_number?: number
    invoice_current_number?: number
    invoice_notes?: string
    payment_terms?: string
    payment_methods?: string[]
    taxes?: Tax[] // Agregamos el array de impuestos
  }
}

// Función auxiliar para convertir de Company a MyCompany
export const companyToMyCompany = (
  company: Company | null | undefined
): MyCompany => {
  // Primero verificamos si tenemos datos
  if (!company) {
    console.log('No hay datos de empresa')
    return getDefaultValues()
  }

  // Verificamos que tengamos todas las estructuras necesarias
  if (
    !company.identification ||
    !company.name ||
    !company.contact ||
    !company.location
  ) {
    console.warn('Estructura de empresa incompleta:', company)
    return getDefaultValues()
  }

  // console.log('Convirtiendo datos de empresa:', {
  //   nit: company.identification.nit,
  //   dv: company.identification.dv
  // })

  // Convertimos los datos asegurándonos que existan
  const myCompany: MyCompany = {
    nit: company.identification.nit || '',
    dv: company.identification.dv || '',
    document_type: company.identification.document_type || 'NIT',
    razon_social: company.name.company || '',
    nombre_comercial: company.name.commercial || '',
    email: company.contact.email || '',
    telefono: company.contact.phone || '',
    direccion: company.location.address || '',
    pais: company.location.country || '',
    departamento: company.location.department || '',
    ciudad: company.location.municipality || '',
    codigo_postal: company.location.postal_code || '',
    url_logo: company.logo?.url || '',
    logo: company.logo || undefined,
    billing_configuration: company.billing_configuration
      ? {
          payment_methods: company.billing_configuration.payment_methods || [],
          taxes:
            company.billing_configuration.taxes?.map((code) => ({
              id: code === '01' ? 1 : code === '05' ? 5 : 6,
              code,
              name:
                code === '01' ? 'IVA' : code === '05' ? 'ReteIVA' : 'ReteRenta',
              rate: code === '01' ? 19 : code === '05' ? 15 : 7
            })) || []
        }
      : undefined
  }

  // console.log('Datos convertidos para el formulario:', myCompany)
  return myCompany
}

// Función auxiliar para valores por defecto
const getDefaultValues = (): MyCompany => ({
  nit: '',
  dv: '',
  document_type: 'NIT',
  razon_social: '',
  nombre_comercial: '',
  email: '',
  telefono: '',
  direccion: '',
  pais: '',
  departamento: '',
  ciudad: '',
  codigo_postal: '',
  url_logo: '',
  logo: undefined
})

// Función auxiliar para convertir de MyCompany a Company
export const myCompanyToCompany = (data: MyCompany): Partial<Company> => {
  const companyData: Partial<Company> = {
    identification: {
      nit: data.nit,
      dv: data.dv,
      document_type: data.document_type || 'NIT'
    },
    name: {
      company: data.razon_social,
      commercial: data.nombre_comercial,
      graphic_representation: data.nombre_comercial,
      registration: {
        code: '',
        economic_activity: ''
      }
    },
    contact: {
      email: data.email,
      phone: data.telefono
    },
    location: {
      country: data.pais,
      department: data.departamento,
      municipality: data.ciudad,
      address: data.direccion,
      postal_code: data.codigo_postal
    },
    logo: {
      url: data.logo?.url || data.url_logo
    }
  }

  // Agregamos billing_configuration siempre
  companyData.billing_configuration = {
    payment_methods: data.billing_configuration?.payment_methods || [],
    taxes: data.billing_configuration?.taxes?.map((tax) => tax.code) || []
  }

  return companyData
}

// Nuevas interfaces para la configuración de facturación
interface Tax {
  id: number
  code: string
  name: string
  rate: number
}

interface BillingConfiguration {
  taxes: Tax[]
  // ...otros campos de facturación
}

interface CompanyFormData {
  // ...campos existentes
  billing_configuration?: BillingConfiguration
}
