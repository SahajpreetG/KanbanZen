// lib/getURL.ts

import { storage } from "@/appwrite";

const getUrl = async (image?: Image): Promise<string | null> => {
    if (!image) return null;
    try {
        // Use getFileView for publicly accessible files
        const result = storage.getFileView(image.bucketId, image.fileId);
        return result.href; // Returns the URL as a string
    } catch (error) {
        console.error('Error fetching file view URL:', error);
        return null;
    }
};

export default getUrl;
