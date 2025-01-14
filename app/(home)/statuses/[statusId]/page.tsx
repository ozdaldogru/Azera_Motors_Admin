"use client"

import { useEffect, useState, use } from "react";
import Loader from "@/components/custom ui/Loader"
import StatusForm from "@/components/statuses/StatusForm"

const StatusDetails = (props: { params: Promise<{ statusId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [StatusDetails, setStatusDetails] = useState<StatusType | null>(null)

  const getStatusDetails = async () => {
    try { 
      const res = await fetch(`/api/statuses/${params.statusId}`, {
        method: "GET"
      })
      const data = await res.json()
      setStatusDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[statusId_GET]", err)
    }
  }

  useEffect(() => {
    getStatusDetails()
  })

  return loading ? <Loader /> : (
    <StatusForm initialData={StatusDetails}/>
  )
}

export default StatusDetails;