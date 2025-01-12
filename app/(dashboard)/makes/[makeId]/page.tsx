"use client"

import { useEffect, useState, use } from "react";
import Loader from "@/components/custom ui/Loader"
import MakeForm from "@/components/makes/MakeForm"

const MakeDetails = (props: { params: Promise<{ makeId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [MakeDetails, setMakeDetails] = useState<MakeType | null>(null)

  const getMakeDetails = async () => {
    try { 
      const res = await fetch(`/api/makes/${params.makeId}`, {
        method: "GET"
      })
      const data = await res.json()
      setMakeDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[makeId_GET]", err)
    }
  }

  useEffect(() => {
    getMakeDetails()
  })

  return loading ? <Loader /> : (
    <MakeForm initialData={MakeDetails}/>
  )
}

export default MakeDetails;