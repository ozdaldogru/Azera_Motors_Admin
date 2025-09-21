"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/categories/CategoryColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";
import { useTheme } from '@/lib/ThemeProvider';

const Categories = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const res = await fetch("/api/categories", {
        method: "GET",
      });
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.log("[categories_GET]", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const { theme } = useTheme();
  return loading ? (<Loader />) : (
    <div className={`h-full px-10 py-5 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f] text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <p className={`text-heading2-bold font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Categories</p>
        <Button className={`bg-[#2b4db8] text-white ${theme === 'dark' ? 'bg-yellow-700 text-white' : ''}`} onClick={() => router.push("/categories/new")}> 
          <Plus className="h-4 w-4 mr-2" />
          Create Categories
        </Button>
      </div>
      <Separator className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} my-4`} />
      <div className={theme === 'dark' ? 'text-white' : ''}>
        <DataTable columns={columns} data={categories} searchKey="title" />
      </div>
    </div>
  );
};

export default Categories;
