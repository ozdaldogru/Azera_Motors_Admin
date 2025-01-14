"use client"

import { useEffect, useState, use } from "react";
import Loader from "@/components/custom ui/Loader"
import ConditionForm from "@/components/conditions/ConditionForm"

const ConditionDetails = (props: { params: Promise<{ conditionId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [ConditionDetails, setConditionDetails] = useState<ConditionType | null>(null)

  const getConditionDetails = async () => {
    try { 
      const res = await fetch(`/api/conditions/${params.conditionId}`, {
        method: "GET"
      })
      const data = await res.json()
      setConditionDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[conditionId_GET]", err)
    }
  }

  useEffect(() => {
    getConditionDetails()
  })

  return loading ? <Loader /> : (
    <ConditionForm initialData={ConditionDetails}/>
  )
}

export default ConditionDetails;