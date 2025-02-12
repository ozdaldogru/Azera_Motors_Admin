"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/features/FeatureColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Features = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);

  const getFeatures = async () => {
    try {
      const res = await fetch("/api/features", {
        method: "GET",
      });
      const data = await res.json();
      setFeatures(data);
      setLoading(false);
    } catch (err) {
      console.log("[features_GET]", err);
    }
  };

  useEffect(() => {
    getFeatures();
  }, []);

  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Features</p>
        <Button className="bg-[#2b4db8] text-white" onClick={() => router.push("/features/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Feature
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={features} searchKey="title" />
    </div>
  );
};

export default Features;
