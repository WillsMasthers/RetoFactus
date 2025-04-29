export const FACTUS_CONFIG = {
  API_URL: process.env.FACTUS_API_URL || 'https://api-sandbox.factus.com.co',
  ENDPOINTS: {
    TOKEN: '/oauth/token',
    INVOICE: '/v2/invoice',
    FACTURAS: '/v2/facturas'
  }
}
