import { CldUploadWidget } from "next-cloudinary";
import { Plus } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {
  // Local state to collect all images
  const [images, setImages] = React.useState<string[]>(value ?? []);

  React.useEffect(() => {
    setImages(value ?? []);
  }, [value]);

  return (
    <div>
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{ multiple: true }}
        onSuccess={(result: any) => {
          const urls = Array.isArray(result.info)
            ? result.info.map((img: any) => img.secure_url)
            : [result.info.secure_url];
          setImages((prev) => {
            const uniqueUrls = Array.from(new Set([...prev, ...urls]));
            onChange(uniqueUrls);
            return uniqueUrls;
          });
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            onClick={() => open()}
            className="bg-[#7f8c8d] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        )}
      </CldUploadWidget>
      <div className="flex flex-wrap gap-2 mt-2">
        {images.filter(Boolean).map((url) => (
          <div key={url} className="relative flex flex-col items-center">
            <Image
              src={url}
              alt="uploaded"
              className="w-24 h-24 object-cover rounded"
              width={96}
              height={96}
            />
            <button
              type="button"
              onClick={() => {
                const filtered = images.filter((image) => image !== url);
                setImages(filtered);
                onRemove(url);
                onChange(filtered);
              }}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
