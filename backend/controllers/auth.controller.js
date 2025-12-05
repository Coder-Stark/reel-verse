import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//SignUp Controller
export const signUp = async (req, res)=>{
    try{
        const {name, email, password, username} = req.body;
        
        const findByEmail = await User.findOne({email});
        if(findByEmail){
            return res.status(400).json({message: "Email already Exist !"});
        }

        const findByUserName = await User.findOne({username});
        if(findByUserName){
            return res.status(400).json({message: "UserName already Exist !"});
        }
        
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters !"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user=await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        const token = await generateToken(user._id);         //from token.js

        res.cookie("token", token,{                          //creating cookie
            httpOnly: true,
            maxAge: 10*365*24*60*60*1000,                      //10 yr
            secure: false,                                   //should true in production
            sameSite: "Strict"
        });             
        
        return res.status(201).json(user);

    }catch(error){
        return res.status(500).json({message: `SignUp Error ${error}`});
    }
}

//SignIn Controller
export const signIn = async (req, res)=>{
    try{
        const {password, username} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: "User Not Found !"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Incorrect Password !"});
        }

        const token = await generateToken(user._id);         //from token.js

        res.cookie("token", token,{                          //creating cookie
            httpOnly: true,
            maxAge: 10*365*24*60*60*1000,                      //10 yr
            secure: false,                                   //should true in production
            sameSite: "Strict"
        });             
        
        return res.status(200).json(user);

    }catch(error){
        return res.status(500).json({message: `SignIn Error ${error}`});
    }
}


//SignOut Controller
export const signOut = async(req, res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({message: "Signout Successfully"});
    }catch(error){
        return res.status(500).json({message: `SignOut Error ${error}`});
    }
}