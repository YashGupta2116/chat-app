import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/jwt.util.js";
import cloudinary from "../lib/cloudinary.js";

export const singup = async (req, res) => {
    try {
        const {email , password , fullName} = req.body;
        
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        if (password.length < 6) {
            return res.status(400).json({messgae: "Password is needed and must be more than 6 characters long !"});
        }

        const user = await User.findOne({email});

        if (user) {
            return res.status(400).json({messgae: "user with email already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (!newUser) {
            return res.status(400).json({message: "Invalid user data"});
        }

        // generate jwt token 
        generateToken(newUser._id , res);

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.log("Error in Signup controller" , error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req ,res) => {
    try {
        const {email , password} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid Credentials"});            
        }
        
        generateToken(user._id , res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profile,
        })

    } catch (error) {
        console.log("Error in Login controller" , error.message);
        res.status(400).json({message: "Internal Server Error"});
    }
}

export const logout = async (req , res) => {
    try {
        res.cookie("jwt" , "" , {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in Login controller" , error.message);
        res.status(400).json({message: "Internal Server Error"});
    }
}


export const updateProfile = async (req , res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // as the user is on a protected route
        
        if(!profilePic) {
            return res.status(400).json({message: "Profile pic is required"});
        }

        const uploadedPic = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId , {profilePic: uploadedPic.secure_url} , {new: true});

        res.status(200).json({message: "updated user"});
    } catch (error) {
        console.log("error in update profile controler" , error);
        res.status(500).json({message: "internal server error"});
    }
}

export const checkAuth = (req ,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller" , error.message);
        res.status(500).json({message: "Internal server error"});
    }
}