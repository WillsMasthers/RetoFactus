import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/authStore'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return (
    <BrowserRouter>
      {/* Navbar con diseño moderno */}
      <nav className='bg-zinc-800 p-4 shadow-lg'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='text-xl font-bold text-white'>
            <Link to='/'>RetoFactus</Link>
          </div>
          <div className='space-x-4'>
            {!isAuthenticated ? (
              <>
                <Link
                  to='/login'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to='/tasks'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Tasks
                </Link>
                <Link
                  to='/profile'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Contenedor principal */}
      <main className='container mx-auto mt-8 px-4'>
        <Routes>
          <Route
            path='/'
            element={
              <div className='text-center'>
                <h1 className='text-4xl font-bold text-zinc-800 mb-4'>
                  Bienvenido a RetoFactus
                </h1>
                <p className='text-gray-600'>
                  Gestiona tus facturas de manera eficiente.
                </p>
              </div>
            }
          />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route
            path='/tasks'
            element={
              <ProtectedRoute>
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Tasks Page
                  </h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path='/add-task'
            element={
              <ProtectedRoute>
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Add Task
                  </h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path='/tasks/:id'
            element={
              <ProtectedRoute>
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Update Task
                  </h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Profile
                  </h1>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
