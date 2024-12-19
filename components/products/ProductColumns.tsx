"use client";

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "make",
    header: "Make",
  },
  {
    accessorKey: "price",
    header: "Price ($)",
  },
  {
    accessorKey: "condition",
    header: "Conditions",
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
    accessorKey: "features",
    header: "Features",
    cell: ({ row }) => row.original.features.map((feature) => feature.title).join(", "),
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
    accessorKey: "consumption",
    header: "Consumption",
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
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original._id} />,
  },
];
