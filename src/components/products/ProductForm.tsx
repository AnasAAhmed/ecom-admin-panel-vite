import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Delete from "../custom ui/Delete";
import { MultiInputsForDimensions, MultiTextForTag, MultiTextForVariants } from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import { InfoIcon, LoaderIcon } from "lucide-react";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { API_BASE } from "../../App";
import { uploadImages } from "../../lib/image-actions";
import { useQueryClient } from "@tanstack/react-query";
import { Editor } from "@toast-ui/react-editor";
import { initialText } from "../../lib/utils";


const formSchema = z.object({
  title: z.string()
    .min(2, "Title must be at least 2 characters long")
    .max(60, "Title must be at most 60 characters long")
    .regex(/^[a-zA-Z0-9\s]+$/, "Title must not contain any symbols"),
  description: z.string().min(2).max(400).trim(),
  category: z.string().min(2),
  detailDesc: z.string(),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  variants: z.array(
    z.object({
      size: z.string(),
      quantity: z.coerce.number().min(0),
      color: z.string(),
    })
  ),
  dimensions: z
    .object({
      length: z.coerce.number().optional(),
      width: z.coerce.number().optional(),
      height: z.coerce.number().optional(),
    })
    .refine(
      (val) => {
        const anyValue = val.length || val.width || val.height;
        const allFilled = val.length && val.width && val.height;
        return !anyValue || allFilled;
      },
      {
        message: "All 3 fields (length, width, height) are required if any is filled.",
      }
    ),
  weight: z.coerce.number().optional(),
  stock: z.coerce.number().min(1),
  price: z.coerce.number().min(1),
  expense: z.coerce.number(),
});


