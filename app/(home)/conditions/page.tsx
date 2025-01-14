"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/conditions/ConditionColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Conditions = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [conditions, setConditions] = useState([]);

  const getConditions = async () => {
    try {
      const res = await fetch("/api/conditions", {
        method: "GET",
      });
      const data = await res.json();
      setConditions(data);
      setLoading(false);
    } catch (err) {
      console.log("[conditions_GET]", err);
    }
  };

  useEffect(() => {
    getConditions();
  }, []);

  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Condition</p>
        <Button className="bg-blue-1 text-white" onClick={() => router.push("/conditions/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Condition
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={conditions} searchKey="title" />
    </div>
  );
};

export default Conditions;
