"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/products/ProductColumns";
import { useTheme } from '@/lib/ThemeProvider';


const Products = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
 

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("/api/products", { method: "GET" });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("[products_GET]", err);
      } finally {
        setLoading(false); // Always set loading to false
      }
    };
    getProducts();
  }, []);

  const { theme } = useTheme();
  return loading ? <Loader /> : (
    <div className={`h-fit px-10 py-5 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f] text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <p className={`text-[35px] font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Cars</p>
        <Button
          className={`bg-[#2b4db8] text-white ${theme === 'dark' ? 'bg-yellow-700 text-white' : ''}`}
          onClick={() => router.push("/products/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Car
        </Button>
      </div>
      <Separator className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} my-4`} />

      <div className={theme === 'dark' ? 'text-white' : ''}>
        <DataTable
          columns={columns}
          data={products}
          searchKey={[
            "make",
            "model",
            "year",
            "categories",
            "status",
            "driveType",
            "fuelType",
            "transmission",
            "price",
            "mileage",
            "features",
            "engineSize",
            "cylinder",
            "color",
            "interiorColor",
            "door",
            "totalCost",
            "soldPrice",
            "soldDate"
          ]}
        />
      </div>
    </div>
  );
};

export default Products;