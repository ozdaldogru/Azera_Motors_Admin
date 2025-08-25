"use client";

import * as React from "react";
import { useTheme } from '@/lib/ThemeProvider';
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string[] | string;
  pageSize?: number;
}

export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  searchKey,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Memoize filtered data for performance
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data;
    const keys = Array.isArray(searchKey) ? searchKey : [searchKey];
    const search = debouncedSearchTerm.toLowerCase().trim();
    return data.filter((item) =>
      keys.some((key) => {
        let value = item[key];
        if (value === undefined || value === null) return false;
        // Handle nested objects (e.g., { status: { title: "Sold" } })
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          value = value.title ?? value.name ?? JSON.stringify(value);
        }
        if (Array.isArray(value)) {
          return value
            .join(", ")
            .toLowerCase()
            .trim()
            .includes(search);
        }
        return value
          .toString()
          .toLowerCase()
          .trim()
          .includes(search);
      })
    );
  }, [data, debouncedSearchTerm, searchKey]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: currentPageSize,
      },
    },
  });

  // Update pageSize when changed
  useEffect(() => {
    table.setPageSize(currentPageSize);
  }, [currentPageSize, table]);

  const { theme } = useTheme();
  return (
    <div className="py-5">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 sm:grid-cols-2flex space-around">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
        </div>
        {/* Page size selector inside the table */}
        <div className="flex items-center mb-4">
          <span className={`mr-2 ${theme === 'dark' ? 'text-white' : ''}`}>Items per page:</span>
          <select
            value={currentPageSize}
            onChange={e => setCurrentPageSize(Number(e.target.value))}
            className={`border rounded px-2 py-1 ${theme === 'dark' ? 'bg-black text-white border-gray-700' : ''}`}
          >
            {[10, 20, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-slate-950 text-white text-[20px]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}