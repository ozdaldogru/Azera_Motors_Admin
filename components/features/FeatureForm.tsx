"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {Form,FormControl, FormField, FormItem,FormLabel, FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";


const formSchema = z.object({
  title: z.string().min(2).max(50),
});

interface FeatureFormProps {
  initialData?: FeatureType | null; //Must have "?" to make it optional
}

const FeatureForm: React.FC<FeatureFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
        },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/features/${initialData._id}`
        : "/api/features";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Feature ${initialData ? "updated" : "created"}`);
        window.location.href = "/features";
        router.push("/features");
      }
    } catch (err) {
      console.log("[features_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Feature</p>
          <Delete id={initialData._id} item="feature" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Feature</p>
      )}
      <Separator className="bg-gray-300 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
          <Button type="submit"  className="bg-[#186a3b] text-white" >
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/features")}
               className="bg-[#cb4335] text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeatureForm;
