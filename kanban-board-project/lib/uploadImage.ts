// lib/uploadImage.ts

import { ID, storage, account } from "@/appwrite"; // Import 'account' from '@/appwrite'
import { Permission, Role } from "appwrite"; // Import 'Permission' and 'Role' from 'appwrite' package

const uploadImage = async (file: File) => {
    if (!file) return null;

    try {
        // Get the current user's ID
        const user = await account.get();
        const userId = user.$id;

        const fileUploaded = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
            ID.unique(),
            file,
            [
                Permission.read(Role.any()),                // Allow public read access
                Permission.update(Role.user(userId)),      // Allow current user to update
                Permission.delete(Role.user(userId)),      // Allow current user to delete
            ]
        );

        return fileUploaded;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

export default uploadImage;
