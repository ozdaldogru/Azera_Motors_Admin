"use client";

import React, { useEffect, useState, useMemo } from "react"; // <-- Add useMemo
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/products/ProductColumns";
import ProductForm from "@/components/products/ProductForm";
import { useTheme } from '@/lib/ThemeProvider';

type MakeType = { _id: string; title: string };

const Products = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [makes, setMakes] = useState<MakeType[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedDriveType, setSelectedDriveType] = useState<string>("");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [statuses, setStatuses] = useState<{ _id: string; title: string }[]>([]);
  const [driveTypes, setDriveTypes] = useState<{ _id: string; title: string }[]>([]);
  const [fuelTypes, setFuelTypes] = useState<{ _id: string; title: string }[]>([]);
  const [transmissions, setTransmissions] = useState<{ _id: string; title: string }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("/api/products", { method: "GET" });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("[products_GET]", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Fetch makes
  useEffect(() => {
    const getMakes = async () => {
      try {
        const res = await fetch("/api/makes", { method: "GET" });
        const data = await res.json();
        // data is an array of { _id, title }
        setMakes(data);
      } catch (err) {
        console.log("[makes_GET]", err);
      }
    };
    getMakes();
  }, []);

  useEffect(() => {
    const fetchOptions = async (endpoint: string, setter: any) => {
      try {
        const res = await fetch(endpoint, { method: "GET" });
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.log(`[${endpoint}_GET]`, err);
      }
    };
    fetchOptions("/api/statuses", setStatuses);
    fetchOptions("/api/drivetypes", setDriveTypes);
    fetchOptions("/api/fuel-types", setFuelTypes);
    fetchOptions("/api/transmissions", setTransmissions);
    fetchOptions("/api/categories", setCategories);
  }, []);

  const { theme } = useTheme();

  // Memoize filteredProducts to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => !selectedMake || p.make === selectedMake)
      .filter(p => !selectedStatus || p.status === selectedStatus)
      .filter(p => !selectedDriveType || p.driveType === selectedDriveType)
      .filter(p => !selectedFuelType || p.fuelType === selectedFuelType)
      .filter(p => !selectedTransmission || p.transmission === selectedTransmission)
      .filter(p => !selectedCategory || p.categories === selectedCategory);
  }, [products, selectedMake, selectedStatus, selectedDriveType, selectedFuelType, selectedTransmission, selectedCategory]);

  const getUniqueSorted = (arr: any[], key: string) =>
    Array.from(new Set(arr.map(item => item[key]).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const allStatuses = ["Available", "Sold", "Pending"];

  return loading ? (
    <Loader />
  ) : (
    <div className={`h-full px-10 py-5 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f] text-white' : ''}`}>
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

      <div className="flex flex-wrap gap-4 mb-4">
        {/* Make */}
        <select
          id="make-filter"
          value={selectedMake}
          onChange={e => setSelectedMake(e.target.value)}
          className={`border rounded px-2 py-1 ${theme === 'dark' ? 'bg-[#23272f] text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
        >
          <option value="" className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>All Makes</option>
          {[...makes].sort((a, b) => a.title.localeCompare(b.title)).map(make => (
            <option key={make._id} value={make.title} className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>
              {make.title}
            </option>
          ))}
        </select>
        {/* Status */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className={`border rounded px-2 py-1 ${theme === 'dark' ? 'bg-[#23272f] text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
        >
          <option value="" className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>All Statuses</option>
          {statuses.sort((a, b) => a.title.localeCompare(b.title)).map(status => (
            <option key={status._id} value={status.title} className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>
              {status.title}
            </option>
          ))}
        </select>
        {/* Drive Type */}
        <select
          value={selectedDriveType}
          onChange={e => setSelectedDriveType(e.target.value)}
          className={`border rounded px-2 py-1 ${theme === 'dark' ? 'bg-[#23272f] text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
        >
          <option value="" className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>All Drive Types</option>
          {driveTypes.sort((a, b) => a.title.localeCompare(b.title)).map(dt => (
            <option key={dt._id} value={dt.title} className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>
              {dt.title}
            </option>
          ))}
        </select>
        {/* Fuel Type */}
        <select
          value={selectedFuelType}
          onChange={e => setSelectedFuelType(e.target.value)}
          className={`border rounded px-2 py-1 ${theme === 'dark' ? 'bg-[#23272f] text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
        >
          <option value="" className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>All Fuel Types</option>
          {fuelTypes.sort((a, b) => a.title.localeCompare(b.title)).map(ft => (
            <option key={ft._id} value={ft.title} className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>
              {ft.title}
            </option>
          ))}
        </select>
        {/* Transmission */}
        <select
          value={selectedTransmission}
          onChange={e => setSelectedTransmission(e.target.value)}
          className={`border rounded px-2 py-1 ${theme === 'dark' ? 'bg-[#23272f] text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
        >
          <option value="" className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>All Transmissions</option>
          {transmissions.sort((a, b) => a.title.localeCompare(b.title)).map(tr => (
            <option key={tr._id} value={tr.title} className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>
              {tr.title}
            </option>
          ))}
        </select>
        {/* Categories */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className={`border rounded px-2 py-1 ${theme === 'dark' ? 'bg-[#23272f] text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
        >
          <option value="" className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>All Categories</option>
          {categories.sort((a, b) => a.title.localeCompare(b.title)).map(cat => (
            <option key={cat._id} value={cat.title} className={theme === 'dark' ? 'text-white bg-[#23272f]' : 'text-black bg-white'}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      <div className={theme === 'dark' ? 'text-white' : ''}>
        <DataTable
          columns={columns}
          data={filteredProducts}
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

export default React.memo(Products);

// Example of the problematic edit page
const EditProduct = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${params.productId}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct(); // <-- This runs on every render if no dependencies
  }, [params.productId]); // <-- Add [params.productId] to prevent loops

  return <ProductForm initialData={product} />;
};


