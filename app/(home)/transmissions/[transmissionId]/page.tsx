"use client"

import { useEffect, useState, use, useCallback } from "react";
import Loader from "@/components/custom ui/Loader"
import TransmissionForm from "@/components/transmissions/TransmissionForm"

const TransmissionDetails = (props: { params: Promise<{ transmissionId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [TransmissionDetails, setTransmissionDetails] = useState<TransmissionType | null>(null)

  const getTransmissionDetails = useCallback(async () => {
    try { 
      const res = await fetch(`/api/transmissions/${params.transmissionId}`, {
        method: "GET"
      })
      const data = await res.json()
      setTransmissionDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[transmissionId_GET]", err)
    }
  }, [params.transmissionId])

  useEffect(() => {
    getTransmissionDetails()
  }, [getTransmissionDetails])

  return loading ? <Loader /> : (
    <TransmissionForm initialData={TransmissionDetails}/>
  )
}

export default TransmissionDetails;