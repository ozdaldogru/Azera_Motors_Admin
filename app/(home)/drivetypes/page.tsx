"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/drivetypes/DriveTypeColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const DriveTypes = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [drivetypes, setDriveTypes] = useState([]);

  const getDriveTypes = async () => {
    try {
      const res = await fetch("/api/drivetypes", {
        method: "GET",
      });
      const data = await res.json();
      setDriveTypes(data);
      setLoading(false);
    } catch (err) {
      console.log("[drivetypes_GET]", err);
    }
  };

  useEffect(() => {
    getDriveTypes();
  }, []);

  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-[35px]">Drive Types</p>
        <Button className="bg-[#2b4db8] text-white" onClick={() => router.push("/drivetypes/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create DriveType
        </Button>
      </div>
      <Separator className="bg-gray-300 my-4" />
      <DataTable columns={columns} data={drivetypes} searchKey="title" />
    </div>
  );
};

export default DriveTypes;
