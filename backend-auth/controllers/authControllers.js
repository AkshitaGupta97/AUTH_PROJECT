import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, meassage: "Missing Details"})
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success: false, message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name, email, password: hashedPassword});

        await user.save(); // save user in database

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // it will be false for "production" environment, and true for "development"
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // for local environment : strict[as when we are running it,backend and frontend runs on same environment "localhost"], but when we run on production{verel} keep "none".
            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie will expire within 7 days, so we are converting into millisecond.
        });

        // sending mail from nodemailer => brevo

        return res.json({success: true});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({success: false, message: "email and Password is required"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "Invalid email"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // it will be false for "production" environment, and true for "development"
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // for local environment : strict[as when we are running it,backend and frontend runs on same environment "localhost"], but when we run on production{verel} keep "none".
            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie will expire within 7 days, so we are converting into millisecond.
        });

        return res.json({success: true});

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        })
        return res.json({success: true, message: "Logged out"})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}
