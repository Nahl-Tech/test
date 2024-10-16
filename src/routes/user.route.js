import express from "express";
import userController from "../controllers/user.controller.js";
const route = express.Router()

route.post('/', userController.insertBacklinks )
route.get("/", userController.fetchUsers);


export default route        