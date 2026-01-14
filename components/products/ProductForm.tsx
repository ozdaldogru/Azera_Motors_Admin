"use client";

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "@/components/custom ui/Delete";
import Loader from "@/components/custom ui/Loader";
import dynamic from 'next/dynamic'
import { CldUploadWidget } from 'next-cloudinary';
import { Plus } from 'lucide-react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useTheme } from '@/lib/ThemeProvider'; // <-- Add this import

const animatedComponents = makeAnimated();

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface PdfUploadProps {
  onUpload: (url: string) => void;
}


const JoditEditor = dynamic(
  () => import('jodit-react'),
  { ssr: false }
)


const formSchema = z.object({
  model: z.string().min(1, "***Model is required***"),
  make: z.string().min(1, "***Make is required***"),
  price: z.coerce.number().min(1, "***Price is required***"),
  features: z.array(z.string()).min(1, "***At least one feature is required***"),
  categories: z.string().min(1, "***Category is required***"),
  year: z.coerce.number().min(1900, "***Year is required***"),
  mileage: z.coerce.number().min(1, "***Mileage is required***"),
  driveType: z.string().min(1, "***Drive type is required***"),
  fuelType: z.string().min(1, "***Fuel type is required***"),
  transmission: z.string().min(1, "***Transmission is required***"),
  engineSize: z.coerce.number().min(1, "***Engine size is required***"),
  cylinder: z.coerce.number().min(1, "***Cylinder is required***"),
  color: z.string().min(1, "***Color is required***"),
  interiorColor: z.string().min(1, "***Interior color is required***"),
  door: z.coerce.number().min(2, "***Number of doors is required***"),
  status: z.string().min(1, "***Status is required***"),
  numberofowner: z.coerce.number().min(1, "***Number of owners is required***"),
  vin: z.string(),
  history: z.string(),
  description: z.string(), 
  media: z.array(z.string()),
  totalCost: z.coerce.number(),
  soldPrice: z.coerce.number(),
  soldDate: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.status === "Sold") {
    if (!data.totalCost || data.totalCost <= 0) {
      ctx.addIssue({
         code: "custom",
        path: ["totalCost"],
        message: "***Total Cost is required when status is Sold***",
      });
    }
    if (!data.soldPrice || data.soldPrice <= 0) {
      ctx.addIssue({
         code: "custom",
        path: ["soldPrice"],
        message: "***Sold Price is required when status is Sold***",
      });
    }
    if (data.status === "Sold" && !data.soldDate) {
  ctx.addIssue({
     code: "custom",
    path: ["soldDate"],
    message: "***Sold Date is required when status is Sold***",
  });
}
  }
});



interface ProductType {
  // Add all other properties as per your usage, e.g.:
  _id: string;
  model: string;
  make: string;
  price: number;
  features: FeatureType[];
  categories: string;
  year: number;
  mileage: number;
  driveType: string;
  fuelType: string;
  transmission: string;
  engineSize: number;
  cylinder: number;
  color: string;
  interiorColor: string;
  door: number;
  status: string;
  numberofowner: number;
  vin: string;
  history: string;
  description: string;
  media: string[];
  totalCost: number;
  soldPrice: number;
  soldDate?: string; // <-- Add this line
}

