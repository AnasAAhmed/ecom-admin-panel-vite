import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Loader2, X } from "lucide-react";
import { fetchCollections } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

interface MultiSelectProps {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  // const [searchParams] = useSearchParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["collections", ''],
    queryFn: () => fetchCollections('', '', 0, '', ''),
  });
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  if (isLoading) { return <Loader2 className="animate-spin" />; }
  if (!data?.data.length) return isError ? JSON.stringify(data) : JSON.stringify(error);

  let selected: CollectionType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      data.data.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  const selectables = data.data.filter((collection) => !selected.includes(collection));

  return (
    <Command className="overflow-visible bg-primary-foreground">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((collection) => (
          <Badge key={collection._id}>
            {collection.title}
            <button type="button" className="ml-1 hover:text-red-500" onClick={() => onRemove(collection._id)}>
              <X className="h-3 w-3 cursor-pointer" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          className="font-medium text-[15px]"
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute bg-primary-foreground w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {selectables.map((collection) => (
              <CommandItem
                key={collection._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(collection._id);
                  setInputValue("");
                }}
                className="hover:bg-grey-2 cursor-pointer font-medium text-[14px]"
              >
                {collection.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;
