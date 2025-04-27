import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const { signup, isAuthenticated, errors: RegisterError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks')
    }
  }, [isAuthenticated])

  const onSubmit = async (values) => {
    signup(values)
  }

  return (
    <section className='bg-zinc-800 max-w-md p-10 rounded-md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {RegisterError && (
          <span className='text-red-500 text-sm'>{RegisterError}</span>
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
          className='bg-blue-500 text-white px-4 py-2 rounded-md'
        >
          Registrar
        </button>
      </form>
    </section>
  )
}

export default RegisterPage
