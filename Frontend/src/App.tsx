import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Header from './components/Header'
import { NoHeader } from './components/NoHeader'
import { Routes, Route } from 'react-router-dom'
import { TechStack } from './components/TechStack'
import Card from './components/common/Card'
import { HomeTitle } from './components/HomeTitle'
import { useNavigate } from 'react-router-dom'

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col">
        {isAuthenticated ? <Header /> : <NoHeader />}
        <div className="flex-1">
          <div className="p-4">
            <Routes>
              <Route path="/" element={
                <div className="w-full max-w-4xl mx-auto p-8">
                  <HomeTitle />
                  <Card className='p-8'>
                    <TechStack />
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      >
                        {isAuthenticated ? 'Ir al Dashboard' : 'Iniciar Sesión'}
                      </button>
                    </div>
                  </Card>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
