import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const signup = useAuthStore((state) => state.signup)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const authErrors = useAuthStore((state) => state.errors)

  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated])

  const onSubmit = async (values) => {
    const result = await signup(values)
    if (!authErrors) {
      navigate('/login')
    }
  }

  return (
    <section className='bg-zinc-800 max-w-md p-10 rounded-md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {authErrors && (
          <span className='text-red-500 text-sm'>{authErrors}</span>
        )}

        <input
          type='text'
          {...register('username', { required: true })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='Nombre de usuario'
        />
        {errors.username && (
          <span className='text-red-500 text-sm'>Este campo es requerido</span>
        )}

        <input
          type='email'
          {...register('email', { required: true })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='Correo electrónico'
        />
        {errors.email && (
          <span className='text-red-500 text-sm'>Este campo es requerido</span>
        )}

        <input
          type='password'
          {...register('password', { required: true })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='Contraseña'
        />
        {errors.password && (
          <span className='text-red-500 text-sm'>Este campo es requerido</span>
        )}

        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md my-2'
        >
          Registrarse
        </button>
      </form>
    </section>
  )
}

export default RegisterPage
