import fs from 'fs';
import Blog from '../models/Blog'
import jwt from 'jsonwebtoken'
const secret = 'asqwerdfcvzx12qwaszxerdfcv';

export const getBlog = async (req,res) => {
    const {id} = req.params;
    let blogRecord
    try {
        blogRecord = await Blog.findById(id).populate('author', ['name']);
    } catch (error) {
        console.log(error)
    }
    res.json(blogRecord);
}

export const getAllPosts = async(req,res) => {
    let blogs;
    try {
        blogs = await Blog.find()
                        .populate('author', ['name'])
                        .sort({createdAt: -1})

    } catch (error) {
        console.log(error)
    }
    return res.status(200).json(blogs)

}
export const getMyPosts = async(req,res) => {
    let blogs;
    try {
        blogs = await Blog.find()
                        .populate('author', ['name', 'email'])
                        .sort({createdAt: -1})

    } catch (error) {
        console.log(error)
    }
    return res.status(200).json(blogs)
}

export const postBlog = async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const newPath = path+'.'+parts[parts.length - 1];
    fs.renameSync(path, newPath);
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {title,description} = req.body;
        const post = await Blog.create({
            title,
            description,
            cover:newPath,
            comments: [],
            author:info.id,
        });
        res.json(post);
    });
}

export const editBlog = async (req,res) => {
    let newPath = null;
    if (req.file) {
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {id,title,description,comment} = req.body;
        const blog = await Blog.findOne({_id:id})
        if(comment) {
            const userName = req.body.name
            const post = await Blog.findOneAndUpdate({_id: id}, { $set: {comments: [...blog.comments, {'author':userName, 'details':comment}]}})
            res.json(post);
        } else {
            const isAuthor = JSON.stringify(blog.author) === JSON.stringify(info.id);
            if (!isAuthor) {
                return res.status(400).json('you are not the author');
            }
            const post = await Blog.findOneAndUpdate({_id: id}, { $set: {title, description, cover: newPath ? newPath : blog.cover}})
            res.json(post);
        }
    });
}
export const deleteBlog = async(req,res) => {
    const {id} = req.params
    const blog = await Blog.findOneAndDelete({_id: id})
    res.status(200).json(blog)
}