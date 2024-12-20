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
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import MultiSelectFeature from "../custom ui/MultiSelectFeature";
import Loader from "../custom ui/Loader";
import {CarMakes} from "../Shared/CarMakes";
import {Categories} from "../Shared/Category";
import {Conditions} from "../Shared/conditions";
import {IsLowMileage} from "../Shared/lowmileage";
import {driveTypes} from "../Shared/drivetype";
import {fuelTypes} from "../Shared/fueltype";
import {Statuses} from "../Shared/statuses";
import {transmissions} from "../Shared/transmission";






const formSchema = z.object({
  title: z.string().min(2).max(200),
  make: z.string(),
  price: z.coerce.number(),
  features: z.array(z.string()),
  categories: z.string(),
  condition: z.string(),
  year: z.coerce.number(),
  mileage: z.coerce.number().min(1),
  lowmileage: z.string(),
  driveType: z.string(),
  fuelType: z.string(),
  consumption: z.coerce.number(),
  transmission: z.string(),
  engineSize: z.coerce.number(),
  cylinder: z.coerce.number(),
  color: z.string(),
  interiorColor: z.string(),
  door: z.coerce.number().min(2),
  status: z.string(),
  numberofowner: z.coerce.number(),
  description: z.string().min(10).max(500).trim(),
  media: z.array(z.string()),
});



