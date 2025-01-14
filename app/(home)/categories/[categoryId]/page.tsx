"use client"

import { useEffect, useState, use } from "react";
import Loader from "@/components/custom ui/Loader"
import CategoryForm from "@/components/categories/CategoryForm"

const CategoryDetails = (props: { params: Promise<{ categoryId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [CategoryDetails, setCategoryDetails] = useState<CategoryType | null>(null)

  const getCategoryDetails = async () => {
    try { 
      const res = await fetch(`/api/categorys/${params.categoryId}`, {
        method: "GET"
      })
      const data = await res.json()
      setCategoryDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[categoryId_GET]", err)
    }
  }

  useEffect(() => {
    getCategoryDetails()
  })

  return loading ? <Loader /> : (
    <CategoryForm initialData={CategoryDetails}/>
  )
}

export default CategoryDetails;