// Tipos base

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  rol?: 'admin' | 'usuario' | 'contador';
  activo?: boolean;
  empresas?: Array<{
    empresa: string | Company;
    rol: 'admin' | 'usuario' | 'contador';
    activo: boolean;
  }>;
  empresa_actual?: string | Company;
}

export interface Company {
  _id: string;
  identification: {
    nit: string;
    dv: string;
    document_type: string;
  };
  name: {
    company: string;
    commercial: string;
    graphic_representation: string;
    registration: {
      code: string;
      economic_activity: string;
    };
  };
  contact: {
    email: string;
    phone: string;
  };
  location: {
    country: string;
    department?: string;
    municipality?: string;
    address: string;
    postal_code?: string;
  };
  logo: {
    url: string;
  };
  billing_config: {
    invoice_prefix: string;
    invoice_resolution: string;
    invoice_start_number: number;
    invoice_end_number: number;
    invoice_current_number: number;
    invoice_notes: string;
    payment_terms: string;
    payment_methods: string[];
    taxes: string[];
  };
  administrador: string | User;
  usuarios: (string | User)[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos para las respuestas de la API

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface CompanyResponse extends ApiResponse<Company> {
  data?: Company;
}

export interface CompaniesResponse extends ApiResponse<Company[]> {
  data?: Company[];
}

export interface UsersResponse extends ApiResponse<User[]> {
  data?: User[];
}

// Tipos para los formularios

export interface CompanyFormData {
  nit: string;
  razon_social: string;
  direccion: string;
  telefono: string;
  email: string;
  pais: string;
  departamento?: string;
  ciudad?: string;
  tipo_documento: string;
  codigo_postal?: string;
}

export interface AddUserToCompanyData {
  userId: string;
  rol: 'admin' | 'usuario' | 'contador';
}

export interface UpdateUserRoleData {
  rol: 'admin' | 'usuario' | 'contador';
}

export interface SwitchCompanyData {
  companyId: string;
}
