import React, { useEffect, useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CategoryModal } from '../modals/CategoryModal';
import { useCategoryModal } from '@/hooks/useCategoryModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface CategorySelectProps {
  field: ControllerRenderProps<FieldValues, string>;
  label?: string;
  placeholder?: string;
  className?: string;
  showAddButton?: boolean;
  parentId?: string | null;
  onCategoryAdded?: (category: any) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  field,
  label = 'Categoría',
  placeholder = 'Selecciona una categoría',
  className = '',
  showAddButton = true,
  parentId = null,
  onCategoryAdded,
}) => {
  const { categories, isLoading, fetchCategories } = useCategories({
    fetchOnMount: true,
  });
  
  const { 
    isOpen, 
    selectedCategory, 
    openModal, 
    closeModal, 
    handleSuccess 
  } = useCategoryModal();

  // Manejar la adición exitosa de una categoría
  const handleCategoryAdded = (newCategory: any) => {
    // Actualizar la lista de categorías
    fetchCategories();
    
    // Seleccionar automáticamente la categoría recién creada
    if (field.onChange) {
      field.onChange(newCategory.uuid);
    }
    
    // Llamar al callback personalizado si se proporciona
    onCategoryAdded?.(newCategory);
  };

  // Abrir el modal para agregar una nueva categoría
  const handleAddCategory = () => {
    openModal({
      parentId: parentId,
      onSuccess: handleCategoryAdded,
    });
  };

  return (
    <div className={className}>
      <FormItem>
        <div className="flex justify-between items-center mb-2">
          <FormLabel>{label}</FormLabel>
          {showAddButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-primary"
              onClick={handleAddCategory}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          )}
        </div>
        
        <Select
          onValueChange={field.onChange}
          value={field.value || ''}
          disabled={isLoading}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? 'Cargando...' : placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.uuid} value={category.uuid}>
                {category.name}
              </SelectItem>
            ))}
            {categories.length === 0 && !isLoading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No hay categorías disponibles
              </div>
            )}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
      
      {/* Modal para agregar/editar categorías */}
      <CategoryModal
        isOpen={isOpen}
        onClose={closeModal}
        category={selectedCategory}
        parentId={parentId}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CategorySelect;