interface ProductFormProps {
  initialData?: ProductType | null; //Must have "?" to make it optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<{ _id: string; title: string }[]>([]);
  const [makes, setMakes] = useState<MakeType[]>();
  const [categories, setCategories] = useState<CategoryType[]>();
  const [drivetypes, setDriveTypes] = useState<DriveTypeType[]>();
  const [fueltypes, setFuelTypes] = useState<FuelTypeType[]>();
  const [statuses, setStatuses] = useState<StatusType[]>();
  const [transmissions, setTransmissions] = useState<TransmissionType[]>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema as any),
  defaultValues: initialData
    ? {
        ...initialData,
        features: initialData.features?.map((feature) => feature._id) || [],
        price: initialData.price ?? 0,
        year: initialData.year ?? 1900,
        mileage: initialData.mileage ?? 0,
        engineSize: initialData.engineSize ?? 0,
        cylinder: initialData.cylinder ?? 0,
        door: initialData.door ?? 2,
        numberofowner: initialData.numberofowner ?? 1,
        totalCost: initialData.totalCost ?? 0,
        soldPrice: initialData.soldPrice ?? 0,
        soldDate: initialData.soldDate || "",
      }
    : {
        model: "",
        make: "",
        price: 0,
        features: [],
        year: 2000,
        mileage: 0,
        driveType: "",
        fuelType: "",
        transmission: "",
        engineSize: 0,
        cylinder: 0,
        color: "",
        interiorColor: "",
        door: 2,
        status: "",
        description: "",
        categories: "",
        media: [],
        numberofowner: 1,
        vin: "",
        history: "",
        totalCost: 0,
        soldPrice: 0,
      },
});


  const handleKeyPress = ( e: React.KeyboardEvent<HTMLInputElement>| React.KeyboardEvent<HTMLTextAreaElement>) => { 
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Check required fields before submitting
    // Improved required field check
    const isEmpty = (val: any) => val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
    if (
      isEmpty(values.model) ||
      isEmpty(values.make) ||
      isEmpty(values.price) ||
      isEmpty(values.description) ||
      !values.media || !Array.isArray(values.media) || values.media.length === 0
    ) {
      const debugFields = {
        model: values.model,
        make: values.make,
        price: values.price,
        description: values.description,
        media: values.media
      };
      console.log('DEBUG required fields:', debugFields);
      alert('DEBUG required fields: ' + JSON.stringify(debugFields, null, 2));
      toast.error("Please fill all required fields: Model, Make, Price, Description, and at least one Image.");
      return;
    }
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        window.location.href = "/products";
        router.push("/products");
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };


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
      toast.error("Something went wrong! Please try again.");
    }
  };

