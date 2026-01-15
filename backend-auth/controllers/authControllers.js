import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";
import transporter from '../config/nodemailer.js';

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
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to:  user.email,
            subject: 'Welcome to Akshita hub',
            text: `Welcome to Akshita hub website. Your account has been created with email id: ${email}`,
            html: `Welcome, your account has been created successfully.`
        }
        await transporter.verify();
        
        await transporter.sendMail(mailOptions);

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

// email verification function

export const sendVerifyOtp = async (req, res) => {
    try{
        const userId = req.user.id;
        const user =  await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success: false, message: "Account Already Verified !!"});
        }
        // for otp generation use -> 
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 4 * 60 * 1000;  // 1 sec = 1000 millisecond, 

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP  ',
            text: `Yourt OTP ${otp}. Verify your account using this OTP`,
            html: `Welcome.`
        }
        await transporter.sendMail(mailOption);

        res.json({success: true, message: "Verify, OTP sent on Email"});

    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}
/*
Math.random() -> range[0 < 1] 0.0003, 0.34, 0.4
Math.random() * 900000 -> range[0-89999]
100000 + Math.random() -> 999999
*/

export const verifyEmail = async (req, res) => {
    //const {userId, otp} = req.body;
    const userId = req.user.id;
    const {otp} =  req.body;

    if(!userId || !otp){
        return res.json({success: false, message: "Missing Details"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        if(user.verifyOpt === '' || user.verifyOpt != otp){
            return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }
        user.isAccountVerified = true;
        // reset them
        user.verifyOpt = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: 'Email verified Successfully...'});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// here we are creating function,  without logic, because before this function we execute middleware whenever user is authenticated.
export const isAuthenticated = async(req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// password reset function
export const sendResetOtp = async(req, res) => {
    const {email} = req.body;
    if(!email) {
        return res.json({success: false, message: "Email is required"})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        // for otp generation use -> 
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;  // 1 sec = 1000 millisecond, 

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP  ',
            text: `Yourt OTP ${otp}. Reset your account using this OTP`,
            html: `Welcome.`
        }
        await transporter.sendMail(mailOption);

        res.json({success: true, message: "Verify, OTP sent on Email"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// reset user passsword
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword) {
        return res.json({success:false, message: error.message});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "User not found"});
        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success:false, message: "Invalid Otp"});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message: "OTP Expired!"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: "Password has been reset successfully..."});

    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}
