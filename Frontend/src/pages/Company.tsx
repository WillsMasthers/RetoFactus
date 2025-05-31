import React from 'react'
import { useState, useEffect } from 'react'
import { Button, Title } from '@tremor/react'
import Card from '../components/common/Card'

import { useAlmacenEmpresas } from '../store/companyStorage'
import { useAuth } from '../hooks/useAuth'
import { Company, MyCompany, companyToMyCompany, myCompanyToCompany } from '../types/company'
import Header from '../components/Header'
import { SelectNative } from '../components/SelectNative'
import { InputField } from '../components/componentesForm/InputField'
import { SelectField } from '../components/componentesForm/SelectField'
import paisesData from '../data/paises.json'
import ubicacionesData from '../data/ubicaciones.json'
import Footer from '../components/Footer'
import { TAX_CATALOG } from '../data/taxCatalog'
import taxesData from '../data/taxes.json'

// Definir la interfaz Tax
interface Tax {
  id: number
  code: string    // '01' para IVA, '05' para ReteIVA, '06' para ReteRenta
  name: string    // 'IVA', 'ReteIVA', 'ReteRenta'
  rate: number    // 19, 5, 0 para IVA; 15 para ReteIVA; 7 para ReteRenta
}

// Definir la interfaz FormData localmente
interface FormData {
  identification: {
    nit: string
    dv: string
    document_type: string
  }
  name: {
    company: string
    commercial: string
    graphic_representation: string
    registration: {
      code: string
      economic_activity: string
    }
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
  billing_config?: {
    invoice_prefix?: string
    invoice_resolution?: string
    invoice_start_number?: number
    invoice_end_number?: number
    invoice_current_number?: number
    invoice_notes?: string
    payment_terms?: string
    payment_methods?: string[]
    taxes?: string[]
  }
  // Campos adicionales para compatibilidad
  tipo_documento?: string
  razon_social?: string
  nombre_comercial?: string
  email?: string
  telefono?: string
  direccion?: string
  pais?: string
  departamento?: string
  ciudad?: string
  codigo_postal?: string
  url_logo?: string
}

// Definir la interfaz para Municipio localmente ya que hay un conflicto con la importación
interface LocalMunicipio {
  id: number
  name: string
  code: string
}

// Definir la interfaz para Departamento localmente
interface LocalDepartamento {
  id: number
  code: string
  name: string
  municipios: LocalMunicipio[]
}

const departamentos: LocalDepartamento[] = [
  {
    id: 1,
    code: '54',
    name: 'Norte de Santander',
    municipios: [
      { id: 1, name: 'Cúcuta', code: '54001' },
    ]
  }
]

// Agregar después de las otras interfaces
interface Pais {
  id: number
  code: string
  name: string
}

const paises: Pais[] = (paisesData as PaisesData).paises

// 1. Primero definimos las interfaces necesarias
interface Municipio {
  id: number
  code: string
  name: string
}

interface Departamento {
  id: number
  code: string
  name: string
  municipios: Municipio[]
}

interface Ubicaciones {
  data: Departamento[]
}

const Company = () => {
  const [darkMode, setDarkMode] = React.useState(false)
  // 1. Estados básicos
  const [formData, setFormData] = useState<MyCompany>({
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
    url_logo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [logoList, setLogoList] = useState<Logo[]>([])
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState<Municipio[]>([])

  // 2. Obtener datos del store
  const { user } = useAuth()
  const { empresaActual, obtenerEmpresas, actualizarEmpresa } = useAlmacenEmpresas()

  // 3. Cargar datos iniciales
  useEffect(() => {
    if (!user?.id) return
    obtenerEmpresas()
  }, []) // Solo al montar

  // 4. Actualizar formulario cuando cambia empresaActual
  useEffect(() => {
    if (!empresaActual) {
      console.log('No hay empresa actual')
      return
    }

    // console.log('Datos de empresa recibidos:', empresaActual)
    const formattedData = companyToMyCompany(empresaActual)
    // console.log('Datos formateados para el formulario:', formattedData)

    setFormData(formattedData)
    setLogoPreview(formattedData.url_logo)
  }, [empresaActual])

  // 5. Manejadores de eventos simples
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLogoId = e.target.value
    alert(`Logo seleccionado: ${selectedLogoId}`)
  }

  const handleTaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    setFormData(prev => ({
      ...prev,
      billing_configuration: {
        ...prev.billing_configuration,
        taxes: [
          ...(prev.billing_configuration?.taxes?.filter(t => !t.startsWith('01')) || []),
          ...(value ? [`01-${value}`] : [])
        ]
      }
    }))
  }

  const handleRetentionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value)

