"use client";

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [

  {
    accessorKey: "make",
    header: "Make",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.make}
      </Link>
    ),
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "price",
    header: "Price ($)",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "mileage",
    header: "Mileage",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "driveType",
    header: "Drive Type",
  },
  {
    accessorKey: "fuelType",
    header: "Fuel Type",
  },
  {
    accessorKey: "transmission",
    header: "Transmission",
  },
  {
    accessorKey: "engineSize",
    header: "Engine Size",
  },
  {
    accessorKey: "cylinder",
    header: "Cylinder",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "interiorColor",
    header: "Interior Color",
  },
  {
    accessorKey: "door",
    header: "Number Of Doors",
  },
  {
    accessorKey: "categories",
    header: "Categories",
  },
  {
    accessorKey: "totalCost",
    header: "Total Cost ($)",
 
  },
  {
    accessorKey: "soldPrice",
    header: "Sold Price ($)",
  },
  {
    accessorKey: "soldDate",
    header: "Sold Date",
  },

  
  {
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original._id} />,
  },
];