useEffect(() => {
  fetch("/api/features")
    .then(res => res.json())
    .then(data => setFeatures(data));
}, []);

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
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getMakes();
  }, []);


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
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getDriveTypes = async () => {
    try {
      const res = await fetch("/api/drivetypes", {
        method: "GET",
      });
      const data = await res.json();
      setDriveTypes(data);
      setLoading(false);

    } catch (err) {
      console.log("[drivetypes_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getDriveTypes();
  }, []);


  const getFuelTypes = async () => {
    try {
      const res = await fetch("/api/fueltypes", {
        method: "GET",
      });
      const data = await res.json();
      setFuelTypes(data);
      setLoading(false);

    } catch (err) {
      console.log("[fueltypes_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getFuelTypes();
  }, []);

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
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getStatuses();
  }, []);

  const getTransmissions = async () => {
    try {
      const res = await fetch("/api/transmissions", {
        method: "GET",
      });
      const data = await res.json();
      setTransmissions(data);
      setLoading(false);

    } catch (err) {
      console.log("[transmissions_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getTransmissions();
  }, []);

function onSuccess(results: any) {
  const url = results.info.secure_url;
  setPdfUrl(url);
  form.setValue("history", url); // <-- Set Car History field
  toast.success("PDF uploaded successfully!");
}

const { theme } = useTheme(); // <-- Add this line

return loading ? (
  <Loader />
) : (
  <>
    {/* Custom style for select option hover */}
    <style>{`
      select option:hover {
        background-color: #3b82f6 !important; /* Tailwind blue-500 */
        color: #fff !important;
      }
    `}</style>
    <div className={`p-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f] text-white' : ''}`}>
    {initialData ? (
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Edit Product</p>
        <Delete id={initialData._id} item="product" />
      </div>
    ) : (
      <p className="text-heading1-bold text-[35px]">Create Product</p>
    )}
    <Separator className="bg-gray-300 mt-4 mb-7" />

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Makes</FormLabel>
                <FormControl>
                <select  
                className={`border text-sm rounded-lg block w-full p-2.5 
                  ${theme === 'dark'
                    ? 'bg-[#23272f] text-white border-white'
                    : 'bg-white text-black border-gray-300'}`}
                     {...field}>
                      <option value="">Select A Make</option>
                      {makes && makes.slice().sort((a, b) => a.title.localeCompare(b.title)).map((makes) => (
                        <option className="overflow-visible custom-option" style={{backgroundColor: '#23272f', color: 'white'}} key={makes.title}>
                          {makes.title}
                        </option>
                      ))}
                    </select>  
     
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          /> 
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl
                className=" border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                  <Input
                    type="text"
                    placeholder="Enter model"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

         <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                <select  
                    className={`border text-sm rounded-lg block w-full p-2.5 
                      ${theme === 'dark'
                        ? 'bg-[#23272f] text-white border-white'
                        : 'bg-white text-black border-gray-300'}`}
                     {...field}>
                      <option value="">Select A Category</option>
                      {categories && categories.slice().sort((a, b) => a.title.localeCompare(b.title)).map((categories) => (
                        <option className="overflow-visible custom-option" style={{backgroundColor: '#23272f', color: 'white'}} key={categories.title}>
                          {categories.title}
                        </option>
                      ))}
                    </select>  
     
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          /> 
      </div>


        <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

       <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                    type="number"
                    placeholder="Enter Price"
                    {...field}
                    onKeyDown={handleKeyPress}
                    
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

                    <FormField
            control={form.control}
            name="totalCost"
             render={({ field }) => (
              <FormItem>
                <FormLabel>Total Cost ($)</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                    type="number"
                    placeholder="Enter Total Cost"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="soldPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sold Price ($)</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                    type="number"
                    placeholder="Enter Sold Price"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

        </div>


        <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                    type="number"
                    placeholder="Enter Manufacturing Year"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />
 

          <FormField
            control={form.control}
            name="numberofowner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number Of Owner</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                    type="number"
                    placeholder="Enter Number Of Owner(s)"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mileage</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                    type="number"
                    placeholder="Enter Mileage"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

          </div>

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    placeholder="Select Features - Multiple Selection Allowed"
                    options={features.slice().sort((a, b) => a.title.localeCompare(b.title)).map((feature) => ({ value: feature._id, label: feature.title })) as any}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions.map((option) => option.value);
                      field.onChange(values);
                    }}
                    value={features.filter((feature) => field.value.includes(feature._id)).map((feature) => ({ value: feature._id, label: feature.title }))}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: theme === 'dark' ? '#23272f' : base.backgroundColor,
                        color: theme === 'dark' ? '#fff' : base.color,
                        borderColor: theme === 'dark' ? 'white' : base.borderColor,
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: theme === 'dark' ? '#23272f' : base.backgroundColor,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: theme === 'dark'
                          ? (state.isFocused || state.isSelected ? '#3b82f6' : '#23272f')
                          : (state.isFocused || state.isSelected ? base.backgroundColor : base.backgroundColor),
                        color: theme === 'dark' ? '#fff' : base.color,
                        cursor: 'pointer',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: theme === 'dark' ? '#333' : base.backgroundColor,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      input: (base) => ({
                        ...base,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />



                      
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statuses</FormLabel>
                <FormControl>
                <select  
                className={`border text-sm rounded-lg block w-full p-2.5 
                  ${theme === 'dark'
                    ? 'bg-[#23272f] text-white border-white'
                    : 'bg-white text-black border-gray-300'}`}
                     {...field}>
                  <option value="">Select A Status</option>
                  {statuses && statuses.slice().sort((a, b) => a.title.localeCompare(b.title)).map((statuses) => (
                    <option className="overflow-visible custom-option" style={{backgroundColor: '#23272f', color: 'white'}} key={statuses.title}>
                      {statuses.title}
                    </option>
                  ))}
                </select>  
     
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />    
          
           {form.watch("status") === "Sold" && (
                  <FormField
                    control={form.control}
                    name="soldDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sold Date</FormLabel>
                        <FormControl
                          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                          <Input
                            type="date"
                            placeholder="Select Sold Date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-[15px]" />
                      </FormItem>
                    )}
                  />
                )}
        
        
      </div>                




      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <FormField
            control={form.control}
            name="driveType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drive Types</FormLabel>
                <FormControl>
                <select                    
                className={`border text-sm rounded-lg block w-full p-2.5 
                  ${theme === 'dark'
                    ? 'bg-[#23272f] text-white border-white'
                    : 'bg-white text-black border-gray-300'}`}
                     {...field}>
                  <option value="">Select A Drive Type</option>
                  {drivetypes && drivetypes.slice().sort((a, b) => a.title.localeCompare(b.title)).map((drivetypes) => (
                    <option 
                      className="overflow-visible custom-option" style={{backgroundColor: '#23272f', color: 'white'}} key={drivetypes.title}>
                        {drivetypes.title}
                      </option>
                  ))}
                </select>  
     
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />    

        <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Types</FormLabel>
                <FormControl>
                <select  
                className={`border text-sm rounded-lg block w-full p-2.5 
                  ${theme === 'dark'
                    ? 'bg-[#23272f] text-white border-white'
                    : 'bg-white text-black border-gray-300'}`}
                     {...field}>
                  <option value="">Select A Fuel Type</option>
                  {fueltypes && fueltypes.slice().sort((a, b) => a.title.localeCompare(b.title)).map((fueltypes) => (
                    <option className="overflow-visible custom-option" style={{backgroundColor: '#23272f', color: 'white'}} key={fueltypes.title}>
                      {fueltypes.title}
                    </option>
                  ))}
                </select>  
     
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />     


      <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmissions</FormLabel>
                <FormControl>
                <select  
                className={`border text-sm rounded-lg block w-full p-2.5 
                  ${theme === 'dark'
                    ? 'bg-[#23272f] text-white border-white'
                    : 'bg-white text-black border-gray-300'}`}
                     {...field}>
                  <option value="">Select A Transmission</option>
                  {transmissions && transmissions.slice().sort((a, b) => a.title.localeCompare(b.title)).map((transmissions) => (
                    <option className="overflow-visible custom-option" style={{backgroundColor: '#23272f', color: 'white'}} key={transmissions.title}>
                      {transmissions.title}
                    </option>
                  ))}
                </select>  
     
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />   

      </div>


        <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
                    <FormField
            control={form.control}
            name="engineSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engine Size</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                   
                  type="number"
                    placeholder="Enter Engine Size"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cylinder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cylinder</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                  type="number"
                    placeholder="Enter Cylinder"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="door"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of the Doors</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                   type="number"
                    placeholder="Enter Number of the Doors"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

      </div>


    <div
    className="grid grid-cols-1 md:grid-cols-3 gap-6">


       <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input 
                  type="text"
                    placeholder="Enter Exterior Color"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interiorColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interior Color</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                   type="text"
                    placeholder="Enter Interior Color"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <Input
                   type="text"
                    placeholder="Enter VIN Number"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

    </div>





    <CldUploadWidget uploadPreset={uploadPreset} onSuccess={onSuccess} options={{ resourceType: 'raw' }}>
      {({ open }) => {
        return (
          <Button type="button" onClick={() => open()} className="bg-[#7f8c8d] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Upload PDF
          </Button>
        );
      }}
    </CldUploadWidget>

      <FormField
            control={form.control}
            name="history"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car History</FormLabel>
                <FormControl
                  className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <Input
                    type="text"
                    placeholder="Car's History Link"
                    {...field}
                    readOnly // <-- Optional: make it read-only
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-[15px]" />
              </FormItem>
            )}
          />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <div
                          className="rounded"
                          style={{
                            background: "#fff",
                            color: "#000",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <JoditEditor
                            value={field.value}
                            onBlur={newContent => field.onChange(newContent)}
                            onChange={newContent => field.onChange(newContent)}
                            config={{
                              theme: "default",
                              style: {
                                background: "#fff",
                                color: "#000",
                              },
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-[15px]" />
                    </FormItem>
                  )}
                />



        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
                <FormControl
                className="border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <ImageUpload
                      value={field.value}
                      onChange={(urls) => field.onChange(urls)}
                      onRemove={(url) => field.onChange(field.value.filter((image) => image !== url))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-[15px]" />
               </FormItem>
                )}
            />
 

  
        <div className="flex gap-10">
       
          <Button type="submit" 
            className="bg-[#186a3b] text-white" 
            aria-label="click submit button">
            Submit
          </Button>
          <Button
            aria-label="click discard button"
            type="button"
            onClick={() => router.push("/products")}
            className="bg-[#cb4335] text-white"
          >
            Discard
          </Button>
        </div>
        

      </form>
    </Form>

 

    </div>
  </>
);
};

export default ProductForm;