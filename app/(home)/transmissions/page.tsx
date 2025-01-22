"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/transmissions/TransmissionColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Transmissions = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [transmissions, setTransmissions] = useState([]);

  const getTransmissions = async () => {
    try {
      const res = await fetch("/api/transmissions", {
        method: "GET",
      });
      const data = await res.json();
      setTransmissions(data);
      setLoading(false);
    } catch (err) {
      console.log("[transmissions_GET]", err);
    }
  };

  useEffect(() => {
    getTransmissions();
  }, []);
  
  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Transmissions</p>
        <Button className="bg-blue-1 text-white" onClick={() => router.push("/transmissions/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Transmission
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={transmissions} searchKey="title" />
    </div>
  );
};

export default Transmissions;
