import express from "express";
import { register, login, profile, logout } from './../controllers/user-controller'

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/profile", profile);
userRouter.get("/", login);

export default userRouter;