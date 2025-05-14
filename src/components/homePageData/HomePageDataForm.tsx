
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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
import { useState } from "react";
import { toast } from "sonner";
import Delete from "../custom ui/Delete";
import { MultiTextForTag } from "../custom ui/MultiText";
import { InfoIcon, LoaderIcon } from "lucide-react";
import { Button } from "../ui/button";
import { API_BASE } from "../../App";
import { useQueryClient } from "@tanstack/react-query";


export const homePageSchema = z.object({
    seo: z.object({
        title: z.string().optional(),
        desc: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        url: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        alt: z.string().optional(),
    }).optional(),

    hero: z.object({
        heading: z.string().optional(),
        text: z.string().optional(),
        imgUrl: z.string().min(1, "Media URL is required"),
        shade: z.string().optional(),
        textColor: z.string().optional(),
        link: z.string().min(1, "Link is required"),
        textPosition: z.string().optional(),
        textPositionV: z.string().optional(),
        buttonText: z.string().optional(),
        isVideo: z.boolean(),
    }),

    collections: z.array(
        z.object({
            heading: z.string().optional(),
            text: z.string().optional(),
            imgUrl: z.string().min(1, "Image URL is required"),
            shade: z.string().optional(),
            textColor: z.string().optional(),
            link: z.string().min(1, "Link is required"),
            textPosition: z.string().optional(),
            textPositionV: z.string().optional(),
            buttonText: z.string().optional(),
            collectionId: z.string().min(1, "Collection ID is required"),
            isVideo: z.boolean(),
        })
    ),
});

interface HomePageDataFormProps {
    initialData?: HomePage | null;
}

