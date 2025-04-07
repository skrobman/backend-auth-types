import express from 'express';
import {User} from "../models/index.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try{
        const user = await User.findByPk(req.user.id, {attributes: {exclude: ['password']}});
        if(!user) return res.status(404).json({error: 'User does not exist'});

        res.json(user);
    }catch(err){
        res.status(500).json({
            error: 'Something went wrong',
            details: err.message});
    }
})

export default router;