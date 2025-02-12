"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/fueltypes/FuelTypeColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const FuelTypes = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [fueltypes, setFuelTypes] = useState([]);

  const getFuelTypes = async () => {
    try {
      const res = await fetch("/api/fueltypes", {
        method: "GET",
      });
      const data = await res.json();
      setFuelTypes(data);
      setLoading(false);
    } catch (err) {
      console.log("[fueltypes_GET]", err);
    }
  };

  useEffect(() => {
    getFuelTypes();
  }, []);

  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Fuel Types</p>
        <Button className="bg-[#2b4db8] text-white" onClick={() => router.push("/fueltypes/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create FuelType
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={fueltypes} searchKey="title" />
    </div>
  );
};

export default FuelTypes;
