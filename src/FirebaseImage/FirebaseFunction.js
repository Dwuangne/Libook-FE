import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from '../FirebaseImage/Config'; // Adjust the import path based on your project structure
import { toast } from "react-toastify";

// Max images limit
const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2; // Limit the size to 2MB (for example)
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]; // Allowed image types

// Function to upload images to Firebase
export async function UploadImagesToFirebase(imagesArray) {

    // Validate number of images
    if (imagesArray.length > MAX_IMAGES) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
        throw new Error(`You can upload a maximum of ${MAX_IMAGES} images.`);
    }

    const storage = getStorage(app); // Initialize Firebase storage
    let uploadedImageUrls = [];

    for (const image of imagesArray) {
        // Check file type
        if (!allowedTypes.includes(image.type)) {
            toast.error(`Unsupported file type: ${image.type}. Only JPEG and PNG are allowed.`);
            throw new Error(`Unsupported file type: ${image.type}. Only JPEG and PNG are allowed.`);
        }

        // Check file size (converting to MB)
        const imageSizeMB = image.size / (1024 * 1024);
        if (imageSizeMB > MAX_SIZE_MB) {
            toast.error(`File size exceeds ${MAX_SIZE_MB}MB: ${image.name}`);
            throw new Error(`File size exceeds ${MAX_SIZE_MB}MB: ${image.name}`);
        }

        try {
            // Upload image to Firebase
            const storageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(storageRef, image);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            uploadedImageUrls.push(downloadURL);
        } catch (error) {
            toast.error(`Error uploading image: ${image.name}`);
            console.error("Error uploading image:", error);
            throw new Error(`Failed to upload ${image.name}`);
        }
    }

    // Return array of uploaded image URLs
    return uploadedImageUrls;
}

// Function to delete an image from Firebase using its URL
export async function DeleteImageFromFirebase(imageUrl) {
    const storage = getStorage(app); // Initialize Firebase storage

    try {
        // Create a reference from the URL
        const storageRef = ref(storage, imageUrl);

        // Delete the image
        await deleteObject(storageRef);
        console.log(`Image deleted successfully: ${imageUrl}`);
    } catch (error) {
        console.error("Error deleting image:", error);
        throw new Error(`Failed to delete image: ${imageUrl}`);
    }
}
