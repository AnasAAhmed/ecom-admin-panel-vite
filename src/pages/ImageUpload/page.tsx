import { useState } from "react";
import ImageUpload from "../../components/custom ui/ImageUpload";
import { toast } from "sonner";
import { uploadImages } from "../../lib/image-actions";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea"; // if you're using shadcn/ui
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";

const ImageUploadPage = () => {
    const [oldImages, setOldImages] = useState<string[] | undefined>([]);

    const [isSubmtting, setIsSubmtting] = useState(false);
    const [isConvert, setIsConvert] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    // Images to remove manually or via URL
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [manualRemoveInput, setManualRemoveInput] = useState<string>("");

    const [returnedUrls, setReturnedUrls] = useState<string[]>([]);
    const [deleteResult, setDeleteResult] = useState<{
        success: boolean;
        deletedCount: number;
    } | undefined>(undefined);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const manualURLs = manualRemoveInput
            .split(",")
            .map(url => url.trim())
            .filter(Boolean) || null;

        if (!files.length && !manualURLs.length) {
            toast.error("At least one image is required OR Delete Image Url.");
            return;
        }

        try {
            setIsSubmtting(true);
            let toastMsg = "";

            if (files?.length > 0 && manualURLs.length > 0) {
                toastMsg = isConvert
                    ? "Converting, uploading & deleting images..."
                    : "Uploading & deleting images...";
            } else if (files?.length > 0) {
                toastMsg = isConvert
                    ? "Converting & uploading images..."
                    : "Uploading images...";
            } else if (manualURLs.length > 0) {
                toastMsg = "Deleting images...";
            }

            const loadingId = toast.loading(toastMsg);

            // Merge manually entered URLs (line-separated) with selected ones
            const mergedRemoveList = Array.from(new Set([...imagesToRemove, ...manualURLs]));

            const res = await uploadImages({
                images: files,
                isConvert,
                removeImages: mergedRemoveList
            });
            if (res) {
                if (Array.isArray(res.data.uploaded)) {
                    setReturnedUrls(res.data.uploaded);
                    toast.success(res.statusText);

                } else {
                    toast.success(res.statusText)
                }
                setDeleteResult(res.data.deleteRes)
            }

            toast.dismiss(loadingId);
        } catch (err) {
            toast.dismiss();
            console.error("[image_upload_error]", err);
            toast.error(`Something went wrong. ${(err as Error).message}`);
        } finally {
            setIsSubmtting(false);
        }
    };

    return (
        <div className="p-4 space-y-4">

            <form onSubmit={onSubmit} className="space-y-6">
                <ImageUpload
                    isSeparate
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

                <div className="space-y-2">
                    <Label htmlFor="manualUrls" className="block text-sm font-medium">Manually Add URLs to Delete (one per line or single gap in btw)</Label>
                    <Textarea
                        id="manualUrls"
                        rows={4}
                        value={manualRemoveInput}
                        onChange={(e) => setManualRemoveInput(e.target.value)}
                        placeholder="https://example.com/image1.webp https://example.com/image2.webp"
                    />
                </div>

                <Button type="submit" disabled={isSubmtting}>
                    {isSubmtting ? "Submitting..." : "Submit"}
                </Button>
            </form>
            <Button type="submit" disabled={isSubmtting}>
                <Link to={'https://uploadthing.com/dashboard/anasaahmed-personal-team/e1s0bwzoxc/files'} target="_blank">
                    Uploadthing dashboard
                </Link>
            </Button>
            <p className="text-muted-foreground text-sm">Uploaded URLs: {JSON.stringify(returnedUrls)}</p>
            <p className="text-muted-foreground text-sm">DeleteResult: {JSON.stringify(deleteResult)}</p>
        </div>
    );
};

export default ImageUploadPage;
