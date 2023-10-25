import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import mongoose from "mongoose";
import userRouter from './routes/user-routes'
import blogRouter from './routes/blog-routes'
const PORT = process.env.PORT || 5000
const app = express()
import path from 'path';
const __dirname = path.resolve();
// app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(cors({credentials:true,origin:['https://nikhil-blogapplication.netlify.app','http://localhost:3000']}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage('./scratch');

app.use("/user", userRouter);
app.use("/blog", blogRouter);

mongoose.connect('mongodb+srv://gnikhildas98:8uYTJgrUzjAIDyxa@cluster0.gidmgfr.mongodb.net/mern-blog?retryWrites=true&w=majority')

app.listen(PORT)