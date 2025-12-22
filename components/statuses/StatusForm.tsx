"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";

const formSchema = z.object({
  title: z.string().min(2).max(50),
});

interface StatusFormProps {
  initialData?: StatusType | null;
}

const StatusForm: React.FC<StatusFormProps> = ({ initialData }) => {
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
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/statuses/${initialData._id}`
        : "/api/statuses";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Status ${initialData ? "updated" : "created"}`);
        window.location.href = "/statuses";
        router.push("/statuses");
      }
    } catch (err) {
      console.log("[statuses_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="h-screen p-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Status</p>
          <Delete id={initialData._id} item="status" />
        </div>
      ) : (
        <p className="text-heading1-bold text-[35px]">Create Status</p>
      )}
      <Separator className="bg-gray-300 dark:bg-gray-700 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                    className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <Button type="submit" className="bg-[#186a3b] dark:bg-green-700 text-white">
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/statuses")}
              className="bg-[#cb4335] dark:bg-red-700 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StatusForm;
