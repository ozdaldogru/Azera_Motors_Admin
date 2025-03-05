"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/categories/CategoryColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

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

  return loading ? (<Loader />) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Categories</p>
        <Button className="bg-[#2b4db8] text-white" onClick={() => router.push("/categories/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Categories
        </Button>
      </div>
      <Separator className="bg-gray-300 my-4" />
      <DataTable columns={columns} data={categories} searchKey="title" />
    </div>
  );
};

export default Categories;
