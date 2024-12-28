"use client";

import * as React from "react";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { IsLowMileage } from "../Shared/lowmileage";

interface MultiSelectProps {
  placeholder: string;
  value: number[];
  onChange: (value: number) => void;
  onRemove: (value: number) => void;
}

const MultiSelectLowMileage: React.FC<MultiSelectProps> = ({
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  let selected = value.map((id) => IsLowMileage.find((item) => item.id === id)) || [];

  const selectLowMileage = IsLowMileage.filter((item) => !selected.includes(item));

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex flex-wrap border rounded-md">
        {selected.map((item) => (
          <Badge key={item?.id}>
            {item?.label}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => item?.id !== undefined && onRemove(item.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {selectLowMileage.map((item) => (
              <CommandItem
                key={item.id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(item.id);
                  setInputValue("");
                }}
                className="overflow-visible bg-white hover:bg-grey-2 cursor-pointer"
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelectLowMileage;