// Construye los parámetros de filtro para facturas a partir de un objeto de filtros
export function buildFacturasFilters(filters = {}) {
  const params = {}
  if (filters.identification)
    params['filter[identification]'] = filters.identification
  if (filters.names) params['filter[names]'] = filters.names
  if (filters.number) params['filter[number]'] = filters.number
  if (filters.prefix) params['filter[prefix]'] = filters.prefix
  if (filters.reference_code)
    params['filter[reference_code]'] = filters.reference_code
  if (filters.status !== undefined) params['filter[status]'] = filters.status
  if (filters.page) params['page'] = filters.page
  return params
}
