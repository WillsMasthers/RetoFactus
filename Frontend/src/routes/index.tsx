import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import App from '../App'
import { Loading } from '../components/Loading'
import Tickets from '../pages/Tickets'

// Componentes cargados perezosamente
const Login = lazy(() => import('../pages/Login'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Company = lazy(() => import('../pages/Company'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Invoices = lazy(() => import('../pages/Invoices'))
const Sales = lazy(() => import('../pages/Sales'))
const InvoiceDetails = lazy(() => import('../pages/InvoiceDetails'))
const Components = lazy(() => import('../pages/Components'))
const PageTemplate = lazy(() => import('../pages/PageTemplate'))
const InventoryLayout = lazy(() => import('../layouts/Inventory.Layouts'))
const ProductsPage = lazy(() => import('../pages/inventory/Products'))
const CategoriesPage = lazy(() => import('../pages/inventory/Categories'))
const BrandsPage = lazy(() => import('../pages/inventory/Brands'))

// Configuración de rutas con lazy loading
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/components',
    element: (
      <Suspense fallback={<Loading />}>
        <Components />
      </Suspense>
    )
  },
  {
    path: '/template',
    element: (
      <Suspense fallback={<Loading />}>
        <PageTemplate title="Página de Ejemplo" description="Esta es una página de ejemplo usando el template">
          <div>Contenido de ejemplo</div>
        </PageTemplate>
      </Suspense>
    )
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/mi-empresa',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Company />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/invoices',
    element: (
      <Suspense fallback={<Loading />}>
        <Invoices />
      </Suspense>
    )
  },
  {
    path: '/invoice/:invoiceNumber',
    element: (
      <Suspense fallback={<Loading />}>
        <InvoiceDetails />
      </Suspense>
    ),
    children: [
      {
        path: 'view',
        element: (
          <Suspense fallback={<Loading />}>
            <InvoiceDetails />
          </Suspense>
        )
      },
      {
        path: 'pdf',
        element: (
          <Suspense fallback={<Loading />}>
            <InvoiceDetails />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/tickets',
    element: (
      <Suspense fallback={<Loading />}>
        <Tickets />
      </Suspense>
    )
  },
  {
    path: '/sales',
    element: (
      <Suspense fallback={<Loading />}>
        <Sales />
      </Suspense>
    )
  },
  {
    path: '/inventory',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading />}>
          <InventoryLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <ProductsPage />
          </Suspense>
        )
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<Loading />}>
            <ProductsPage />
          </Suspense>
        )
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<Loading />}>
            <CategoriesPage />
          </Suspense>
        )
      },
      {
        path: 'brands',
        element: (
          <Suspense fallback={<Loading />}>
            <BrandsPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    )
  }
])

export default router