const ProductForm = ({ initialData }: { initialData?: ProductType | null; }) => {
  const router = useNavigate();
  const editorRef = useRef<any>(null);
  /*it will contain all current images url at first then
  all images url(that need to be remove/delete from cloud storage) will be remove in this array for ui/ux */
  const [oldImages, setOldImages] = useState<string[] | undefined>(initialData?.media || []);

  const [isSubmtting, setIsSubmtting] = useState(false);
  const [routing, setRouting] = useState(true);
  const [isConvert, setIsConvert] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  //it will contain urls of images that need to be remove/delete from cloud storage
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        ...initialData,
        collections: initialData.collections.map(
          (collection) => collection._id
        ),
        variants: initialData.variants.map((variant: any) => ({
          size: variant.size,
          quantity: variant.quantity,
          color: variant.color,
        })),
        dimensions: {
          length: initialData.dimensions?.length!,
          width: initialData.dimensions?.width!,
          height: initialData.dimensions?.height!,
        },
      }
      : {
        title: "",
        description: "",
        category: "",
        collections: [],
        tags: [],
        detailDesc: '',
        variants: [],
        stock: undefined,
        weight: undefined,
        dimensions: {},
        price: undefined,
        expense: undefined,
      },
  });
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const handleReset = () => {
    form.reset(initialData
      ? {
        ...initialData,
        collections: initialData.collections.map((collection) => collection._id),
        variants: initialData.variants.map((variant: any) => ({
          size: variant.size,
          color: variant.color,
          quantity: variant.quantity,
        })),
        dimensions: {
          length: initialData.dimensions?.length!,
          width: initialData.dimensions?.width!,
          height: initialData.dimensions?.height!,
        },
      }
      : {
        title: "",
        description: "",
        category: "",
        collections: [],
        tags: [],
        variants: [],
        detailDesc: '',
        weight: undefined,
        dimensions: {},
        stock: undefined,
        price: undefined,
        expense: undefined,
      });
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if ((!files || files.length === 0) && (!oldImages || oldImages.length === 0)) {
      toast.error("At least one product image is required.");
      return;
    }

    const totalQuantity = values.variants.reduce((total, v) => total + v.quantity, 0);
    if (totalQuantity > values.stock) {
      toast.error("Total variants quantity cannot exceed overall stock.");
      return;
    }

    try {
      setIsSubmtting(true);
      toast.loading(isConvert ? 'Converting & Uploading images...' : "Uploading images...");
      const uploadedUrls = await uploadImages({ images: files, isConvert, removeImages: imagesToRemove });
      if (uploadedUrls) {
        toast.success(uploadedUrls?.statusText)
      }
      toast.dismiss();
      toast.loading(initialData ? "Updating product..." : "Creating product...");

      const filteredOldImages = oldImages?.filter(
        (img) => !imagesToRemove.includes(img)
      ) || []

      const payload = {
        ...values,
        media: uploadedUrls ? [...uploadedUrls!.data!.uploaded!, ...filteredOldImages] : oldImages,
      };

      const url = initialData
        ? `${API_BASE}/api/admin/products/${initialData._id}`
        : `${API_BASE}/api/admin/products`;

      const res = await fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`${errorMessage} — Product ${initialData ? "update" : "creation"} failed.`);
      }
      toast.dismiss();
      toast.success(`Product ${initialData ? "updated" : "created"} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (initialData) {
        queryClient.invalidateQueries({ queryKey: ['product', initialData._id] });
      }


      if (routing) {
        router("/products");
      } else {
        handleReset();
      }
    } catch (err) {
      console.error("[product_submit_error]", err);
      toast.dismiss();
      toast.error(`Something went wrong. ${(err as Error).message}`);
    } finally {
      setIsSubmtting(false);
    }
  };

  useEffect(() => {
    const editorInstance = editorRef.current.getInstance();

    if (editorInstance) {
      const editableEl = editorInstance?.editor?.el?.querySelector('iframe')?.contentWindow?.document?.activeElement;
      editableEl?.blur();
    }

  }, []);
  return (
    <div className="p-10">
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        {initialData ? (
          <>
            <h1 className="text-xl sm:text-3xl font-semibold">Edit Product</h1>
            <Delete id={initialData._id} item="products" />
          </>

        ) : (
          <>
            <h1 className="text-xl sm:text-3xl font-semibold">Create Product</h1>
          </>

        )}
        <div className="flex gap-2 justify-center items-center">
          <Input type="checkBox" className="h-4 w-4 cursor-pointer" onChange={() => setRouting(!routing)} />
          <Label>No-Redirect</Label>
          <div className="cursor-pointer" title={"it won't redirect you back"}>
            <InfoIcon />
          </div>
        </div>
      </div>
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                    maxLength={60}
                  />
                </FormControl>
                <FormMessage className="text-destructive font-medium text-[15px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    rows={5}
                    maxLength={400}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-destructive font-medium text-[15px]" />
              </FormItem>
            )}
          />
          <ImageUpload
            value={files!}
            isConvert={isConvert}
            onImagesRemove={(url) => {
              setImagesToRemove((prev) => Array.from(new Set([...prev, url])));
              setOldImages((prev) => prev?.filter((item) => item !== url));
            }}
            initialImages={oldImages}
            onChange={(newFiles) => setFiles(newFiles)}
            onIsConvert={(onIsConvert) => setIsConvert(onIsConvert)}
            onRemove={(index) => {
              const updated = [...files!];
              updated.splice(index, 1);
              setFiles(updated);
            }}
          />
          <div className="md:grid md:grid-cols-3 gap-8 ">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price* ($)</FormLabel>
                  <FormControl className="max-md:mb-4">
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense ($)</FormLabel>
                  <FormControl className="max-md:mb-4">
                    <Input
                      type="number"
                      placeholder="Expense"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Stock*</FormLabel>
                  <FormControl className="max-md:mb-4">
                    <Input
                      type="number"
                      placeholder="Stock"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>
                  <FormControl className="max-md:mb-4">
                    <Input
                      placeholder="Category"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">Weight <span className="cursor-pointer" title={` if not provide this run on sever:- export function estimateWeight(categoryOrTitle: string): number {
  const input = categoryOrTitle.toLowerCase();

  if (input.includes("t-shirt") || input.includes("shirt")) return 0.3;
  if (input.includes("hoodie") || input.includes("jacket")) return 0.6;
  if (input.includes("shoes") || input.includes("sneakers")) return 1.0;
  if (input.includes("pants") || input.includes("trousers")) return 0.5;
  if (input.includes("accessory") || input.includes("belt") || input.includes("cap")) return 0.2;

  return 0.5;
}`}><InfoIcon size={'1rem'} /></span></FormLabel>
                  <FormControl className="max-md:mb-4">
                    <Input
                      placeholder="Weight"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collections"
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Collections</FormLabel>
                  <FormControl className="max-md:mb-4">
                    <MultiSelect
                      placeholder="Collections"
                      value={field.value}
                      onChange={(_id) =>
                        field.onChange([...field.value, _id])
                      }
                      onRemove={(idToRemove) =>
                        field.onChange([
                          ...field.value.filter((id) => id !== idToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">Tags <span className="cursor-pointer" title={`Tags max 5 it can be added by pressing enter(before submitting whole form) after filling input with single value, then it will get empty so you can add more`}><InfoIcon size={'1rem'} /></span></FormLabel>
                  <FormControl className="max-md:mb-4">
                    <MultiTextForTag
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">Dimensions <span className="cursor-pointer" title={`length | width | height (Three of them is required if any of the three field is not empty)`}><InfoIcon size={'1rem'} /></span></FormLabel>
                  <FormControl className="max-md:mb-4">
                    <MultiInputsForDimensions
                      value={field.value}
                      onChange={(value) =>
                        field.onChange(
                          { width: value.width, height: value.height, length: value.length },
                        )
                      }

                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">Variants <span className="cursor-pointer" title={`Size | Color | Quantity (Quantity is required if any of size and color field is not empty), it can be added by pressing enter(before submitting whole form) after filling inputs, then it will get empty so you can add more`}><InfoIcon size={'1rem'} /></span></FormLabel>
                  <FormControl className="max-md:mb-4">
                    <MultiTextForVariants
                      value={field.value}
                      onChange={(value) =>
                        field.onChange([
                          ...field.value,
                          { size: value.size, color: value.color, quantity: value.quantity },
                        ])
                      }
                      onRemove={(index) =>
                        field.onChange(field.value.filter((_, i) => i !== index))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-medium text-[15px]" />
                </FormItem>
              )}
            />

          </div>
          <Controller
            name="detailDesc"
            control={form.control}
            defaultValue=""
            render={({ field }) => (
              <Editor
                ref={editorRef}
                initialValue={field.value || initialText}
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                onChange={() => {
                  const html = editorRef.current?.getInstance().getHTML();
                  field.onChange(html);
                }}
              />
            )}
          />

          <div className="flex gap-10">
            <Button type="submit" disabled={isSubmtting}>
              {isSubmtting ? <LoaderIcon className="animate-spin mx-3" /> : initialData ? "Save" : "Submit"}
            </Button>
            <Button
              type="button"
              onClick={() => router("/products")}
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
      {JSON.stringify(form.formState.errors).replace('{}', '')}
    </div>
  );
};

export default ProductForm;

