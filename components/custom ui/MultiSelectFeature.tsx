"use client";

import * as React from "react"
import { Command,CommandGroup,CommandInput,CommandItem,} from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface MultiSelectProps {
  placeholder: string;
  features: FeatureType[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelectFeature: React.FC<MultiSelectProps> = ({
  placeholder,
  features,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  let selected: FeatureType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      features.find((feature) => feature._id === id)
    ) as FeatureType[];
  }

  const selectTables = features.filter((feature) => !selected.includes(feature)); 

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex flex-wrap border rounded-md">
        {selected.map((feature) => (
          <Badge key={feature._id}>
            {feature.title}
            <button id="image upload button"type="button" className="ml-1 hover:text-red-1" onClick={() => onRemove(feature._id)}>
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
            {selectTables.map((feature) => (
              <CommandItem
                key={feature._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(feature._id);
                  setInputValue("");
                }}
                className="overflow-visible bg-white hover:bg-grey-2 cursor-pointer"
              >
                {feature.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelectFeature;
