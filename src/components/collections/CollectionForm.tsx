"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
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
import { useState } from "react";
import Delete from "../custom ui/Delete";
import { LoaderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE } from "../../App";
import { uploadImages } from "../../lib/image-actions";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(3, 'title must contain at least 3 character(s)').max(20).regex(/^[a-z0-9-]+$/, "title can only contain letters, numbers, and hyphens without spaces & under scores"),
  description: z.string().min(3, 'description must contain at least 3 character(s)').max(500).trim(),
});

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const router = useNavigate();
  const [isConvert, setIsConvert] = useState(false);
  const [oldImage, setOldImage] = useState<string>(initialData?.image! || '');
  const [files, setFiles] = useState<File | null>(null);
  const [imagesToRemove, setImagesToRemove] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
        title: "",
        description: "",
      },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    if (!files) {
      toast.error("Media images are missing");
      return;
    }

    try {
      setLoading(true);

      toast.loading(isConvert ? 'Converting & Uploading images' : "Uploading images...");

      const uploadedUrls = await uploadImages({ images: [files], isConvert, removeImages: [imagesToRemove!] });
      toast.dismiss();
      toast.loading(initialData ? "Updating collection..." : "Creating collection...");

      const payload = {
        ...values,
        image: uploadedUrls![0] || oldImage,
      };

      const url = initialData
        ? `${API_BASE}/api/admin/collections/${initialData._id}`
        : `${API_BASE}/api/admin/collections`;
      const res = await fetch(url, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`${errorMessage} — Product ${initialData ? "update" : "creation"} failed.`);
      }
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      if (initialData) {
        queryClient.invalidateQueries({ queryKey: ['collection', initialData._id] });
      }
      toast.success(`Collection ${initialData ? "updated" : "created"}`);
      router("/collections");

    } catch (err) {
      console.log("[collections_POST]", err);
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-xl sm:text-3xl">Edit Collection</p>
          <Delete id={initialData._id} item="collections" />
        </div>
      ) : (
        <p className="text-xl sm:text-3xl font-semibold">Create Collection</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} rows={5} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl> */}
          <ImageUpload
            initialImages={oldImage ? [oldImage] : []}
            value={files ? [files] : []}
            isConvert={isConvert}
            isCollection={true}
            onIsConvert={(onIsConvert) => setIsConvert(onIsConvert)}
            onImagesRemove={(onImagesRemove) => {
              setImagesToRemove(onImagesRemove);
              setOldImage('');
            }}
            onChange={(file) => setFiles(file[0])}
            onRemove={() => setFiles(null)}
          />
          {/* </FormControl>
                <FormMessage className="text-red-1"/>
              </FormItem>
            )}
          /> */}
          <div className="flex gap-10">
            <Button type="submit" >
              {loading && <LoaderIcon className="animate-spin mr-1" />}
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router("/collections")}

            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
