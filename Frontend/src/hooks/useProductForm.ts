import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Product, CreateProductDto, UpdateProductDto } from '@/types/inventory/product.types';

// Esquema de validación para el formulario de producto
const productFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'La categoría es requerida'),
  brand_id: z.string().optional(),
  price: z.number().min(0, 'El precio no puede ser negativo').default(0),
  cost_price: z.number().min(0, 'El precio de costo no puede ser negativo').optional(),
  sale_price: z.number().min(0, 'El precio de oferta no puede ser negativo').optional(),
  stock_quantity: z.number().int().min(0, 'La cantidad no puede ser negativa').default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_service: z.boolean().default(false),
  weight: z.number().min(0, 'El peso no puede ser negativo').optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
  }).optional(),
  metadata: z.record(z.any()).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface UseProductFormOptions {
  initialData?: Partial<Product>;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<Product>;
  onSuccess?: (product: Product) => void;
}

export const useProductForm = ({
  initialData = {},
  onSubmit,
  onSuccess,
}: UseProductFormOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData.name || '',
      sku: initialData.sku || '',
      description: initialData.description || '',
      category_id: initialData.category_id || '',
      brand_id: initialData.brand_id || '',
      price: initialData.price || 0,
      cost_price: initialData.cost_price,
      sale_price: initialData.sale_price,
      stock_quantity: initialData.stock_quantity || 0,
      is_active: initialData.is_active ?? true,
      is_featured: initialData.is_featured ?? false,
      is_service: initialData.is_service ?? false,
      weight: initialData.weight,
      dimensions: initialData.dimensions,
      metadata: initialData.metadata || {},
    },
  });

  // Manejar el envío del formulario
  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convertir valores numéricos
      const productData = {
        ...values,
        price: Number(values.price),
        cost_price: values.cost_price ? Number(values.cost_price) : undefined,
        sale_price: values.sale_price ? Number(values.sale_price) : undefined,
        stock_quantity: Number(values.stock_quantity),
        weight: values.weight ? Number(values.weight) : undefined,
      };

      // Llamar a la función de envío proporcionada
      const result = await onSubmit(productData);
      
      // Llamar a la función de éxito si se proporciona
      onSuccess?.(result);
      
      // Mostrar mensaje de éxito
      toast.success(
        initialData.uuid 
          ? 'Producto actualizado correctamente' 
          : 'Producto creado correctamente'
      );
      
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Error al guardar el producto', {
        description: error.message,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    error,
    handleSubmit: form.handleSubmit(handleSubmit),
    reset: form.reset,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch,
  };
};

export default useProductForm;
