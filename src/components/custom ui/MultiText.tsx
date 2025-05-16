import { useEffect, useState } from "react";

import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface MultiTextForTagProps {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export const MultiTextForTag: React.FC<MultiTextForTagProps> = ({
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addValue = (item: string) => {
    onChange(item);
    setInputValue("");
  };

  return (
    <>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addValue(inputValue);
          }
        }}
      />

      <div className="flex gap-1 flex-wrap mt-4">
        {value.map((item, index) => (
          <Badge key={index} className="">
            {item}
            <button
              className="ml-1 rounded-full outline-none hover:bg-destructive"
              onClick={() => onRemove(item)}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
};

// interface MultiTextProps {
//   placeholder: string;
//   value: { label: string; quantity: number }[];
//   onChange: (item: { label: string; quantity: number }) => void;
//   onRemove: (label: string) => void;
// }

// const MultiText: React.FC<MultiTextProps> = ({
//   placeholder,
//   value,
//   onChange,
//   onRemove,
// }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [quantityValue, setQuantityValue] = useState<number>(0);

//   const addValue = (item: string, quantity: number) => {
//     if (item.trim() && !value.some((v) => v.label === item)) {
//       onChange({ label: item, quantity });
//     }
//     setInputValue("");
//     setQuantityValue(0);
//   };

//   return (
//     <>
//       <div className="flex gap-2">
//         <Input
//           placeholder={placeholder}
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               addValue(inputValue, quantityValue);
//             }
//           }}
//         />
//         <Input
//           placeholder="Quantity"
//           type="number"
//           value={quantityValue}
//           onChange={(e) => setQuantityValue(Number(e.target.value))}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               addValue(inputValue, quantityValue);
//             }
//           }}
//         />
//       </div>

//       <div className="flex gap-1 flex-wrap mt-4">
//         {value.map((item, index) => (
//           <Badge key={index} className="bg-grey-1 text-white">
//             {item.label} - {item.quantity}
//             <button
//               className="ml-1 rounded-full outline-none hover:bg-red-1"
//               onClick={() => onRemove(item.label)}
//               type="button"
//             >
//               <X className="h-3 w-3" />
//             </button>
//           </Badge>
//         ))}
//       </div>
//     </>
//   );
// };

interface MultiTextForVariantsProps {
  value: { size: string; quantity: number; color: string }[];
  onChange: (item: { size: string; quantity: number; color: string }) => void;
  onRemove: (index: number) => void;
}

export const MultiTextForVariants: React.FC<MultiTextForVariantsProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const [sizeValue, setSizeValue] = useState("");
  const [quantityValue, setQuantityValue] = useState<number | undefined>(undefined);
  const [colorValue, setColorValue] = useState<string>('');

  const addValue = (size: string, quantity: number, color: string) => {
    // if (size.trim() && !value.some((v) => v.size === size)) {
    onChange({ size, quantity, color });
    // }
    setSizeValue("");
    setQuantityValue(undefined);
    setColorValue('');
  };

  return (
    <>
      <div className="flex gap-2 ">
        <Input
          placeholder={"size"}
          value={sizeValue}
          onChange={(e) => setSizeValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue(sizeValue, quantityValue!, colorValue);
            }
          }}
        />
        <Input
          placeholder="color"
          type="text"
          value={colorValue}
          onChange={(e) => setColorValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue(sizeValue, quantityValue!, colorValue);
            }
          }}
        />
        <Input
          placeholder="Quantity"
          type="number"
          value={quantityValue === undefined ? '' : quantityValue}
          onChange={(e) => setQuantityValue(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue(sizeValue, quantityValue!, colorValue);
            }
          }}
        />
      </div>

      <div className="flex gap-1 flex-wrap mt-4">
        {value.map((item, index) => (
          <Badge key={index}>
            {item.size}  - {item.color}- {item.quantity}
            <button
              className="ml-1 rounded-full outline-none hover:bg-red-500"
              onClick={() => onRemove(index)}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
};
interface MultiInputsForDimensionsProps {
  value: { length?: number; width?: number; height?: number };
  onChange: (item: { length: number; width: number; height: number }) => void;
}

export const MultiInputsForDimensions: React.FC<MultiInputsForDimensionsProps> = ({
  value,
  onChange,
}) => {
  const [lengthValue, setLengthValue] = useState<number | undefined>(value?.length || undefined);
  const [heightValue, setHeightValue] = useState<number | undefined>(value?.height || undefined);
  const [widthValue, setWidthValue] = useState<number | undefined>(value?.width || undefined);

  // Sync form value to local state when it changes
  useEffect(() => {
    setLengthValue(value?.length || undefined);
    setHeightValue(value?.height || undefined);
    setWidthValue(value?.width || undefined);
  }, [value]);

  const handleUpdate = (updated: {
    length?: number;
    width?: number;
    height?: number;
  }) => {
    const updatedValue = {
      length: updated.length ?? lengthValue!,
      width: updated.width ?? widthValue!,
      height: updated.height ?? heightValue!,
    };
    onChange(updatedValue);
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Length"
        type="number"
        value={lengthValue}
        onChange={(e) => {
          const val = Number(e.target.value);
          setLengthValue(val);
          handleUpdate({ length: val });
        }}
      />
      <Input
        placeholder="Width"
        type="number"
        value={widthValue}
        onChange={(e) => {
          const val = Number(e.target.value);
          setWidthValue(val);
          handleUpdate({ width: val });
        }}
      />
      <Input
        placeholder="Height"
        type="number"
        value={heightValue}
        onChange={(e) => {
          const val = Number(e.target.value);
          setHeightValue(val);
          handleUpdate({ height: val });
        }}
      />
    </div>
  );
};
// export default MultiText;
