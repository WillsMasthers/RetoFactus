export const TAX_CATALOG = {
  IVA: {
    code: '01',
    name: 'IVA',
    rates: [
      { value: 19, code: '01-19', description: 'IVA 19%' },
      { value: 5, code: '01-05', description: 'IVA 5%' },
      { value: null, code: '01-EX', description: 'Excluido de IVA' }
    ]
  },
  RETENCIONES: [
    {
      code: '05',
      name: 'ReteIVA',
      value: 15,
      description: 'Retención IVA 15%'
    },
    {
      code: '06',
      name: 'ReteRenta',
      value: 7,
      description: 'Retención en la Fuente 7%'
    }
  ]
}
