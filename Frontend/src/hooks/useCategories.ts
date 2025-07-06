import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type {
  Category,
  CategoryTreeNode,
  CreateCategoryDto,
  UpdateCategoryDto
} from '../types/inventory/category.types'
import {
  getCategories,
  getCategoryTree,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  moveCategory
} from '../services/categoryService'

interface UseCategoriesOptions {
  fetchOnMount?: boolean
  includeTree?: boolean
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const { fetchOnMount = true, includeTree = false } = options
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Cargar categorías planas
  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCategories()
      setCategories(data)
      return data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error('Error al cargar las categorías', {
        description: error.message
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar árbol de categorías
  const fetchCategoryTree = useCallback(async () => {
    if (!includeTree) return []

    setIsLoading(true)
    setError(null)
    try {
      const tree = await getCategoryTree()
      setCategoryTree(tree)
      return tree
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error('Error al cargar el árbol de categorías', {
        description: error.message
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [includeTree])

  // Cargar una categoría por ID
  const fetchCategoryById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const category = await getCategoryById(id)
      setSelectedCategory(category)
      return category
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error('Error al cargar la categoría', {
        description: error.message
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Crear una nueva categoría
  const addCategory = useCallback(
    async (categoryData: CreateCategoryDto) => {
      setIsLoading(true)
      setError(null)
      try {
        const newCategory = await createCategory(categoryData)
        setCategories((prev) => [...prev, newCategory])

        if (includeTree) {
          await fetchCategoryTree()
        } else {
          await fetchCategories()
        }

        toast.success('Categoría creada exitosamente')
        return newCategory
      } catch (err) {
        const error = err as Error
        setError(error)
        toast.error('Error al crear la categoría', {
          description: error.message
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCategories, fetchCategoryTree, includeTree]
  )

  // Actualizar una categoría existente
  const editCategory = useCallback(
    async (id: string, categoryData: UpdateCategoryDto) => {
      setIsLoading(true)
      setError(null)
      try {
        const updatedCategory = await updateCategory(id, categoryData)
        setCategories((prev) =>
          prev.map((cat) => (cat.uuid === id ? updatedCategory : cat))
        )

        if (selectedCategory?.uuid === id) {
          setSelectedCategory(updatedCategory)
        }

        if (includeTree) {
          await fetchCategoryTree()
        }

        toast.success('Categoría actualizada exitosamente')
        return updatedCategory
      } catch (err) {
        const error = err as Error
        setError(error)
        toast.error('Error al actualizar la categoría', {
          description: error.message
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCategoryTree, includeTree, selectedCategory]
  )

  // Eliminar una categoría
  const removeCategory = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        await deleteCategory(id)
        setCategories((prev) => prev.filter((cat) => cat.uuid !== id))

        if (selectedCategory?.uuid === id) {
          setSelectedCategory(null)
        }

        if (includeTree) {
          await fetchCategoryTree()
        }

        toast.success('Categoría eliminada exitosamente')
        return true
      } catch (err) {
        const error = err as Error
        setError(error)
        toast.error('Error al eliminar la categoría', {
          description: error.message
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCategoryTree, includeTree, selectedCategory]
  )

  // Mover una categoría en el árbol
  const moveCategoryInTree = useCallback(
    async (id: string, parentId: string | null) => {
      if (!includeTree) return null

      setIsLoading(true)
      setError(null)
      try {
        const updatedCategory = await moveCategory(id, parentId)

        // Actualizar el árbol completo
        await fetchCategoryTree()

        toast.success('Categoría movida exitosamente')
        return updatedCategory
      } catch (err) {
        const error = err as Error
        setError(error)
        toast.error('Error al mover la categoría', {
          description: error.message
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [fetchCategoryTree, includeTree]
  )

  // Cargar datos iniciales
  useEffect(() => {
    if (fetchOnMount) {
      const loadData = async () => {
        await fetchCategories()
        if (includeTree) {
          await fetchCategoryTree()
        }
      }
      loadData()
    }
  }, [fetchCategories, fetchCategoryTree, fetchOnMount, includeTree])

  return {
    // Estado
    categories,
    categoryTree,
    selectedCategory,
    isLoading,
    error,

    // Acciones
    fetchCategories,
    fetchCategoryTree,
    fetchCategoryById,
    addCategory,
    editCategory,
    removeCategory,
    moveCategory: moveCategoryInTree,
    setSelectedCategory
  }
}

// Hook para el formulario de categoría (para usar en modales)
export const useCategoryForm = (onSuccess?: (category: Category) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { addCategory, editCategory } = useCategories({ fetchOnMount: false })

  const handleSubmit = useCallback(
    async (
      values: CreateCategoryDto | UpdateCategoryDto,
      categoryId?: string
    ) => {
      setIsSubmitting(true)
      setError(null)

      try {
        let result: Category

        if (categoryId) {
          // Actualizar categoría existente
          result = await editCategory(categoryId, values as UpdateCategoryDto)
        } else {
          // Crear nueva categoría
          result = await addCategory(values as CreateCategoryDto)
        }

        onSuccess?.(result)
        return result
      } catch (err) {
        const error = err as Error
        setError(error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [addCategory, editCategory, onSuccess]
  )

  return {
    isSubmitting,
    error,
    handleSubmit
  }
}