const HomePageDataForm: React.FC<HomePageDataFormProps> = ({ initialData }) => {
    const [isSubmtting, setIsSubmtting] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof homePageSchema>>({
        resolver: zodResolver(homePageSchema),
        defaultValues: initialData
            ? {
                seo: {
                    title: initialData.seo?.title || "",
                    desc: initialData.seo?.desc || "",
                    keywords: initialData.seo?.keywords || [],
                    url: initialData.seo?.url || "",
                    width: initialData.seo?.width || undefined,
                    height: initialData.seo?.height || undefined,
                    alt: initialData.seo?.alt || "",
                },
                hero: {
                    heading: initialData.hero?.heading || "",
                    text: initialData.hero?.text || "",
                    imgUrl: initialData.hero.imgUrl,
                    shade: initialData.hero?.shade || "",
                    textColor: initialData.hero?.textColor || "",
                    link: initialData.hero.link,
                    textPosition: initialData.hero?.textPosition || "",
                    textPositionV: initialData.hero?.textPositionV || "",
                    buttonText: initialData.hero?.buttonText || "",
                    isVideo: initialData.hero.isVideo || false,
                },
                collections: initialData.collections.map((item: any) => ({
                    heading: item.heading || "",
                    text: item.text || "",
                    imgUrl: item.imgUrl,
                    shade: item.shade || "",
                    textColor: item.textColor || "",
                    link: item.link,
                    textPosition: item.textPosition || "",
                    textPositionV: item.textPositionV || "",
                    buttonText: item.buttonText || "",
                    collectionId: item.collectionId,
                    isVideo: item.isVideo || false,
                })),
            }
            : {
                seo: {
                    title: "",
                    desc: "",
                    keywords: [],
                    url: "",
                    width: undefined,
                    height: undefined,
                    alt: "",
                },
                hero: {
                    heading: "",
                    text: "",
                    imgUrl: "",
                    shade: "",
                    textColor: "",
                    link: "",
                    textPosition: "",
                    textPositionV: "",
                    buttonText: "",
                    isVideo: false,
                },
                collections: [{
                    heading: "",
                    text: "",
                    imgUrl: "",
                    shade: "",
                    textColor: "",
                    link: "",
                    textPosition: "",
                    textPositionV: "",
                    buttonText: "",
                    collectionId: "",
                    isVideo: false,
                }],
            },
    });
    // const handleKeyPress = (
    //     e:
    //         | React.KeyboardEvent<HTMLInputElement>
    //         | React.KeyboardEvent<HTMLTextAreaElement>
    // ) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //     }
    // };

    const onSubmit = async (values: z.infer<typeof homePageSchema>) => {
        console.log("Form submitted!", values);

        try {
            setIsSubmtting(true);
            toast.loading(initialData ? "Updating..." : "Creating...");

            const res = await fetch(`${API_BASE}/api/admin/home-page`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                toast.dismiss();
                toast.error(JSON.stringify(await res))
                const errorMessage = await res.text();
                throw new Error(`${errorMessage} — Hompage Data ${initialData ? "update" : "creation"} failed.`);
            }
            toast.dismiss();

            toast.success(`Hompage Data ${initialData ? "updated" : "created"} successfully.`);
            queryClient.invalidateQueries({ queryKey: ['hompage'] });


        } catch (err) {
            console.error("[Hompage_Data_post]", err);
            toast.dismiss();

            toast.error(`Something went wrong. ${(err as Error).message}`);
        } finally {
            setIsSubmtting(false);
        }
    };

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "collections",
    });

    return (
        <div className="p-10">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">

                <h1 className="text-xl sm:text-3xl font-semibold">Edit Store's HomePage</h1>
                {initialData && <Delete id={initialData._id} item="home-page" />}

            </div>
            <Separator className="bg-grey-1 mt-4 mb-7" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <h1 className="font-medium text-primary text-2xl">Seo Data:</h1>
                    <div className="md:grid md:grid-cols-3 gap-8 ">
                        {['seo.title', 'seo.url'].map((i, _) => (
                            <FormField
                                key={i}
                                control={form.control}
                                name={(i as "seo.title" | "seo.url")}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{(i.split('.')[1])}</FormLabel>
                                        <FormControl className="max-md:mb-4">
                                            <Input
                                                type="text"
                                                placeholder={(i.split('.')[1])}
                                                {...field}
                                            // onKeyDown={handleKeyPress}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive font-medium text-sm" />
                                    </FormItem>
                                )}
                            />
                        ))}


                        {['seo.height', 'seo.width'].map((i, _) => (
                            <FormField
                                key={i}
                                control={form.control}
                                name={(i as "seo.height" | "seo.width")}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{(i.split('.')[1])}</FormLabel>
                                        <FormControl className="max-md:mb-4">
                                            <Input
                                                type="number"
                                                placeholder={(i.split('.')[1])}
                                                {...field}
                                            // onKeyDown={handleKeyPress}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive font-medium text-sm" />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <FormField

                            control={form.control}
                            name="seo.keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1">Keywords <span className="cursor-pointer" title={`Keywords max 5 it can be added by pressing enter(before submitting whole form) after filling input with single value, then it will get empty so you can add more`}><InfoIcon size={'1rem'} /></span></FormLabel>
                                    <FormControl className="max-md:mb-4">
                                        <MultiTextForTag
                                            placeholder="Keywords"
                                            value={field.value!}
                                            onChange={(tag) => field.onChange([...field.value!, tag])}
                                            onRemove={(keywordToRemove) =>
                                                field.onChange([
                                                    ...field.value!.filter((keyword) => keyword !== keywordToRemove),
                                                ])
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-destructive font-medium text-sm" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="seo.desc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description*</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description"
                                            {...field}
                                            rows={5}
                                            maxLength={400}
                                        // onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-destructive font-medium text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h1 className="font-medium text-primary text-2xl">Hero Section:</h1>
                    <div className="md:grid md:grid-cols-3 gap-8 ">
                        <FormField
                            control={form.control}
                            name="hero.text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description*</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description"
                                            {...field}
                                            rows={5}
                                            maxLength={400}
                                        // onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-destructive font-medium text-sm" />
                                </FormItem>
                            )}
                        />
                        {['hero.buttonText', "hero.textPositionV", "hero.textPosition", "hero.textColor", "hero.link", "hero.heading", "hero.shade", "hero.imgUrl"].map((i, _) => (
                            <FormField
                                key={i}
                                control={form.control}
                                name={(i as "hero.buttonText" | "hero.textPositionV" | "hero.textPosition" | "hero.textColor" | "hero.link" | "hero.heading" | "hero.shade" | "hero.imgUrl")}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{(i.split('.')[1])}</FormLabel>
                                        <FormControl className="max-md:mb-4">
                                            <Input
                                                type="text"
                                                placeholder={(i.split('.')[1])}
                                                {...field}
                                            // onKeyDown={handleKeyPress}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive font-medium text-sm" />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <FormField
                            control={form.control}
                            name="hero.isVideo"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="cursor-pointer">Is media url is Video format</FormLabel>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-destructive font-medium text-sm" />
                                </FormItem>
                            )}
                        />

                    </div>
                    <h1 className="font-medium text-primary text-2xl">Collection Sections:</h1>
                    <div className="md:grid md:grid-cols-2 gap-8 ">
                        {fields.map((field, index) => (
                            <div key={field.id} className="border p-4 mb-4 rounded">
                                <FormField
                                    control={form.control}
                                    name={`collections.${index}.text`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl className="mb-4">
                                                <Textarea
                                                    placeholder="Description"
                                                    {...field}
                                                    rows={5}
                                                    maxLength={400}
                                                // onKeyDown={handleKeyPress}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {[`collections.${index}.heading`, `collections.${index}.link`, `collections.${index}.buttonText`, `collections.${index}.textPositionV`, `collections.${index}.shade`, `collections.${index}.textColor`, `collections.${index}.textPosition`, `collections.${index}.collectionId`, `collections.${index}.imgUrl`].map((i, _) => (
                                    <FormField
                                        key={i}
                                        control={form.control}
                                        name={(i as any)}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mt-4">{(i.split('.')[2])}</FormLabel>
                                                <FormControl className="mts-4">
                                                    <Input
                                                        type="text"
                                                        placeholder={(i.split('.')[2])}
                                                        {...field}
                                                    // onKeyDown={handleKeyPress}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-destructive font-medium text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                ))}

                                <FormField
                                    control={form.control}
                                    name={`collections.${index}.isVideo`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormLabel>Is media url is Video format</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="button"
                                    disabled={fields.length === 1}
                                    size={'icon'}
                                    onClick={() => remove(index)}
                                    className="bg-destructive mt-2"
                                >
                                    &times;
                                </Button>
                            </div>
                        ))}

                    </div>
                    <Button
                        type="button"
                        onClick={() =>
                            append({
                                heading: "",
                                text: "",
                                imgUrl: "",
                                shade: "",
                                textColor: "",
                                link: "",
                                textPosition: "",
                                textPositionV: "",
                                buttonText: "",
                                collectionId: "",
                                isVideo: false,
                            })
                        }
                    >
                        Add Collection
                    </Button>

                    <div className="flex gap-10">
                        <Button type="submit" disabled={isSubmtting} className="disabled:opacity-35">
                            {isSubmtting ? <LoaderIcon className="animate-spin mx-3" /> : initialData ? "Save" : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default HomePageDataForm;

