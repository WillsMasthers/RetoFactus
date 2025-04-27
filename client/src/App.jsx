import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar con diseño moderno */}
        <nav className='bg-zinc-800 p-4 shadow-lg'>
          <div className='container mx-auto flex justify-between items-center'>
            <div className='text-xl font-bold text-white'>
              <Link to='/'>TaskApp</Link>
            </div>
            <div className='space-x-4'>
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
                    Bienvenido a TaskApp
                  </h1>
                  <p className='text-gray-600'>
                    Gestiona tus tareas de manera eficiente
                  </p>
                </div>
              }
            />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route
              path='/tasks'
              element={
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Tasks Page
                  </h1>
                </div>
              }
            />
            <Route
              path='/add-task'
              element={
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Add Task
                  </h1>
                </div>
              }
            />
            <Route
              path='/tasks/:id'
              element={
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Update Task
                  </h1>
                </div>
              }
            />
            <Route
              path='/profile'
              element={
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h1 className='text-2xl font-bold text-zinc-800 mb-4'>
                    Profile
                  </h1>
                </div>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
