"use client"

import { useEffect, useState, use } from "react";
import Loader from "@/components/custom ui/Loader"
import DriveTypeForm from "@/components/drivetypes/DriveTypeForm"

const DriveTypeDetails = (props: { params: Promise<{ drivetypeId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [DriveTypeDetails, setDriveTypeDetails] = useState<DriveTypeType | null>(null)

  const getDriveTypeDetails = async () => {
    try { 
      const res = await fetch(`/api/drivetypes/${params.drivetypeId}`, {
        method: "GET"
      })
      const data = await res.json()
      setDriveTypeDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[drivetypeId_GET]", err)
    }
  }

  useEffect(() => {
    getDriveTypeDetails()
  })

  return loading ? <Loader /> : (
    <DriveTypeForm initialData={DriveTypeDetails}/>
  )
}

export default DriveTypeDetails;