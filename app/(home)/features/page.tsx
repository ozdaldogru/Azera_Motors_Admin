"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/features/FeatureColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";
import { useTheme } from '@/lib/ThemeProvider';

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

  const { theme } = useTheme();
  return loading ? (<Loader />) : (
    <div className={`h-dvh px-10 py-5 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f] text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[35px] font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Features</p>
        <Button className={`bg-[#2b4db8] text-white ${theme === 'dark' ? 'bg-yellow-700 text-white' : ''}`} onClick={() => router.push("/features/new")}> 
          <Plus className="h-4 w-4 mr-2" />
          Create Feature
        </Button>
      </div>
      <Separator className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} my-4`} />
      <div className={theme === 'dark' ? 'text-white' : ''}>
        <DataTable columns={columns} data={features} searchKey="title" />
      </div>
    </div>
  );
};

export default Features;
