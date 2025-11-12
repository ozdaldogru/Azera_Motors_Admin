"use client"

import { useEffect, useState, use, useCallback } from "react";
import Loader from "@/components/custom ui/Loader"
import FeatureForm from "@/components/features/FeatureForm"

const FeatureDetails = (props: { params: Promise<{ featureId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [FeatureDetails, setFeatureDetails] = useState<FeatureType | null>(null)

  const getFeatureDetails = useCallback(async () => {
    try { 
      const res = await fetch(`/api/features/${params.featureId}`, {
        method: "GET"
      })
      const data = await res.json()
      setFeatureDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[featureId_GET]", err)
    }
  }, [params.featureId])

  useEffect(() => {
    getFeatureDetails()
  }, [getFeatureDetails])

  return loading ? <Loader /> : (
    <FeatureForm initialData={FeatureDetails}/>
  )
}

export default FeatureDetails;