"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import CategoryForm from '@/components/categories/CategoryForm' // Adjust import as needed
import { useEffect, useState, use, useCallback } from 'react';

const CategoryDetails = (props: { params: Promise<{ categoryId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [categoryDetails, setCategoryDetails] = useState<CategoryType | null>(null) // Adjust type

  const getCategoryDetails = useCallback(async () => {
    try { 
      const res = await fetch(`/api/categories/${params.categoryId}`, {
        method: "GET"
      })
      const data = await res.json()
      setCategoryDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[categoryId_GET]", err)
    }
  }, [params.categoryId]) // <-- Add dependencies for useCallback

  useEffect(() => {
    getCategoryDetails()
  }, [getCategoryDetails]) // <-- Include getCategoryDetails in deps

  return loading ? <Loader /> : (
    <CategoryForm initialData={categoryDetails} />
  )
}

export default CategoryDetails