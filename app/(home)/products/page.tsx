"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/products/ProductColumns";

// Make sure ProductType matches your product data structure
// type ProductType = { ... };

const Products = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pageSize, setPageSize] = useState(10);

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

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-[35px]">Cars</p>
        <Button
          className="bg-[#2b4db8] text-white"
          onClick={() => router.push("/products/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create A Car
        </Button>
      </div>
      <Separator className="bg-gray-300 my-4" />

      <DataTable
        columns={columns}
        data={products}
        searchKey={[
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
  );
};

export default Products;