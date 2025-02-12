"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/makes/MakeColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Makes = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [makes, setMakes] = useState([]);

  const getMakes = async () => {
    try {
      const res = await fetch("/api/makes", {
        method: "GET",
      });
      const data = await res.json();
      setMakes(data);
      setLoading(false);
    } catch (err) {
      console.log("[makes_GET]", err);
    }
  };

  useEffect(() => {
    getMakes();
  }, []);

  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-[35px]">Makes</p>
        <Button className="bg-[#2b4db8] text-white" onClick={() => router.push("/makes/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Makes
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={makes} searchKey="title" />
    </div>
  );
};

export default Makes;
