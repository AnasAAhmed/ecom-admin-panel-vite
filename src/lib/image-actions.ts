import { API_BASE } from "../App";

export const validateImages = async (files: File[], isCollectionSize: boolean = false) => {
    const MAX_FILES = isCollectionSize ? 1 : 4;
    const MAX_SIZE_MB = 3;

    if (files.length > MAX_FILES) {
        return { valid: false, message: "You can only upload up to 4 images." };
    }

    for (const file of files) {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return { valid: false, message: `Each image must be 3MB or less.` };
        }

        const { valid: aspectValid, width, height, ratio } = await checkAspectRatio(file, isCollectionSize);
        if (!aspectValid) {
            return { valid: false, message: `Image with dimensions ratio:${ratio} & ${width}x${height} does not meet the required ${isCollectionSize ? '16:9' : '1:1 or 4:3'} aspect ratio.` };
        }
    }

    return { valid: true };
};

const checkAspectRatio = (
    file: File,
    isCollectionSize: boolean
): Promise<{ valid: boolean; width: number; height: number, ratio: number }> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const width = img.width;
            const height = img.height;

            const ratio = width / height;

            const isValid = isCollectionSize
                ? ratio >= 1.3 && ratio <= 1.9
                : ratio >= 0.75 && ratio <= 1.34;

            resolve({ valid: isValid, width, height, ratio });
        };
    });
};
type UpldImgs = {
    images: File[], removeImages?: string[]; isConvert?: boolean
}
export const uploadImages = async ({ images, removeImages, isConvert = false }: UpldImgs): Promise<string[] | null> => {
    const formData = new FormData();

    if (!images || images.length == 0) return null;;
    if (removeImages) {
        removeImages.forEach((image) => formData.append("removeImageUrls", image));
    }
    images.forEach((image) => formData.append("images", image));

    try {
        const res = await fetch(`${API_BASE}/api/admin/upload-images${isConvert ? '?isConvert=true' : ''}`, {
            method: "POST",
            credentials: 'include',
            body: formData,
        });

        if (!res.ok) throw new Error("Image upload failed: " + res.statusText);

        const data = await res.json();
        console.log(data);
        if (!Array.isArray(data)) {

            throw new Error("Image URLs missing or malformed")
        }

        return data;
    } catch (err) {
        console.error("[image_upload_error]", err);
        throw err;
    }
};

// const dimensionCheck = async (file: File) => {
//     return new Promise<{ valid: boolean; width: number; height: number }>((resolve) => {
//       const img = new Image();
//       img.src = URL.createObjectURL(file);
//       img.onload = () => {
//         const width = img.width;
//         const height = img.height;
//          const ratio = width / height;
//       const isSquare = Math.abs(ratio - 1) < 0.05; // 1:1
//       const isFourByThree = Math.abs(ratio - 4 / 3) < 0.05; // 4:3

//       const isValid = isSquare || isFourByThree;
//         resolve({ valid: isValid, width, height });
//       };
//     });
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     const filesArray = Array.from(files);
//     const totalFiles = value.length + filesArray.length;

//     if (totalFiles > 4) {
//       toast.warning("You can only upload a maximum of 4 images.");
//       return;
//     }
//     const oversizedFiles = filesArray.filter((file) => file.size > 3 * 1024 * 1024);
//     if (oversizedFiles.length > 0) {
//       toast.warning("Each file must be 3MB or less.");
//       return;
//     }
//     const invalidFormatFiles = filesArray.filter(
//       (file) => file.type !== "image/webp" && file.type !== "image/avif"
//     );
//     if (invalidFormatFiles.length > 0) {
//       toast.warning(
//         "Please prefer uploading images in .webp or .avif format for better performance and efficient storage. While formats like .jpg and .png are supported on the frontend (via Next.js <Image />) which turns any image in webp anyway but, optimized formats help reduce storage size and load faster."
//       );
//     }

//     for (const file of filesArray) {
//       const { valid, width, height } = await dimensionCheck(file);
//       if (!valid) {
//         toast.warning(`Image "${file.name}" is not square (e.g. ${width}x${height}). Please upload square or standard product images.`);
//         return;
//       }
//     }
//     const newFiles = Array.from(files);
//     onChange([...value, ...newFiles]);
//     e.target.value = "";
//   };