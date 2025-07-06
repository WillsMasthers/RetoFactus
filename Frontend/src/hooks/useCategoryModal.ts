import { useState } from 'react';
import { Category } from '@/types/inventory/category.types';

export const useCategoryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<((category: Category) => void) | null>(null);

  const openModal = (options: {
    category?: Category | null;
    parentId?: string | null;
    onSuccess?: (category: Category) => void;
  } = {}) => {
    const { category = null, parentId: newParentId = null, onSuccess = null } = options;
    setSelectedCategory(category);
    setParentId(newParentId);
    if (onSuccess) {
      setOnSuccessCallback(() => onSuccess);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Pequeño retraso para permitir la animación de cierre
    setTimeout(() => {
      setSelectedCategory(null);
      setParentId(null);
      setOnSuccessCallback(null);
    }, 300);
  };

  const handleSuccess = (category: Category) => {
    if (onSuccessCallback) {
      onSuccessCallback(category);
    }
  };

  return {
    isOpen,
    selectedCategory,
    parentId,
    openModal,
    closeModal,
    handleSuccess,
  };
};

export default useCategoryModal;
