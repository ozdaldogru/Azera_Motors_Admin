import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash2 } from "lucide-react";
import * as React from "react"
import { Button } from "../ui/button";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 border border-grey-1 p-4 rounded-lg">
        {value.map((url) => (
          <div key={url} className="border border-black p-4 rounded-lg relative w-[200px] h-[250px]">
            <div className="absolute top-0 right-0 z-10">

                <Trash2 color="#e01f1f" className="h-6 w-6" onClick={() => onRemove(url)}/>

            </div>
            <Image
              src={url}
              sizes="100vw, 50vw,33vw "
              alt="features"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        ))}
      </div>

      <CldUploadWidget uploadPreset= {uploadPreset} onUpload={onUpload}>
        {({ open }) => {
          return (
            <Button type="button" onClick={() => open()} className="bg-[#7f8c8d] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
