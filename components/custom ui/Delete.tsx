"use client"

import { useState } from "react";
import { Trash2 } from "lucide-react";
import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteProps {
  item: string;
  id: string;
}

const Delete: React.FC<DeleteProps> = ({ item, id }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Map item to correct API and redirect path
  let itemType = item;
  if (item === "product") itemType = "products";
  else if (item === "feature") itemType = "features";
  else if (item === "category") itemType = "categories";
  else if (item === "make") itemType = "makes";
  else if (item === "drivetype") itemType = "drivetypes";
  else if (item === "fueltype") itemType = "fueltypes";
  else if (item === "transmission") itemType = "transmissions";
  else if (item === "status") itemType = "statuses";

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      });

      setLoading(false);

      if (res.ok) {
        toast.success(`${item} deleted`);
        router.replace(`/${itemType}`);
        window.location.reload(); 
      } else {
        toast.error("Failed to delete item");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 color="#e01f1f" className="h-6 w-6 color" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-grey-1">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 text-white" onClick={onDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
