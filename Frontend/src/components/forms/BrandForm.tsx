import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/common/Button'
import { InputField } from '@/components/componentesForm/InputField'
import { TextareaField } from '@/components/componentesForm/TextareaField'
import { Label } from '@/components/common/Label'
import { type Brand } from '@/services/brandService'


const brandFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  is_active: z.boolean().default(true)
})

type BrandFormValues = z.infer<typeof brandFormSchema>

interface BrandFormProps {
  initialData?: Brand | null
  onSubmit: (data: BrandFormValues) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function BrandForm({ initialData, onSubmit, onCancel, isLoading }: BrandFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      is_active: initialData?.is_active ?? true
    }
  })

  const isActive = watch('is_active')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <InputField
          label="Nombre *"
          id="name"
          placeholder="Ej: Nike, Adidas, etc."
          {...register('name')}
          error={!!errors.name}
          errorMessage={errors.name?.message}
          disabled={isLoading}
        />

        <TextareaField
          label="Descripción"
          id="description"
          placeholder="Descripción opcional de la marca"
          rows={3}
          {...register('description')}
          error={!!errors.description}
          errorMessage={errors.description?.message}
          disabled={isLoading}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setValue('is_active', e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2">
            {isActive ? 'Activo' : 'Inactivo'}
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
