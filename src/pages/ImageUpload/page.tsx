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

    // Images to remove manually or via UI
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [manualRemoveInput, setManualRemoveInput] = useState<string>("");

    const [returnedUrls, setReturnedUrls] = useState<string[]>([]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files || files.length === 0) {
            toast.error("At least one image is required.");
            return;
        }

        try {
            setIsSubmtting(true);
            toast.loading(isConvert ? 'Converting & Uploading images...' : "Uploading images...");

            // Merge manually entered URLs (line-separated) with selected ones
            const manualURLs = manualRemoveInput
                .split("\n")
                .map(url => url.trim())
                .filter(Boolean); // Remove empty lines

            const mergedRemoveList = Array.from(new Set([...imagesToRemove, ...manualURLs]));

            const uploadedUrls = await uploadImages({
                images: files,
                isConvert,
                removeImages: mergedRemoveList
            });

            if (uploadedUrls) {
                setReturnedUrls(uploadedUrls);
            }

            toast.dismiss();
            toast.success(`Uploaded successfully.`);
        } catch (err) {
            console.error("[image_upload_error]", err);
            toast.error(`Something went wrong. ${(err as Error).message}`);
        } finally {
            setIsSubmtting(false);
            toast.dismiss();
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
                    {isSubmtting ? "Uploading..." : "Upload"}
                </Button>
            </form>
            <Button type="submit" disabled={isSubmtting}>
                <Link to={'https://uploadthing.com/dashboard/anasaahmed-personal-team/e1s0bwzoxc/files'} target="_blank">
                   Uploadthing dashboard
                </Link>
                </Button>
                    <p className="text-muted-foreground text-sm">Uploaded URLs: {JSON.stringify(returnedUrls)}</p>
        </div>
    );
};

export default ImageUploadPage;
