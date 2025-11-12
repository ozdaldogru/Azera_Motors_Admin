"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";

const formSchema = z.object({
  title: z.string().min(2).max(50),
});

interface MakeFormProps {
  initialData?: MakeType | null;
}

const MakeForm: React.FC<MakeFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // NEW: existing makes for duplicate check
  const [existingMakes, setExistingMakes] = useState<string[]>([]);

  useEffect(() => {
    const loadMakes = async () => {
      try {
        const res = await fetch("/api/makes");
        if (!res.ok) return;
        const data = await res.json();
        // accept array of objects or strings
        const titles = Array.isArray(data)
          ? data.map((m: any) => (typeof m === "string" ? m : m.title || m.name || "")).filter(Boolean)
          : [];
        setExistingMakes(titles.map((t: string) => t.toLowerCase()));
      } catch (err) {
        console.log("[makes_fetch]", err);
      }
    };
    loadMakes();
  }, []);

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
      const title = values.title.trim();
      if (!title) {
        toast.error("Title is required");
        return;
      }

      const titleLower = title.toLowerCase();

      // If creating new make, block duplicates.
      // If editing, allow same title if unchanged, but block if changing to an existing one.
      const isDuplicate = existingMakes.includes(titleLower) && (!initialData || initialData.title.toLowerCase() !== titleLower);

      if (isDuplicate) {
        toast.error("Make already exists");
        return;
      }

      setLoading(true);
      const url = initialData
        ? `/api/makes/${initialData._id}`
        : "/api/makes";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Make ${initialData ? "updated" : "created"}`);
        // refresh list page
        router.push("/makes");
      } else {
        const text = await res.text().catch(() => "Request failed");
        toast.error(text || "Something went wrong! Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.log("[makes_POST]", err);
      toast.error("Something went wrong! Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Make</p>
          <Delete id={initialData._id} item="make" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Make</p>
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
            <Button type="submit" className="bg-[#186a3b] dark:bg-green-700 text-white" disabled={loading}>
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/makes")}
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

export default MakeForm;
