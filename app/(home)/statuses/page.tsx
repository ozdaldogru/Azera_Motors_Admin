"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/statuses/StatusColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";
import { useTheme } from '@/lib/ThemeProvider';

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

  const { theme } = useTheme();
  return loading ? (<Loader />) : (
    <div className={`h-dvh px-10 py-5 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f] text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[35px] font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Statuses</p>
        <Button className={`bg-[#2b4db8] text-white ${theme === 'dark' ? 'bg-yellow-700 text-white' : ''}`} onClick={() => router.push("/statuses/new")}> 
          <Plus className="h-4 w-4 mr-2" />
          Create Status
        </Button>
      </div>
      <Separator className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} my-4`} />
      <div className={theme === 'dark' ? 'text-white' : ''}>
        <DataTable columns={columns} data={statuses} searchKey="title" />
      </div>
    </div>
  );
};

export default Statuses;
