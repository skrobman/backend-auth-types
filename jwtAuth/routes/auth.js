import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/index.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, password, email} = req.body;
    try{
        //Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        //Create new user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email
        });

        res.status(201).json({
            msg: 'New user has been registered',
            userId: newUser.id
        });

    }catch(err){
        res.status(500).json({
            error: 'Error creating user.',
            details: err.message
        });
    }
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({where: { username }});
        if (!user) {
            res.status(400).json({error: 'Error: can not find user'});
        }

        const isPasswordValid = bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            res.status(400).json({error: 'Invalid password'});
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.status(200).json({message:'Authenticated successfully', token});

    }catch(err){
        res.status(500).json({
            error: 'Authorization error',
            details: err.message
        });
    }
});

export default router;