    setFormData(prev => ({
      ...prev,
      billing_configuration: {
        ...prev.billing_configuration,
        taxes: [
          ...(prev.billing_configuration?.taxes?.filter(t => !t.startsWith('05') && !t.startsWith('06')) || []),
          ...values.map(code => `${code}-${code === '05' ? '15' : '7'}`)
        ]
      }
    }))
  }

  // 6. Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Verificar que exista empresaActual y su ID
      if (!empresaActual?._id) {
        throw new Error('No se encuentra el ID de la empresa')
      }

      // Asegurar que los taxes están en el formato correcto
      const formattedTaxes = formData.billing_configuration?.taxes?.filter(Boolean).map(tax => {
        if (typeof tax === 'string') return tax
        return `${tax.code}-${tax.rate}`
      }) || []

      const dataToSend = {
        ...formData,
        billing_configuration: {
          ...formData.billing_configuration,
          taxes: formattedTaxes
        }
      }

      console.log('Datos a enviar:', dataToSend)
      await actualizarEmpresa(empresaActual._id, dataToSend)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error al actualizar:', error)
      setError(error instanceof Error ? error.message : 'Error al actualizar los datos de la empresa')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 7. Efecto para actualizar municipios filtrados
  useEffect(() => {
    if (!formData.departamento) {
      setMunicipiosFiltrados([])
      return
    }

    const departamentoSeleccionado = (ubicacionesData as Ubicaciones).data.find(
      dep => dep.code === formData.departamento
    )

    if (departamentoSeleccionado) {
      setMunicipiosFiltrados(departamentoSeleccionado.municipios)
    } else {
      setMunicipiosFiltrados([])
    }
  }, [formData.departamento])

  // 8. Renderizado del formulario
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <form onSubmit={handleSubmit}>
            {/* Mensajes de éxito y error */}
            <div className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">Los cambios se han guardado correctamente</span>
                </div>
              )}
            </div>

            <section className="space-y-6">
              <div>
                <Title>Información Básica</Title>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Logo de la Empresa
                    </label>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Vista previa del logo */}
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo seleccionado"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 text-gray-400">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selector de logo */}
                      <div className="flex-1">
                        <div className="relative">
                          <SelectNative
                            name="logo_selector"
                            value={logoList.find(logo => logo.url === formData?.logo?.url)?.id || ''}
                            onChange={handleLogoChange}
                            className="w-full"
                          >
                            <option value="" disabled>
                              Seleccionars logo
                            </option>
                            {logoList.map((logo) => (
                              <option key={logo.id} value={logo.id}>
                                {logo.title}
                              </option>
                            ))}
                          </SelectNative>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Selecciona un logo de la lista
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-6">
                  <div className='w-full md:w-5/6'>
                    <InputField
                      label="NIT"
                      name="nit"
                      value={formData.nit}
                      onChange={handleInputChange}
                      placeholder="Ingrese el NIT"
                    />
                  </div>
                  <div className='w-full md:w-1/6'>
                    <InputField
                      label="DV"
                      name="dv"
                      value={formData.dv}
                      onChange={handleInputChange}
                      placeholder="DV"
                    />
                  </div>
                </div>

                <div className='mt-4'>
                  <InputField
                    label="Razón Social"
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleInputChange}
                    placeholder="Ingrese la razón social"
                  />
                </div>

                <div className='mt-4'>
                  <InputField
                    label="Nombre Comercial"
                    name="nombre_comercial"
                    value={formData.nombre_comercial}
                    onChange={handleInputChange}
                    placeholder="Ingrese el nombre comercial"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <Title>Información de Contacto</Title>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <InputField
                      label="Teléfono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Ingrese el teléfono"
                    />
                  </div>
                  <div>
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ingrese el email"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <Title>Información de Ubicación</Title>
                <div className="mt-4">
                  <InputField
                    label="Dirección"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Ingrese la dirección"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <SelectField
                      label="País"
                      name="pais"
                      value={formData.pais}
                      onChange={handleSelectChange}
                      options={paises.map(pais => ({
                        value: pais.code,
                        label: pais.name
                      }))}
                    />
                  </div>
                  <div>
                    <SelectField
                      label="Departamento"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleSelectChange}
                      disabled={formData.pais !== 'CO'}
                      options={departamentos.map(dept => ({
                        value: dept.code,
                        label: dept.name
                      }))}
                    />
                  </div>
                  <div>
                    <SelectField
                      label="Ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleSelectChange}
                      disabled={!formData.departamento}
                      options={municipiosFiltrados.map(mun => ({
                        value: mun.code,
                        label: mun.name
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <InputField
                    label="Código Postal"
                    name="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={handleInputChange}
                    placeholder="Ingrese el código postal"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <Title>Información de Impuestos</Title>
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo de IVA */}
                    <div>
                      <SelectField
                        label="IVA"
                        name="billing_configuration.taxes.iva"
                        value={formData.billing_configuration?.taxes?.[0] || ''}
                        onChange={(e) => {
                          const { value } = e.target
                          setFormData(prev => ({
                            ...prev,
                            billing_configuration: {
                              ...prev.billing_configuration,
                              taxes: value ? [value] : []
                            }
                          }))
                        }}
                        options={[
                          { value: '', label: 'Seleccione IVA' },
                          ...taxesData.iva.rates.map(rate => ({
                            value: rate.code,
                            label: rate.description
                          }))
                        ]}
                      />
                    </div>
                    {/* Campo de Retenciones */}
                    <div>
                      <SelectField
                        label="Retenciones"
                        name="billing_configuration.taxes.retentions"
                        value={formData.billing_configuration?.taxes?.slice(1) || []}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value)
                          setFormData(prev => ({
                            ...prev,
                            billing_configuration: {
                              ...prev.billing_configuration,
                              taxes: [
                                prev.billing_configuration?.taxes?.[0] || '',
                                ...values
                              ].filter(Boolean)
                            }
                          }))
                        }}
                        options={taxesData.retenciones.map(ret => ({
                          value: ret.code,
                          label: ret.description
                        }))}
                        multiple
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  color="blue"
                  className="px-6 py-2 text-sm font-medium w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </section>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
export default Company