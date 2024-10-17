import post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming the cloudinary file is in utils folder
import { asyncHandler } from "../utils/asyncHandler.js"; // Importing asyncHandler for error handling
import { ApiError } from "../utils/ApiError.js"; // Importing ApiError for custom error messages
import { ApiResponse } from "../utils/ApiResponse.js"
import fs from "fs"; // To handle local file removal after upload

// Insert Post
const insertpost = asyncHandler(async (req, res) => {
    const { title, description, url_name, url } = req.body;

    if (!title || !description || !req.file || !url_name || !url) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // Image file path from multer
    const localFilePath = req.file.path;

    // Upload the image to Cloudinary
    const uploadResponse = await uploadOnCloudinary(localFilePath);

    if (!uploadResponse) {
        throw new ApiError(500, "Image upload failed");
    }

    // Create a new post document
    const newPost = await post.create({
        title,
        description,
        image: uploadResponse.secure_url, // Cloudinary image URL
        url_name,
        url
    });


    // res.status(201).json({
    //     success: true,
    //     message: "Post created successfully",
    //     post: newPost
    // });

    return res.status(201).json(
        new ApiResponse(200, newPost, "Post created successfully")
    )

});

// Fetch All Post
const fetchPosts = asyncHandler(async (req, res) => {

    // Use aggregation to fetch posts and total count in one query
    const result = await post.aggregate([
        {
            $facet: {
                posts: [{ $match: {} }], // Fetch posts (apply filters if needed)
                totalPosts: [{ $count: "count" }] // Count the total number of posts
            }
        }
    ]);

    // Extract posts and total count from the result
    const posts = result[0].posts;
    const totalPosts = result[0].totalPosts.length > 0 ? result[0].totalPosts[0].count : 0;

    // If no posts found, return an error
    if (!posts || posts.length === 0) {
        throw new ApiError(404, "No posts found");
    }

    // Send the response with all posts and the total count
    return res.status(200).json(
        new ApiResponse(200, { totalPosts, posts }, "Posts fetched successfully")
    );

});

// Fatch Specific Post
const fetchSpecificPosts = asyncHandler(async (req, res) => {

    // Use aggregation to fetch specific fields (title and description) and total count in one query
    const result = await post.aggregate([
        {
            $facet: {
                posts: [
                    { $match: {} }, // Match all documents (add filters here if needed)
                    { $project: { title: 1, description: 1 } } // Only include title and description
                ],
                totalPosts: [{ $count: "count" }] // Count the total number of posts
            }
        }
    ]);

    const posts = result[0].posts;
    const totalPosts = result[0].totalPosts.length > 0 ? result[0].totalPosts[0].count : 0;

    if (!posts || posts.length === 0) {
        throw new ApiError(404, "No posts found");
    }

    // Send the response with all posts and the total count
    return res.status(200).json(
        new ApiResponse(200, { totalPosts, posts }, "Posts fetched successfully")
    );

});

export default {
    insertpost,
    fetchPosts,
    fetchSpecificPosts
};
