import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/jwt.util.js";

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

}

export const logout = async (req , res) => {

}