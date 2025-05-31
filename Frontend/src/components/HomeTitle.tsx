import { LogoTitle } from './common/LogoTitle'

export const HomeTitle = () => {
  return (
    <div className="text-center mb-8">
      <LogoTitle />
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Sistema Punto de Venta (POS) con Integración de Facturación Electrónica
      </p>
      <span className='dark:text-slate-500'>
        Diseñado para optimizar la gestión de ventas, inventario y pagos en tiempo real. Además de facilitar las operaciones comerciales diarias, este sistema permite la emisión y validación de facturas electrónicas cumpliendo con los requisitos de la DIAN, mediante una conexión segura y automatizada con el servicio API FACTUS.
      </span>
    </div>
  )
} 