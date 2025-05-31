import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const NotFound = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Volver atrás
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound 