"use client"

import * as React from "react";
import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'
import { useEffect, useState, use, useCallback } from 'react';

const ProductDetails = (props: { params: Promise<{ productId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)

  const getProductDetails = useCallback(async () => {
    try { 
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      })
      const data = await res.json()
      setProductDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[productId_GET]", err)
    }
  }, [params.productId]) // <-- Add dependencies for useCallback

  useEffect(() => {
    getProductDetails()
  }, [getProductDetails]) // <-- Include getProductDetails in deps

  return loading ? <Loader /> : (
    <ProductForm initialData={productDetails} />
  )
}

export default ProductDetails