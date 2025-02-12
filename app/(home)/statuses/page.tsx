"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/statuses/StatusColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Statuses = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]);

  const getStatuses = async () => {
    try {
      const res = await fetch("/api/statuses", {
        method: "GET",
      });
      const data = await res.json();
      setStatuses(data);
      setLoading(false);
    } catch (err) {
      console.log("[statuses_GET]", err);
    }
  };

  useEffect(() => {
    getStatuses();
  }, []);

  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Statuses</p>
        <Button className="bg-[#2b4db8] text-white" onClick={() => router.push("/statuses/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Status
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={statuses} searchKey="title" />
    </div>
  );
};

export default Statuses;
