import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js"; // Import ApiError class for better error handling
import dotenv from "dotenv"
dotenv.config({ path: './config.env' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) throw new ApiError(400, "No file path provided");

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded successfully, delete the local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {
        // Remove the local file if upload fails and log error properly
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        // Log the error message for debugging
        console.error("Cloudinary Upload Error:", error);

        // Throw an ApiError with detailed information
        throw new ApiError(500, "File upload failed on Cloudinary", [error.message]);
    }
};

// Delete Image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) throw new ApiError(400, "No image URL provided");

        // Extract public ID from the image URL
        const publicId = imageUrl.split("/").pop().split(".")[0];

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        return true;
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error);

        // Throw an ApiError with detailed information
        throw new ApiError(500, "Image deletion failed on Cloudinary", [error.message]);
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
