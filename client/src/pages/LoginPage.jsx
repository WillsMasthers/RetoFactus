import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const signin = useAuthStore((state) => state.signin)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const authErrors = useAuthStore((state) => state.errors)

  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated])

  const onSubmit = async (values) => {
    signin(values)
  }

  return (
    <section className='bg-zinc-800 max-w-md p-10 rounded-md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type='text'
          {...register('emailOrUsername', {
            required: {
              value: true,
              message: 'El usuario o correo electrónico es requerido'
            }
          })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='Usuario o correo electrónico'
        />
        {errors.emailOrUsername && (
          <span className='text-red-500 text-sm'>
            {errors.emailOrUsername.message}
          </span>
        )}
        {authErrors && authErrors.includes('Usuario no encontrado') && (
          <span className='text-red-500 text-sm'>{authErrors}</span>
        )}

        <input
          type='password'
          {...register('password', {
            required: {
              value: true,
              message: 'La contraseña es requerida'
            },
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres'
            }
          })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='Contraseña'
        />
        {errors.password && (
          <span className='text-red-500 text-sm'>
            {errors.password.message}
          </span>
        )}
        {authErrors && authErrors.includes('Contraseña incorrecta') && (
          <span className='text-red-500 text-sm'>{authErrors}</span>
        )}

        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md my-2 w-full'
        >
          Iniciar sesión
        </button>
      </form>
    </section>
  )
}

export default LoginPage
