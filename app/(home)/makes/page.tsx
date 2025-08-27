"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/makes/MakeColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";
import { useTheme } from '@/lib/ThemeProvider';

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

  const { theme } = useTheme();
  return loading ? (<Loader />) : (
    <div className={`h-dvh px-10 py-5 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f] text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[35px] font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Makes</p>
        <Button className={`bg-[#2b4db8] text-white ${theme === 'dark' ? 'bg-yellow-700 text-white' : ''}`} onClick={() => router.push("/makes/new")}> 
          <Plus className="h-4 w-4 mr-2" />
          Create Makes
        </Button>
      </div>
      <Separator className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} my-4`} />
      <div className={theme === 'dark' ? 'text-white' : ''}>
        <DataTable columns={columns} data={makes} searchKey="title" />
      </div>
    </div>
  );
};

export default Makes;
