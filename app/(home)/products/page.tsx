"use client";

import React, { useEffect, useState, useMemo } from "react";
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

const MultiCheckboxFilter = ({
  options,
  selected,
  onApply,
  placeholder,
  theme,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onApply: (selected: string[]) => void;
  placeholder: string;
  theme: string;
}) => {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".multi-checkbox-popover")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleCheckboxChange = (value: string) => {
    setTempSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    onApply(tempSelected);
    setOpen(false);
  };

  const handleClear = () => {
    setTempSelected([]);
    onApply([]);
    setOpen(false);
  };

  const handleOpen = () => {
    setTempSelected(selected);
    setOpen(prev => !prev); // Toggle open/close when filter button is clicked
  };

  const popoverStyle =
    theme === "dark"
      ? "bg-[#23272f] text-white border border-gray-700"
      : "bg-white text-black border border-gray-300";

  const applyButtonStyle =
    "mt-4 w-full bg-green-600 hover:bg-green-700 text-white";

  const clearButtonStyle =
    "mt-2 w-full bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600";

  // Change button text color to red if filtered
  const filterButtonStyle =
    (selected.length > 0 ? "text-red-600 " : "") +
    (theme === "dark"
      ? "bg-[#23272f] border border-gray-700"
      : "bg-white border border-gray-300");

  return (
    <div className="relative min-w-[200px]">
      <Button
        variant="outline"
        className={filterButtonStyle + " w-full"}
        onClick={handleOpen}
      >
        {placeholder}
      </Button>
      {open && (
        <div
          className={`multi-checkbox-popover absolute z-10 mt-2 rounded shadow-lg p-4 min-w-[200px] ${popoverStyle}`}
        >
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {options.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempSelected.includes(opt.value)}
                  onChange={() => handleCheckboxChange(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <Button className={applyButtonStyle} onClick={handleApply}>
            Apply
          </Button>
          <Button className={clearButtonStyle} onClick={handleClear}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

const Products = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [makes, setMakes] = useState<MakeType[]>([]);
  const [statuses, setStatuses] = useState<{ _id: string; title: string }[]>([]);
  const [driveTypes, setDriveTypes] = useState<{ _id: string; title: string }[]>([]);
  const [fuelTypes, setFuelTypes] = useState<{ _id: string; title: string }[]>([]);
  const [transmissions, setTransmissions] = useState<{ _id: string; title: string }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);

  // Multi-checkbox filter states
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDriveTypes, setSelectedDriveTypes] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { theme } = useTheme();

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

  // Memoize filteredProducts to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => selectedMakes.length === 0 || selectedMakes.includes(p.make))
      .filter(p => selectedStatuses.length === 0 || selectedStatuses.includes(p.status))
      .filter(p => selectedDriveTypes.length === 0 || selectedDriveTypes.includes(p.driveType))
      .filter(p => selectedFuelTypes.length === 0 || selectedFuelTypes.includes(p.fuelType))
      .filter(p => selectedTransmissions.length === 0 || selectedTransmissions.includes(p.transmission))
      .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.categories));
  }, [
    products,
    selectedMakes,
    selectedStatuses,
    selectedDriveTypes,
    selectedFuelTypes,
    selectedTransmissions,
    selectedCategories
  ]);

  // Helper to transform options for MultiCheckboxFilter and sort alphabetically
  const toOptions = (arr: any[], key: string) =>
    [...arr]
      .sort((a, b) => a[key].localeCompare(b[key]))
      .map(item => ({ value: item.title, label: item.title }));

  // Clear all filters handler
  const handleClearAll = () => {
    setSelectedMakes([]);
    setSelectedStatuses([]);
    setSelectedDriveTypes([]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedCategories([]);
  };

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

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <MultiCheckboxFilter
          options={toOptions(makes, "title")}
          selected={selectedMakes}
          onApply={setSelectedMakes}
          placeholder="All Makes"
          theme={theme}
        />
        <MultiCheckboxFilter
          options={toOptions(statuses, "title")}
          selected={selectedStatuses}
          onApply={setSelectedStatuses}
          placeholder="All Statuses"
          theme={theme}
        />
        <MultiCheckboxFilter
          options={toOptions(driveTypes, "title")}
          selected={selectedDriveTypes}
          onApply={setSelectedDriveTypes}
          placeholder="All Drive Types"
          theme={theme}
        />
        <MultiCheckboxFilter
          options={toOptions(fuelTypes, "title")}
          selected={selectedFuelTypes}
          onApply={setSelectedFuelTypes}
          placeholder="All Fuel Types"
          theme={theme}
        />
        <MultiCheckboxFilter
          options={toOptions(transmissions, "title")}
          selected={selectedTransmissions}
          onApply={setSelectedTransmissions}
          placeholder="All Transmissions"
          theme={theme}
        />
        <MultiCheckboxFilter
          options={toOptions(categories, "title")}
          selected={selectedCategories}
          onApply={setSelectedCategories}
          placeholder="All Categories"
          theme={theme}
        />
        <Button
          className="ml-2 bg-red-600 hover:bg-red-700 text-white h-[40px]"
          onClick={handleClearAll}
        >
          Clear Filters
        </Button>
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


