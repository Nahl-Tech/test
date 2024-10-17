import express from "express";
import userController from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; // Import multer middleware for file handling

const route = express.Router();

route.post('/', upload.single('image'), userController.insertpost);
route.get('/', userController.fetchPosts);
route.get('/specificId/:id', userController.fetchPostById);
route.delete('/:id', userController.deletePost)
route.put('/:id', upload.single('image'), userController.updatePost);
// route.get('/specific', userController.fetchSpecificPosts);



export default route;
