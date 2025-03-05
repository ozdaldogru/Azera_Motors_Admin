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

interface DriveTypeFormProps {
  initialData?: DriveTypeType | null; //Must have "?" to DriveType it optional
}

const DriveTypeForm: React.FC<DriveTypeFormProps> = ({ initialData }) => {
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
        ? `/api/drivetypes/${initialData._id}`
        : "/api/drivetypes";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`DriveType ${initialData ? "updated" : "created"}`);
        window.location.href = "/drivetypes";
        router.push("/drivetypes");
      }
    } catch (err) {
      console.log("[drivetypes_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit DriveType</p>
          <Delete id={initialData._id} item="drivetype" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create DriveType</p>
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
              onClick={() => router.push("/drivetypes")}
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

export default DriveTypeForm;
