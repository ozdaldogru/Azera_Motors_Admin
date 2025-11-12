"use client"

import { useEffect, useState, use, useCallback } from "react";
import Loader from "@/components/custom ui/Loader"
import FuelTypeForm from "@/components/fueltypes/FuelTypeForm"

const FuelTypeDetails = (props: { params: Promise<{ fueltypeId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [FuelTypeDetails, setFuelTypeDetails] = useState<FuelTypeType | null>(null)

  const getFuelTypeDetails = useCallback(async () => {
    try { 
      const res = await fetch(`/api/fueltypes/${params.fueltypeId}`, {
        method: "GET"
      })
      const data = await res.json()
      setFuelTypeDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[fueltypeId_GET]", err)
    }
  }, [params.fueltypeId])

  useEffect(() => {
    getFuelTypeDetails()
  }, [getFuelTypeDetails])

  return loading ? <Loader /> : (
    <FuelTypeForm initialData={FuelTypeDetails}/>
  )
}

export default FuelTypeDetails;