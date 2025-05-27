import { useState, useEffect, useCallback } from "react";
import CategoriesService from "@/services/categoriesService";
import { useToast } from "@/components/GlobalComponents/Notifications";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CategoriesService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
}