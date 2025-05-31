export interface Company {
  id?: string;
  nit: string;
  dv: string;
  name?: string; // nombre_comercial
  razon_social: string;
  nombre_comercial: string;
  direccion: string;
  telefono: string;
  email: string;
  pais: string;
  departamento: string;
  ciudad: string;
  codigo_postal: string;
  actividad_economica?: string;
  matricula_mercantil?: string;
  tipo_documento: string;
  url_logo?: string;
  representacion_grafica?: string;
  // Campos opcionales para compatibilidad
  company?: string;
  phone?: string;
  address?: string;
  municipality?: string;
  graphic_representation_name?: string;
  registration_code?: string;
  economic_activity?: string;
  direction?: string;
  department?: string;
  country?: string | null;
}

export interface Municipio {
  id: number;
  name: string;
}
