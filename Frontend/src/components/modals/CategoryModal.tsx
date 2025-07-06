import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/common/Button'
import { InputField } from '@/components/componentesForm/InputField'
import { TextareaField } from '@/components/componentesForm/TextareaField'
import { SelectField } from '@/components/componentesForm/SelectField'
import { useCategoryForm } from '@/hooks/useCategories'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/inventory/category.types'
import { Label } from '@/components/Label'

// Esquema de validación con Zod
const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  parent_id: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  parentId?: string | null
  onSuccess?: (category: Category) => void
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  parentId,
  onSuccess,
}) => {
  const { isSubmitting, error, handleSubmit } = useCategoryForm(handleSuccess)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      parent_id: parentId || null,
      is_active: true,
      metadata: {},
    },
  })

  // Resetear el formulario cuando se abre/cierra el modal o cambia la categoría
  useEffect(() => {
    if (isOpen) {
      if (category) {
        // Editar categoría existente
        form.reset({
          name: category.name,
          description: category.description || '',
          parent_id: category.parent_id,
          is_active: category.is_active,
          metadata: category.metadata || {},
        })
      } else {
        // Nueva categoría
        form.reset({
          name: '',
          description: '',
          parent_id: parentId || null,
          is_active: true,
          metadata: {},
        })
      }
    }
  }, [isOpen, category, form, parentId])

  // Manejar el envío exitoso del formulario
  function handleSuccess(createdOrUpdatedCategory: Category) {
    toast.success(
      category
        ? 'Categoría actualizada correctamente'
        : 'Categoría creada correctamente'
    )
    onSuccess?.(createdOrUpdatedCategory)
    onClose()
  }

  // Manejar el envío del formulario
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        // Actualizar categoría existente
        await handleSubmit(data as UpdateCategoryDto, category.uuid)
      } else {
        // Crear nueva categoría
        await handleSubmit(data as CreateCategoryDto)
      }
    } catch (err) {
      // El error ya se maneja en el hook useCategoryForm
      console.error('Error al guardar la categoría:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm">
              {error.message}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              id="name"
              label="Nombre"
              type="text"
              value={form.watch('name')}
              onChange={(e) => form.setValue('name', e.target.value)}
              placeholder="Nombre de la categoría"
              disabled={isSubmitting}
              error={form.formState.errors.name?.message}
            />

            <TextareaField
              id="description"
              label="Descripción (opcional)"
              value={form.watch('description') || ''}
              onChange={(e) => form.setValue('description', e.target.value)}
              placeholder="Descripción de la categoría"
              disabled={isSubmitting}
              rows={3}
              error={form.formState.errors.description?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="is_active">Estado</Label>
              <SelectField
                label="Estado"
                id="is_active"
                options={[
                  { value: 'true', label: 'Activo' },
                  { value: 'false', label: 'Inactivo' }
                ]}
                value={form.watch('is_active') ? 'true' : 'false'}
                onChange={(e) => form.setValue('is_active', e.target.value === 'true')}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="warning"
                mode="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CategoryModal
