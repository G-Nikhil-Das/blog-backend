import express from "express";
import { getBlog, postBlog, editBlog, getAllPosts, getMyPosts, deleteBlog } from './../controllers/blog-controller'
import multer from 'multer';
const uploadMiddleware = multer({ dest: 'uploads/' });

const blogRouter = express.Router();

blogRouter.post("/post",uploadMiddleware.single('file'), postBlog);
blogRouter.put("/post/:id",uploadMiddleware.single('file'), editBlog);
blogRouter.delete("/delete/:id", deleteBlog);
blogRouter.get("/getPosts", getAllPosts);
blogRouter.get("/getMyPosts", getMyPosts);
blogRouter.get("/:id", getBlog);

export default blogRouter;
