import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { getClosestAspectRatioName, validateImages } from "../../lib/image-actions";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";


// interface ImageUploadProps {
//   value: string[];
//   onChange: (value: string) => void;
//   onRemove: (value: string) => void;
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({
//   onChange,
//   onRemove,
//   value,
// }) => {
//   const onUpload = (result: any) => {
//     onChange(result.info.secure_url);
//   };

//   return (
//     <div>
//       <div className="mb-4 flex flex-wrap items-center gap-4">
//         {value.map((url) => (
//           <div key={url} className="relative w-[200px] h-[200px]">
//             <div className="absolute top-0 right-0 z-10">
//               <Button type="button" onClick={() => onRemove(url)} size="sm" className="bg-destructive">
//                 <Trash className="h-4 w-4" />
//               </Button>
//             </div>
//             <img
//               src={url}
//               alt="collection"
//               className="object-cover rounded-lg"
//             />
//           </div>
//         ))}
//       </div>

//       {/* <CldUploadWidget options={{ maxFiles: 4 }} uploadPreset="hhafeez" onUpload={onUpload}>
//         {({ open }) => {
//           return ( */}
//             <Button type="button" onClick={() => open()}>
//               <Plus className="h-4 w-4 mr-2" />
//               Upload Image
//             </Button>
//           {/* );
//         }}
//       </CldUploadWidget> */}
//     </div>
//   );
// };

// export default ImageUpload;

interface ImageUploadProps {
  value: File[];
  isConvert: boolean;
  isCollection?: boolean;
  isSeparate?: boolean;
  onIsConvert: (value: boolean) => void;
  onImagesRemove: (value: string) => void;
  onChange: (value: File[]) => void;
  onRemove: (index: number) => void;
  initialImages?: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({ isSeparate = false, isCollection = false, onImagesRemove, initialImages, onChange, isConvert, onIsConvert, onRemove, value }) => {
  const [ratios, setRatios] = useState<string[]>([]);

  useEffect(() => {
    const promises = value.map((file) => {
      return new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const name = getClosestAspectRatioName(img.naturalWidth, img.naturalHeight);
          resolve(name);
        };
        img.src = URL.createObjectURL(file);
      });
    });

    Promise.all(promises).then(setRatios);
  }, [value]);
  const handleIsConvertChange = async (value: boolean) => {
    const booleanValue = Boolean(value);
    onIsConvert(booleanValue);
  };
  const handleOnImagesRemove = async (value: string) => {
    const stringValue = String(value);
    onImagesRemove(stringValue);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const filesArray = Array.from(files);
    const invalidFormatFiles = filesArray.filter(
      (file) => file.type !== "image/webp" && file.type !== "image/avif"
    );
    if (invalidFormatFiles.length > 0) {
      toast.warning(
        "Please prefer uploading images in .webp or .avif format for better performance and efficient storage. While formats like .jpg and .png are supported on the frontend (via Next.js <Image />) which turns any image in webp anyway but, optimized formats help reduce storage size and load faster."
      );
    }
    const result = await validateImages([...value, ...files], isCollection, isSeparate);
    if (!result.valid) {
      toast.warning(result.message);
      e.target.value = ''

      return;
    }

    onChange([...value, ...files]);
    e.target.value = ''
  };
  const invalidFormatFiles = value.filter(
    (file) => file.type !== "image/webp" && file.type !== "image/avif"
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((file, index) => (
          <div key={index} className="relative w-[20%] ">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                onClick={() => onRemove(index)}
                size="sm"
                title="remove uploaded image"
                className="bg-destructive"
              >
                <Plus className="h-4 w-4 rotate-45" />

              </Button>
            </div>
            <div className="absolute bottom-0 right-0 z-10">
              <Badge
                title="Uploaded image"
                className="bg-blue-500 text-white"
              >
                New* (Unsave)
              </Badge>
              {ratios[index] && (
                <Badge title="Aspect ratio" className="bg-yellow-500 text-white">
                  aspect ratio {ratios[index]}
                </Badge>
              )}
            </div>
            <img
              alt={"preview " + file.name}
              title={"preview " + file.name}
              src={URL.createObjectURL(file)}
              className="object-cover rounded-md ring-[0.4px] ring-blue-300  border w-full h-full"
            />
          </div>
        ))}
        {initialImages && initialImages.map((url, index) => (
          <div key={index} className="relative w-[20%] ">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                title="delete current image"
                onClick={() => handleOnImagesRemove(url)}
                size="sm"
                className="bg-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 right-0 z-10">
              <Badge
                title="current collection image"
                className="bg-blue-400 text-white"
              >
                Current
              </Badge>
            </div>
            <img
              src={url}
              alt="current collection image"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = "/fallback.png";
              }}
              className="object-cover ring-[0.4px] ring-blue-300 border rounded-md"
            />
          </div>
        ))}
      </div>
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="imageUpload"
      />
      <Button title="Image upload, intructions:1. max value of images should be (4), 2. Each image must be less then 3MB in size*" type="button" className="py-0 my-0">
        <Label htmlFor="imageUpload" className="flex justify-between items-center cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Upload Image max (4)
        </Label>
      </Button>
      <p className="text-sm text-muted-foreground">
        Each image must be less than <strong>3MB</strong>.
      </p>
      {invalidFormatFiles.length > 0 && <>
        <input
          type="checkbox"
          onChange={() => handleIsConvertChange(!isConvert)}
          className=""
          id="isConvert"
        />
        <Label htmlFor="isConvert">Some of these four image are not optimized format etc. webp/avif  Convert images to webp and then save</Label>
      </>
      }
    </div>
  );
};
export default ImageUpload
