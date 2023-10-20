import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const salt = bcrypt.genSaltSync(10);
const secret = 'asqwerdfcvzx12qwaszxerdfcv';

export const register = async (req,res)=> {
    const {name, email, password} = req.body;
    try {
        const user = await User.findOneAndUpdate({email: email}, { $set: { password: bcrypt.hashSync(password, salt), name }})
        if(!user) {
            const newUser = await User.create({name, email, password: bcrypt.hashSync(password, salt), blogs: []});
            res.json(newUser)
        } else {
            const user = await User.findOne({email: email})
            res.json(user)
        }
    } catch(err) {
        res.status(400).json(err)
    }
}

export const login = async (req,res)=> {
    const { email, password} = req.body;
    try {
        const user = await User.findOne({email: email})
        if(!user) {
            res.status(400).json('No user found')
        } else {
            const isValidUser = bcrypt.compareSync(password, user.password)
            if(isValidUser) {
                jwt.sign({email,id:user._id}, secret, {}, (err,token) => {
                    if (err) throw err;
                    res.cookie('token', token).json({
                      id:user._id,
                      name: user.name,
                    });
                });
            } else {
                res.status(400).json('Wrong Credentials')
            }
        }
    } catch(err) {
        res.status(400).json(err)
    }
}

export const profile = (req,res) => {
    const {token} = req.cookies;
    if(token) {
        jwt.verify(token, secret, {}, async(err,info) => {
            if (err) throw err;
            const user = await User.findOne({_id: info.id})
            info.name = user.name
            res.json(info);
          });
    }
    else {
        res.json('No session present')
    }
    
}

export const logout = (req,res) => {
    res.cookie('token', '').json('ok');
}