interface ProductFormProps {
  initialData?: ProductType | null; //Must have "?" to make it optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<FeatureType[]>([]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          features: initialData.features.map((feature) => feature._id),

        }
      : {


          title: "",
          make: "",
          price: 10000,
          features: [],
          condition: "",
          year: 2010,
          mileage: 1,
          driveType: "",
          fuelType: "",
          consumption: 0.1,
          transmission: "",
          engineSize: 1,
          cylinder: 1,
          color: "",
          interiorColor: "",
          door: 2,
          status: "",
          description: "",
          categories: "",
          media: [],  
          lowmileage: "",
          numberofowner: 0,
          
        },
  });

  const handleKeyPress = ( e: React.KeyboardEvent<HTMLInputElement>| React.KeyboardEvent<HTMLTextAreaElement>) => { 
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
    getFeatures();
  }, []);


 

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Product</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Product</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />


      
        
      


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


          <FormField
            control={form.control}
            name="title"
            aria-label="Enter title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                  aria-label="Enter title"
                   type="text"
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />




          <FormField
              control={form.control}
              name="make"
              aria-label="Enter Car Brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Makes</FormLabel>
                  <FormControl>
                  <select aria-label="Enter Car Brand" {...field}>
                        {CarMakes.map((CarMakes) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Enter Car Brand" key={CarMakes.label}>
                            {CarMakes.label}
                          </option>
                        ))}
                      </select>       
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            /> 


            <FormField
              control={form.control}
              name="price"
              aria-label="Enter Price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                    aria-label="Enter Price"
                      type="number"
                      placeholder="Price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          <FormField
              control={form.control}
              name="condition"
              aria-label="Enter Condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conditions</FormLabel>
                  <FormControl>
                  <select  
                  aria-label="Enter Condition" {...field}>
                        {Conditions.map((Conditions) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Enter Condition"
                         
                          key={Conditions.key}>
                            {Conditions.label}
                          </option>
                        ))}
                      </select>       
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />   


            <FormField
              control={form.control}
              name="year"
              aria-label="Enter Manufacturing Year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input aria-label="Enter Manufacturing Year"
                      type="number"
                      placeholder="Year"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
   

            <FormField
              control={form.control}
              name="numberofowner"
              aria-label="Enter Number Of Owner(s)"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Of Owner</FormLabel>
                  <FormControl>
                    <Input aria-label="Enter Number Of Owner"
                      type="number"
                      placeholder="Enter Number Of Owner(s)"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="mileage"
              aria-label="Enter Mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input aria-label="Enter Mileage"
                      type="number"
                      placeholder="Mileage"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          <FormField
              control={form.control}
              name="lowmileage"
              aria-label="Low Mileage Situation "
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Low Mileage?</FormLabel>
                  <FormControl>
                  <select  
                  aria-label="Enter Condition" {...field}>
                        {IsLowMileage.map((IsLowMileage) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Enter Condition"
                          key={IsLowMileage.key}>
                            {IsLowMileage.label}
                          </option>
                        ))}
                      </select>       
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />  

   
   
          {features.length > 0 && (
              <FormField
                control={form.control}
                name="features"
                aria-label="Select Features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <MultiSelectFeature 
                        aria-label="Select Features"
                        placeholder="Features"
                        features={features}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (featureId) => featureId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}


            <FormField
              control={form.control}
              name="categories"
              aria-label="Select Category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl >
                  <select  {...field} aria-label="Select category"             
                  >
                        {Categories.map((Categories) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Select Status" key={Categories.name}>
                            {Categories.name}
                            
                          </option>
                        ))}
                        
                        </select>     
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />    
                        
                        

            <FormField
              control={form.control}
              name="status"
              aria-label="Select Status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl >
                  <select  {...field} aria-label="Select Status"                  
                  >
                        {Statuses.map((Statuses) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Select Status" key={Statuses.key}>
                            {Statuses.label}
                            
                          </option>
                        ))}
                        
                      </select>     
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />        

            <FormField
              control={form.control}
              name="driveType"
              aria-label="Enter Drive Type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drive Type</FormLabel>
                  <FormControl>
                  <select  {...field} aria-label="Enter Drive Type">
                        {driveTypes.map((driveTypes) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Enter Drive Type" key={driveTypes.key}>
                            {driveTypes.label}
                          </option>
                        ))}
                      </select>       
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />   

            <FormField
              control={form.control}
              name="fuelType"
              aria-label="Enter Fuel Type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <FormControl>
                  <select  {...field} aria-label="Enter Fuel Type">
                        {fuelTypes.map((fuelTypes) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Enter Fuel Type" key={fuelTypes.key}>
                            {fuelTypes.label}
                          </option>
                        ))}
                      </select>       
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />   

            <FormField
              control={form.control}
              name="consumption"
              aria-label="Enter Gas Consumption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumption</FormLabel>
                  <FormControl>
                    <Input aria-label="Enter Gas Consumption"
                      type="number"
                      placeholder="consumption"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              aria-label="Enter Transmission Type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <FormControl>
                  <select  {...field} aria-label="Enter Transmission Type">
                        {transmissions.map((transmissions) => (
                          <option className="overflow-visible bg-white"
                          aria-label="Enter Transmission Type" key={transmissions.key}>
                            {transmissions.label}
                          </option>
                        ))}
                      </select>       
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />   

            <FormField
              control={form.control}
              name="engineSize"
              aria-label="enter engine size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine Size</FormLabel>
                  <FormControl>
                    <Input aria-label="enter engine size"
                    type="number"
                      placeholder="Engine Size"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cylinder"
              aria-label="enter cylinder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cylinder</FormLabel>
                  <FormControl>
                    <Input aria-label="enter cylinder"
                    type="number"
                      placeholder="Cylinder"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              aria-label="enter exterior color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input aria-label="enter exterior color"
                    type="text"
                      placeholder="Color"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interiorColor"
              aria-label="enter interior color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interior Color</FormLabel>
                  <FormControl>
                    <Input aria-label="enter interior color"
                     type="text"
                      placeholder="Interior Color"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="door"
              aria-label="enter number of the doors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of the Doors</FormLabel>
                  <FormControl>
                    <Input aria-label="enter number of the doors"
                     type="number"
                      placeholder="Number of the Doors"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />



                  <FormField
                    control={form.control}
                    name="description"
                    aria-label="enter detailed description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          
                            aria-label="enter detailed description"
                            placeholder="Description"
                            {...field}
                            
                          />
                        </FormControl>
                        <FormMessage className="text-red-1" />
                      </FormItem>
                    )}
                  />

        <FormField
            control={form.control}
            name="media"
            aria-label="select images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                  aria-label="select images"
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
     

    
          <div className="flex gap-10">
         
            <Button type="submit" className="bg-blue-1 text-white" aria-label="click submit button">
              Submit
            </Button>
            <Button
            aria-label="click discard button"
              type="button"
              onClick={() => router.push("/products")}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
          

        </form>
      </Form>

   


    </div>

    
    
  );
};

export default ProductForm;
